export enum Role {
  doctor = 'doctor',
  clerk = 'clerk',
}

export type OrganizationUser = {
  _id: string;
  email: string;
  organizationId: string;
  role: Role;
};
