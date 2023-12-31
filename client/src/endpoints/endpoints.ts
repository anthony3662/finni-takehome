export const BASE_URL = 'http://localhost:3000';

export const IDENTITY_ENDPOINTS = {
  googleSignIn: `${BASE_URL}/identity/google-signin`,
  logout: `${BASE_URL}/identity/logout`,
  validateSession: `${BASE_URL}/identity/validate-session`,
};

export const ORGANIZATION_ENDPOINTS = {
  addMember: `${BASE_URL}/organization/add-member`,
  createOrganization: `${BASE_URL}/organization/create`,
  myOrganizations: `${BASE_URL}/organization/my-organizations`,
  organizationDetails: `${BASE_URL}/organization/details`, // param id
  removeMember: `${BASE_URL}/organization/delete-member`,
};

export const PATIENT_ENDPOINTS = {
  deletePatient: `${BASE_URL}/patient/delete`, //param patientId
  upsertPatient: `${BASE_URL}/patient/upsert`,
  patientList: `${BASE_URL}/patient/list`, // param organizationId
};

export const ENDPOINTS = {
  ...IDENTITY_ENDPOINTS,
  ...ORGANIZATION_ENDPOINTS,
  ...PATIENT_ENDPOINTS,
};
