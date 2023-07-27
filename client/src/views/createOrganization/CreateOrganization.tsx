import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoadingButton } from '@mui/lab';
import { TextField, Grid } from '@mui/material';
import { useRequest } from '../../utils/useRequest';
import { generatePath, useNavigate } from 'react-router-dom';
import { CreateOrganizationParams, CreateOrganizationResponse } from '../../endpoints/organizationEndpointTypes';
import { ENDPOINTS, ORGANIZATION_ENDPOINTS } from '../../endpoints/endpoints';
import { ROUTES } from '../../routes/ROUTES';

interface FormValues {
  organizationName: string;
  summaryOfServices: string;
  address: string;
}

const initialValues: FormValues = {
  organizationName: '',
  summaryOfServices: '',
  address: '',
};

const validateForm = (values: FormValues) => {
  const errors: Partial<FormValues> = {};

  if (!values.organizationName) {
    errors.organizationName = 'Required';
  } else if (values.organizationName.trim().length < 3 || values.organizationName.trim().length > 50) {
    errors.organizationName = 'Must be between 3 and 50 characters';
  }

  if (!values.summaryOfServices) {
    errors.summaryOfServices = 'Required';
  } else if (values.summaryOfServices.trim().length < 20 || values.summaryOfServices.trim().length > 200) {
    errors.summaryOfServices = 'Must be between 20 and 200 characters';
  }

  if (!values.address.trim()) {
    errors.address = 'Required';
  }

  return errors;
};

export const CreateOrganization = () => {
  const navigate = useNavigate();
  const { post, isLoading } = useRequest<CreateOrganizationResponse, CreateOrganizationParams>();
  const handleSubmit = async (values: FormValues) => {
    const { organizationName, summaryOfServices, address } = values;
    const response = await post({
      endpoint: ORGANIZATION_ENDPOINTS.createOrganization,
      body: {
        name: organizationName,
        description: summaryOfServices,
        address,
      },
    });
    if (response.newOrganization) {
      navigate(generatePath(ROUTES.organization.detail, { id: response.newOrganization._id }));
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <Formik initialValues={initialValues} validate={validateForm} onSubmit={handleSubmit}>
        {({ dirty, isValid }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field name='organizationName' as={TextField} label='Organization Name' fullWidth required />
                <ErrorMessage name='organizationName' component='div' />
              </Grid>
              <Grid item xs={12}>
                <Field name='summaryOfServices' as={TextField} label='Summary of Services' multiline rows={4} fullWidth required />
                <ErrorMessage name='summaryOfServices' component='div' />
              </Grid>
              <Grid item xs={12}>
                <Field name='address' as={TextField} label='Address' fullWidth required />
                <ErrorMessage name='address' component='div' />
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  loading={isLoading}
                  fullWidth
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={!dirty || !isValid}>
                  Submit
                </LoadingButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};
