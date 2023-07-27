import * as React from 'react';
import { DeleteMemberParams, DeleteMemberResponse, OrganizationDetailsResponse, Role } from '../../../endpoints/organizationEndpointTypes';
import { Button, Card, CardActions, Typography } from '@mui/material';
import { useAuthentication } from '../../../services/useAuthentication';
import { AddUser } from './AddUser';
import { useRequest } from '../../../utils/useRequest';
import { LoadingButton } from '@mui/lab';
import { ORGANIZATION_ENDPOINTS } from '../../../endpoints/endpoints';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
export const MembersTab: React.FC<{ orgDetails: OrganizationDetailsResponse; refetch: () => any }> = ({ orgDetails, refetch }) => {
  const { userEmail } = useAuthentication();
  const { users, myOrgUser } = orgDetails;

  const { post, isLoading } = useRequest<DeleteMemberResponse, DeleteMemberParams>();

  const isDoctor = myOrgUser.role === Role.doctor;

  const handleDelete = async (orgUserId: string) => {
    await post({
      endpoint: ORGANIZATION_ENDPOINTS.removeMember,
      body: {
        orgUserId,
      },
    });
    refetch();
  };

  return (
    <Wrapper>
      {isDoctor ? <AddUser orgId={orgDetails.organization._id} refetch={refetch} /> : null}
      {users.map(user => (
        <Card sx={{ padding: 2 }}>
          <Typography variant={'h6'}>{`${user.email} - ${user.role.toUpperCase()}`}</Typography>
          {user.email !== userEmail && isDoctor ? (
            <CardActions>
              <LoadingButton onClick={() => handleDelete(user._id)} loading={isLoading} sx={{ marginLeft: 'auto' }} color={'error'}>
                Remove
              </LoadingButton>
            </CardActions>
          ) : null}
        </Card>
      ))}
    </Wrapper>
  );
};
