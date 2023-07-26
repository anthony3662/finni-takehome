import * as React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { Button, Card, CardActionArea, Typography } from '@mui/material';
import { ROUTES } from '../../routes/ROUTES';
import { useRequest } from '../../utils/useRequest';
import { LoadingBackdrop } from '../../components/LoadingBackdrop';
import { useEffect } from 'react';
import { ENDPOINTS } from '../../endpoints/endpoints';
import { MyOrganizationsResponse } from '../../endpoints/endpointTypes';
import styled from 'styled-components';
import { useAuthentication } from '../../services/useAuthentication';

const Wrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Home = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuthentication();
  const { get, isLoading, data } = useRequest<MyOrganizationsResponse>();

  useEffect(() => {
    get(ENDPOINTS.myOrganizations);
  }, []);

  if (isLoading || !data) {
    return <LoadingBackdrop />;
  }

  return (
    <Wrapper>
      <Typography variant={'h5'} color={'primary.dark'}>{`Welcome ${userEmail}`}</Typography>
      <Button variant={'contained'} fullWidth onClick={() => navigate(ROUTES.createOrganization)}>
        Create Organization
      </Button>
      {data.myOrganizations.map(orgUser => {
        return (
          <Card>
            <CardActionArea
              sx={{ padding: 2 }}
              onClick={() => navigate(generatePath(ROUTES.organization.detail, { id: orgUser.organizationId._id }))}>
              <Typography gutterBottom variant={'h5'}>
                {orgUser.organizationId.name}
              </Typography>
              <Typography variant={'body1'}>{orgUser.organizationId.address}</Typography>
              <Typography variant={'body2'}>{orgUser.organizationId.description}</Typography>
              <Typography color={'grey'} sx={{ textAlign: 'right' }} variant={'h6'}>
                {orgUser.role.toUpperCase()}
              </Typography>
            </CardActionArea>
          </Card>
        );
      })}
    </Wrapper>
  );
};
