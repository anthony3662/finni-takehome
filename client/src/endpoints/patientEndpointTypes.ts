import { Filters, Patient } from '../models/patient';

export type CreatePatientParams = {
  patient: Omit<Patient, '_id'>;
};

export type CreatePatientResponse = {
  newPatient: Patient;
};

export type PatientListParams = {
  filters: Filters;
};

export type PatientListResponse = {
  patients: Patient[];
};

export type DeletePatientResponse = { success: boolean };
