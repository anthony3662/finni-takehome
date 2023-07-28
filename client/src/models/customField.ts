export enum FieldPermission {
  all = 'all',
  doctor = 'doctor',
}

export type CustomField = {
  name: string;
  viewPermission: FieldPermission;
  value: string;
};
