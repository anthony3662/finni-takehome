import { Organization } from '../models/organization';

export type Role = 'doctor' | 'clerk';

export type CreateOrganizationParams = {
  name: string;
  description: string;
  address: string;
};

export type CreateOrganizationResponse = {
  newOrganization: Organization;
};

export type MyOrganizationsResponse = {
  myOrganizations: {
    _id: string;
    email: string;
    role: Role;
    organizationId: Organization;
  }[];
};

export type OrganizationDetailsResponse = {
  organization: Organization;
  users: {
    _id: string;
    email: string;
    organizationId: string;
    role: Role;
  }[];
};
