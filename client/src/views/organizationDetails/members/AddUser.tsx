import React, { useState } from 'react';
import { emailRegex } from '../../../constants/email';
import { TextField, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import { useRequest } from '../../../utils/useRequest';
import { AddMemberParams, AddMemberResponse, Role } from '../../../endpoints/organizationEndpointTypes';
import { LoadingButton } from '@mui/lab';
import styled from 'styled-components';
import { useAuthentication } from '../../../services/useAuthentication';
import { ORGANIZATION_ENDPOINTS } from '../../../endpoints/endpoints';

type Props = {
  orgId: string;
  refetch: () => any;
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: solid 2px black;
  border-radius: 8px;
`;
export const AddUser: React.FC<Props> = ({ orgId, refetch }) => {
  const { userEmail } = useAuthentication();
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<Role | null>(null);
  const isEmailValid = emailRegex.test(email) && email !== userEmail;

  const { post, isLoading } = useRequest<AddMemberResponse, AddMemberParams>();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (event: React.MouseEvent<HTMLElement>, newRole: string | null) => {
    setRole(newRole as Role);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await post({
      endpoint: ORGANIZATION_ENDPOINTS.addMember,
      body: {
        email,
        organizationId: orgId,
        role: role!,
      },
    });
    refetch();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Typography variant={'h6'}>Add Member</Typography>
      <TextField label='Email' variant='outlined' fullWidth value={email} onChange={handleEmailChange} required />
      <ToggleButtonGroup value={role} exclusive onChange={handleRoleChange} aria-label='user-role' fullWidth style={{ marginTop: 16 }}>
        <ToggleButton value={Role.doctor} aria-label='doctor'>
          Doctor
        </ToggleButton>
        <ToggleButton value={Role.clerk} aria-label='clerk'>
          Clerk
        </ToggleButton>
      </ToggleButtonGroup>
      <LoadingButton fullWidth loading={isLoading} type='submit' variant='contained' color='primary' disabled={!isEmailValid || !role}>
        Submit
      </LoadingButton>
    </Form>
  );
};
