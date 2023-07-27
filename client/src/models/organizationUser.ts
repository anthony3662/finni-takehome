import { Role } from '../endpoints/organizationEndpointTypes';

export type OrganizationUser = {
  _id: string;
  email: string;
  organizationId: string;
  role: Role;
};
