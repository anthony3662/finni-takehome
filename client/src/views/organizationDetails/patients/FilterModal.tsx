import * as React from 'react';
import { AppBar, Button, Dialog, DialogContent, IconButton, Toolbar, Typography } from '@mui/material';
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
};
export const FilterModal: React.FC<Props> = ({ isOpen, close, activeFilters, setFilters }) => {
  const initialValues: FormValues = {
    lastName: activeFilters.lastName || '',
    dateOfBirth: activeFilters.dateOfBirth || null,
    zipCode: activeFilters.zipCode || '',
  };

  const handleSubmit = (values: FormValues) => {
    // Filter out falsy properties (e.g., empty strings, null, undefined, etc.)
    const filteredValues = Object.fromEntries(Object.entries(values).filter(([_, v]) => !!v));
    setFilters(filteredValues);
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

            <Button type='submit' variant='contained' color='primary'>
              Apply Filters
            </Button>

            <Button variant={'contained'} color={'error'} onClick={handleClear}>
              Clear Filters
            </Button>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
