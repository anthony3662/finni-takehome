import * as React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

export const LoadingBackdrop = () => {
  return (
    <Backdrop sx={{ color: '#fff' }} open={true}>
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};
