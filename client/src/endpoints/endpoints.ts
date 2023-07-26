export const BASE_URL = 'http://localhost:3000';

export const ENDPOINTS = {
  createOrganization: `${BASE_URL}/organization/create`,
  googleSignIn: `${BASE_URL}/identity/google-signin`,
  logout: `${BASE_URL}/identity/logout`,
  myOrganizations: `${BASE_URL}/organization/my-organizations`,
  organizationDetails: `${BASE_URL}/organization/details`, // param id
  validateSession: `${BASE_URL}/identity/validate-session`,
};
