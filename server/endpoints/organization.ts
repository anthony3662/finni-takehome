import { Request, Response } from '../types/expressTypes';

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

  const newOrgUser = await OrganizationUser.model.create({
    email,
    organizationId: newOrg._id,
    role: 'doctor',
  });
  res.json({
    newOrganization: newOrg,
  });
});

module.exports = router;
