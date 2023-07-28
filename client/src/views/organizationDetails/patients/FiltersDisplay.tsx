import * as React from 'react';
import { Button, Card, Typography } from '@mui/material';
import { Filters } from '../../../models/patient';

export const FiltersDisplay: React.FC<{ activeFilters: Filters; clearFilters: () => void }> = ({ activeFilters, clearFilters }) => {
  const { lastName, dateOfBirth, zipCode, customField } = activeFilters;
  if (!Object.keys(activeFilters).length) {
    return <></>;
  }

  return (
    <Card sx={{ padding: 2 }}>
      <Typography gutterBottom variant={'h6'}>
        Filters Active
      </Typography>
      {lastName ? <Typography gutterBottom>Last Name: {lastName}</Typography> : null}
      {dateOfBirth ? <Typography gutterBottom>DOB: {new Date(dateOfBirth).toDateString()}</Typography> : null}
      {zipCode ? <Typography gutterBottom>Zip Code: {zipCode}</Typography> : null}
      {customField ? (
        <>
          <Typography gutterBottom>Custom Field</Typography>
          <Typography variant={'body2'} sx={{ paddingLeft: 4 }}>
            Name: {customField.name}
          </Typography>
          <Typography variant={'body2'} sx={{ paddingLeft: 4 }}>
            Value: {customField.value}
          </Typography>
        </>
      ) : null}
      <Button fullWidth color={'error'} onClick={clearFilters}>
        Clear
      </Button>
    </Card>
  );
};
