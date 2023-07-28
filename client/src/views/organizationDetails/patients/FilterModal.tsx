import * as React from 'react';
import { AppBar, Button, Dialog, DialogContent, Divider, IconButton, Toolbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment/moment';
import { Filters } from './Patients';

type Props = {
  isOpen: boolean;
  close: () => void;
  activeFilters: Filters;
  setFilters: (filters: Filters) => void;
};

type FormValues = {
  lastName: string;
  dateOfBirth: Date | null;
  zipCode: string;
  customFieldName: string;
  customFieldValue: string;
};
export const FilterModal: React.FC<Props> = ({ isOpen, close, activeFilters, setFilters }) => {
  const initialValues: FormValues = {
    lastName: activeFilters.lastName || '',
    dateOfBirth: activeFilters.dateOfBirth || null,
    zipCode: activeFilters.zipCode || '',
    customFieldName: activeFilters.customField?.name || '',
    customFieldValue: activeFilters.customField?.value || '',
  };

  const handleSubmit = (values: FormValues) => {
    const { lastName, dateOfBirth, zipCode } = values;
    // Filter out falsy properties (e.g., empty strings, null, undefined, etc.)
    const filteredBasicValues = Object.fromEntries(Object.entries({ lastName, dateOfBirth, zipCode }).filter(([_, v]) => !!v));

    const newFilters: Filters = {
      ...filteredBasicValues,
    };
    // validation ensures both are truthy
    if (values.customFieldName) {
      newFilters.customField = {
        name: values.customFieldName,
        value: values.customFieldValue,
      };
    }
    setFilters(newFilters);
    close();
  };

  const handleClear = () => {
    setFilters({});
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} fullScreen>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6'>Apply Filters</Typography>
          <IconButton edge='end' color='inherit' onClick={close} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}>
              <Field component={TextField} name='lastName' label='Last Name' fullWidth variant='outlined' margin='normal' />

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

              <Field component={TextField} name='zipCode' label='ZIP Code' fullWidth variant='outlined' margin='normal' />

              <Divider variant={'middle'} />
              <Field component={TextField} name='customFieldName' label='Custom Field Name' fullWidth variant='outlined' margin='normal' />
              <Field
                component={TextField}
                name='customFieldValue'
                label='Custom Field Value'
                fullWidth
                variant='outlined'
                margin='normal'
              />

              <Button
                type='submit'
                variant='contained'
                color='primary'
                // valid if neither or both filled
                disabled={Boolean(values.customFieldName) !== Boolean(values.customFieldValue)}>
                Apply Filters
              </Button>

              <Button variant={'contained'} color={'error'} onClick={handleClear}>
                Clear Filters
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
