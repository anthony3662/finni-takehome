import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import { DatePicker } from '@mui/x-date-pickers';
import { Button, Container, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import * as yup from 'yup';
import moment from 'moment';
import type { Address, Patient } from '../../../models/patient';
import { useRequest } from '../../../utils/useRequest';
import { CreatePatientParams, CreatePatientResponse } from '../../../endpoints/patientEndpointTypes';
import { PatientStatus } from '../../../models/patient';
import { PATIENT_ENDPOINTS } from '../../../endpoints/endpoints';
import { OrganizationDetailsResponse } from '../../../endpoints/organizationEndpointTypes';
import { LoadingButton } from '@mui/lab';
import { CustomField, FieldPermission } from '../../../models/customField';

const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  dateOfBirth: yup.date().required('Date of Birth is required').max(new Date(), 'Date of Birth cannot be in the future'),
  status: yup.string().required('Status is required'),
  addresses: yup.array().of(
    yup.object().shape({
      street: yup.string().required('Street is required'),
      city: yup.string().required('City is required'),
      state: yup.string().required('State is required'),
      zipCode: yup.string().required('ZIP is required'),
    }),
  ),
  customFields: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Name is required'),
      value: yup.string().required('Value is required'),
      viewPermission: yup.string().required('Permission is required'),
    }),
  ),
});

interface PatientFormValues {
  _id?: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: Date | null;
  status: PatientStatus | '';
  addresses: Address[];
  customFields: CustomField[];
}

type Props = { orgDetails: OrganizationDetailsResponse; onSubmit: () => any; patientToEdit?: Patient };
export const PatientForm: React.FC<Props> = ({ orgDetails, onSubmit, patientToEdit }) => {
  const { post, isLoading } = useRequest<CreatePatientResponse, CreatePatientParams>();

  const initialValues: PatientFormValues = patientToEdit || {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: null,
    status: '',
    addresses: [], // Initial empty array for addresses,
    customFields: [],
  };

  const handleSubmit = async (values: PatientFormValues) => {
    const { firstName, middleName, lastName, dateOfBirth, status, addresses, customFields } = values;
    await post({
      endpoint: PATIENT_ENDPOINTS.upsertPatient,
      body: {
        patient: {
          firstName,
          middleName: middleName || null,
          lastName,
          dateOfBirth: dateOfBirth!,
          organizationId: orgDetails.organization._id,
          status: status as PatientStatus,
          addresses,
          customFields,
          ...(patientToEdit ? { _id: patientToEdit._id } : {}),
        },
      },
    });
    onSubmit();
  };

  return (
    <Container>
      <Typography variant='h5' gutterBottom>
        New Patient Form
      </Typography>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, isValid }) => (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}>
            <Field component={TextField} name='firstName' label='First Name' fullWidth />
            <ErrorMessage name='firstName' />

            <Field component={TextField} name='middleName' label='Middle Name' fullWidth />
            <ErrorMessage name='middleName' />

            <Field component={TextField} name='lastName' label='Last Name' fullWidth />
            <ErrorMessage name='lastName' />

            <Field name='dateOfBirth'>
              {({ field, form }: any) => (
                <DatePicker
                  {...field}
                  label='Date of Birth'
                  value={field.value ? moment(field.value) : null}
                  disableFuture
                  onChange={(v: any) => form.setFieldValue('dateOfBirth', v ? v._d : null)}
                />
              )}
            </Field>
            <ErrorMessage name='dateOfBirth' />

            <Field name='status'>
              {({ field, form }: any) => (
                <ToggleButtonGroup exclusive value={field.value} onChange={(_, newValue) => form.setFieldValue('status', newValue)}>
                  <ToggleButton value={PatientStatus.inquiry}>Inquiry</ToggleButton>
                  <ToggleButton value={PatientStatus.onboarding}>Onboard</ToggleButton>
                  <ToggleButton value={PatientStatus.active}>Active</ToggleButton>
                  <ToggleButton value={PatientStatus.churned}>Churn</ToggleButton>
                </ToggleButtonGroup>
              )}
            </Field>
            <ErrorMessage name='status' />

            {/* FieldArray for addresses */}
            <FieldArray name='addresses'>
              {({ push, remove, form }: any) => (
                <>
                  {form.values.addresses.map((address: Address, index: number) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <Field component={TextField} name={`addresses[${index}].street`} label='Street' fullWidth />
                      <ErrorMessage name={`addresses[${index}].street`} />

                      <Field component={TextField} name={`addresses[${index}].city`} label='City' fullWidth />
                      <ErrorMessage name={`addresses[${index}].city`} />

                      <Field component={TextField} name={`addresses[${index}].state`} label='State' fullWidth />
                      <ErrorMessage name={`addresses[${index}].state`} />

                      <Field component={TextField} name={`addresses[${index}].zipCode`} label='ZIP' fullWidth />
                      <ErrorMessage name={`addresses[${index}].zipCode`} />

                      <Button variant='outlined' color='error' onClick={() => remove(index)}>
                        Remove Address
                      </Button>
                    </div>
                  ))}
                  <Button color='primary' onClick={() => push({ street: '', city: '', state: '', zip: '' })}>
                    Add Address
                  </Button>
                </>
              )}
            </FieldArray>

            <FieldArray name='customFields'>
              {({ push, remove, form }: any) => (
                <>
                  {form.values.customFields.map((customField: CustomField, index: number) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <Field component={TextField} name={`customFields[${index}].name`} label='Name' fullWidth />
                      <ErrorMessage name={`customFields[${index}].name`} />

                      <Field component={TextField} name={`customFields[${index}].value`} label='Value' fullWidth />
                      <ErrorMessage name={`customFields[${index}].value`} />

                      <Field name={`customFields[${index}].viewPermission`}>
                        {({ field, form }: any) => (
                          <ToggleButtonGroup
                            exclusive
                            value={field.value}
                            onChange={(_, newValue) => form.setFieldValue(field.name, newValue)}>
                            <ToggleButton value={FieldPermission.all}>All Users</ToggleButton>
                            <ToggleButton value={FieldPermission.doctor}>Doctors Only</ToggleButton>
                          </ToggleButtonGroup>
                        )}
                      </Field>

                      <Button variant='outlined' color='error' onClick={() => remove(index)}>
                        Remove Field
                      </Button>
                    </div>
                  ))}
                  <Button color='primary' onClick={() => push({ name: '', value: '', viewPermission: 'doctor' })}>
                    Add Field
                  </Button>
                </>
              )}
            </FieldArray>

            <LoadingButton type='submit' variant='contained' color='primary' disabled={!isValid} loading={isLoading}>
              Submit
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Container>
  );
};
