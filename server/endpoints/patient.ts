import { Request, Response } from '../types/expressTypes';
import { OrganizationUserDocument, Role } from '../models/organizationUser';
import { PatientDocument } from '../models/patient';
import { CustomField } from '../models/customField';

const express = require('express');
const router = express.Router();

const Organization = require('../models/organization');
const OrganizationUser = require('../models/organizationUser');
const Patient = require('../models/patient');

const cookieCheckMiddleware = require('../middleware/cookieCheck');
router.use(cookieCheckMiddleware);

interface CreatePatientParams extends Request {
  body: {
    patient: Omit<PatientDocument, 'customFields'> & {
      customFields: CustomField[];
    };
  };
}
// edits if _id field included, otherwise inserts.
router.post('/upsert', async (req: CreatePatientParams, res: Response) => {
  const { email: initiatingEmail } = req.session;
  const { patient } = req.body;

  if (!patient) {
    res.sendStatus(400);
    return;
  }

  // get current user to verify permissions
  const myUser: OrganizationUserDocument | null = await OrganizationUser.model
    .findOne({ email: initiatingEmail, organizationId: patient.organizationId })
    .exec();

  if (!myUser || myUser.role !== 'doctor') {
    // user not authorized to perform operation
    res.sendStatus(403);
    return;
  }

  if (patient._id) {
    // editing existing
    const patientWithoutId = { ...patient };
    delete patientWithoutId._id;
    const newPatient = await Patient.model
      .findByIdAndUpdate(patient._id, patientWithoutId)
      .exec();
    res.json({
      newPatient,
    });
    return;
  }

  const newPatient = await Patient.model.create(patient);

  res.json({
    newPatient,
  });
});

router.post('/list/:organizationId', async (req: Request, res: Response) => {
  const { organizationId } = req.params;
  const { email } = req.session;

  if (!organizationId) {
    res.sendStatus(400);
    return;
  }

  const myOrgUser: OrganizationUserDocument = await OrganizationUser.model
    .findOne({ email, organizationId })
    .exec();

  if (!myOrgUser) {
    // user not authorized to view
    res.sendStatus(403);
    return;
  }

  const patients: PatientDocument[] = await Patient.model
    .find({ organizationId })
    .exec();

  if (myOrgUser.role !== 'doctor') {
    // Filter out CustomField subdocuments user not allowed to see
    patients.forEach((patient) => {
      patient.customFields = patient.customFields.filter(
        (field) => field.viewPermission === 'all'
      );
    });
  }

  res.json({
    patients,
  });
});

router.get('/delete/:patientId', async (req: Request, res: Response) => {
  const { email } = req.session;
  const { patientId } = req.params;
  const patientToDelete: PatientDocument = await Patient.model
    .findById(patientId)
    .exec();

  if (!patientToDelete) {
    res.sendStatus(409);
    return;
  }

  const myOrgUser = await OrganizationUser.model
    .findOne({ email, organizationId: patientToDelete.organizationId })
    .exec();

  if (!myOrgUser || myOrgUser.role !== 'doctor') {
    // user not authorized to perform operation
    res.sendStatus(403);
    return;
  }

  await Patient.model.findByIdAndDelete(patientId).exec();
  res.json({ success: true });
});

module.exports = router;
