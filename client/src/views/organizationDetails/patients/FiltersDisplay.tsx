import * as React from 'react';
import { Filters } from './Patients';
import { Button, Card, Typography } from '@mui/material';

export const FiltersDisplay: React.FC<{ activeFilters: Filters; clearFilters: () => void }> = ({ activeFilters, clearFilters }) => {
  const { lastName, dateOfBirth, zipCode } = activeFilters;
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
      <Button fullWidth color={'error'} onClick={clearFilters}>
        Clear
      </Button>
    </Card>
  );
};
