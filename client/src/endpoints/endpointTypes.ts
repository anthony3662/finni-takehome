import { Organization } from '../models/organization';

export type CreateOrganizationParams = {
  name: string;
  description: string;
  address: string;
};

export type CreateOrganizationResponse = {
  newOrganization: Organization;
};
