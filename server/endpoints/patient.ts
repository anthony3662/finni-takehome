import { Request, Response } from '../types/expressTypes';
import { OrganizationUserDocument, Role } from '../models/organizationUser';
import { PatientDocument } from '../models/patient';

const express = require('express');
const router = express.Router();

const Organization = require('../models/organization');
const OrganizationUser = require('../models/organizationUser');
const Patient = require('../models/patient');

const cookieCheckMiddleware = require('../middleware/cookieCheck');
router.use(cookieCheckMiddleware);

interface CreatePatientParams extends Request {
  body: {
    patient: PatientDocument;
  };
}
router.post('/create', async (req: CreatePatientParams, res: Response) => {
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

  const myOrgUser = await OrganizationUser.model
    .findOne({ email, organizationId })
    .exec();

  if (!myOrgUser) {
    // user not authorized to view
    res.sendStatus(403);
    return;
  }

  const patients = await Patient.model.find({ organizationId }).exec();

  res.json({
    patients,
  });
});

module.exports = router;
