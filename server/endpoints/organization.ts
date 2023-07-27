import { Request, Response } from '../types/expressTypes';
import { OrganizationUserDocument, Role } from '../models/organizationUser';
const emailRegex = require('../constants/email');

const express = require('express');
const router = express.Router();

const Organization = require('../models/organization');
const OrganizationUser = require('../models/organizationUser');

const cookieCheckMiddleware = require('../middleware/cookieCheck');
router.use(cookieCheckMiddleware);

interface CreateOrganizationParams extends Request {
  body: {
    name: string;
    description: string;
    address: string;
  };
}
router.post('/create', async (req: CreateOrganizationParams, res: Response) => {
  const { name, description, address } = req.body;
  const { email } = req.session;
  if (!name || !description || !address) {
    res.sendStatus(400);
    return;
  }

  const newOrg = await Organization.model.create({
    name,
    description,
    address,
  });

  await OrganizationUser.model.create({
    email,
    organizationId: newOrg._id,
    role: 'doctor',
  });
  res.json({
    newOrganization: newOrg,
  });
});

router.get('/my-organizations', async (req: Request, res: Response) => {
  const { email } = req.session;

  const myOrgs = await OrganizationUser.model
    .find({ email })
    .populate('organizationId')
    .exec();
  res.json({
    myOrganizations: myOrgs,
  });
});

router.get('/details/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.session;
  if (!id) {
    res.sendStatus(400);
    return;
  }

  const org = await Organization.model.findById(id).exec();
  const users = await OrganizationUser.model
    .find({ organizationId: id })
    .exec();
  const myOrgUser = await OrganizationUser.model
    .findOne({ email, organizationId: id })
    .exec();

  if (!myOrgUser) {
    // user not authorized to view
    res.sendStatus(403);
    return;
  }

  res.json({
    organization: org,
    users,
    myOrgUser,
  });
});

interface AddMemberParams extends Request {
  body: {
    organizationId: string;
    email: string;
    role: Role;
  };
}
router.post('/add-member', async (req: AddMemberParams, res: Response) => {
  const { email: initiatingEmail } = req.session;
  const { email: newEmail, role, organizationId } = req.body;

  if (
    !newEmail ||
    !role ||
    !organizationId ||
    !emailRegex.test(newEmail) ||
    newEmail === initiatingEmail // cannot mutate own user
  ) {
    res.sendStatus(400);
    return;
  }

  // get current user to verify permissions
  const orgUser: OrganizationUserDocument | null = await OrganizationUser.model
    .findOne({ email: initiatingEmail, organizationId })
    .exec();

  if (!orgUser || orgUser.role !== 'doctor') {
    // user not authorized to perform operation
    res.sendStatus(403);
    return;
  }

  // overwrite if already exists, role may change as result.
  const newOrgUser = await OrganizationUser.model.findOneAndUpdate(
    { email: newEmail, organizationId },
    { email: newEmail, organizationId, role },
    { upsert: true, new: true }
  );

  res.json({
    newOrgUser,
  });
});

interface DeleteMemberParams extends Request {
  body: {
    orgUserId: string;
  };
}
router.post(
  '/delete-member',
  async (req: DeleteMemberParams, res: Response) => {
    const { email: initiatingEmail } = req.session;
    const { orgUserId } = req.body;

    if (!orgUserId) {
      res.sendStatus(400);
      return;
    }

    const orgUser: OrganizationUserDocument =
      await OrganizationUser.model.findById(orgUserId);

    if (!orgUser || orgUser.email === initiatingEmail) {
      // cannot delete self
      res.sendStatus(400);
      return;
    }
    const { organizationId } = orgUser;

    // get current user to verify permissions
    const myOrgUser: OrganizationUserDocument | null =
      await OrganizationUser.model
        .findOne({ email: initiatingEmail, organizationId })
        .exec();

    if (!myOrgUser || myOrgUser.role !== 'doctor') {
      // user not authorized to perform operation
      res.sendStatus(403);
      return;
    }

    await OrganizationUser.model.findByIdAndDelete(orgUserId).exec();
    res.json({ success: true });
  }
);

module.exports = router;
