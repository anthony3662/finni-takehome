import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { ROUTES } from '../../routes/ROUTES';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 32 }}>
      <Button variant={'contained'} fullWidth onClick={() => navigate(ROUTES.createOrganization)}>
        Create Organization
      </Button>
    </div>
  );
};
