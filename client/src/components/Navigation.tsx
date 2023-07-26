import * as React from 'react';
import styled from 'styled-components';
import { useAuthentication } from '../services/useAuthentication';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { ROUTES } from '../routes/ROUTES';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px;
`;

export const Navigation = () => {
  const { isAuthenticated, logout } = useAuthentication();
  const navigate = useNavigate();
  return (
    <Wrapper>
      <img
        onClick={() => navigate(ROUTES.home)}
        style={{ cursor: 'pointer' }}
        src={'https://uploads-ssl.webflow.com/6297d5d89ac9c5b4308579e1/6297d5d89ac9c550828579f0_Logo.svg'}
      />
      {isAuthenticated ? <Button onClick={logout}>Logout</Button> : null}
    </Wrapper>
  );
};
