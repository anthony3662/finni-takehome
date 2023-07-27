export enum PatientStatus {
  inquiry = 'inquiry',
  onboarding = 'onboarding',
  active = 'active',
  churned = 'churned',
}

export type Address = {
  _id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

export type Patient = {
  _id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: Date;
  organizationId: string;
  status: PatientStatus;
  addresses: Address[];
};
