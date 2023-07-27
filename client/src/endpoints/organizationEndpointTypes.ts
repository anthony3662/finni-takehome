import { Organization } from '../models/organization';
import { OrganizationUser } from '../models/organizationUser';
import { Role } from '../models/organizationUser';

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
  users: OrganizationUser[];
  myOrgUser: OrganizationUser;
};

export type AddMemberParams = {
  email: string;
  role: Role;
  organizationId: string;
};

export type AddMemberResponse = {
  newOrgUser: {
    _id: string;
    email: string;
    organizationId: string;
    role: Role;
  };
};

export type DeleteMemberParams = {
  orgUserId: string;
};

export type DeleteMemberResponse = {
  success: boolean;
};
