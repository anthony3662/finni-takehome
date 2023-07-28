import { Patient } from '../models/patient';
import { Filters } from '../views/organizationDetails/patients/Patients';

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
