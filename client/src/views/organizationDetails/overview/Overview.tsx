import * as React from 'react';
import { OrganizationDetailsResponse } from '../../../endpoints/organizationEndpointTypes';
import styled from 'styled-components';
import { Typography } from '@mui/material';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const Overview: React.FC<{ orgDetails: OrganizationDetailsResponse }> = ({ orgDetails }) => {
  return (
    <Wrapper>
      <Typography variant={'h5'}>{`Address - ${orgDetails.organization.address}`}</Typography>
      <Typography variant={'body1'}>{`Organization summary - ${orgDetails.organization.description}`}</Typography>
    </Wrapper>
  );
};
