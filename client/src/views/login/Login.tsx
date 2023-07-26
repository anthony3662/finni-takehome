import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { styled as mStyled } from '@mui/material/styles';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useAuthentication } from '../../services/useAuthentication';

const LoginBox = mStyled(Box)`
  padding: 24px;
  border-radius: 12px;
  border: solid 2px ${({ theme }) => theme.palette.primary.dark}
`;

const LoginImage = styled.img`
  width: 100%;
  border-radius: 12px;
  margin-top: 24px;
`;

export const Login = () => {
  const { validateSession, login } = useAuthentication();
  const handleCallbackResponse = (response: any) => {
    const jwt: string = response.credential;
    login(jwt);
  };

  const init = async () => {
    const isCookieValid = await validateSession();
    if (isCookieValid) {
      return; // authentication service will nav to correct page
    }

    /* global google */ // @ts-ignore
    google.accounts.id.initialize({
      client_id: '512937522732-eiq6es54jjm5m2tgh5j49rtvce69th1j.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    });
    /* global google */ // @ts-ignore
    google.accounts.id.renderButton(document.getElementById('signInDiv'), { theme: 'outline', size: 'large' });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <Typography variant='h4' color={'primary.dark'} gutterBottom>
        Welcome to Finni Health!
      </Typography>
      <LoginBox>
        <Typography variant='body1' color={'primary.dark'} gutterBottom>
          {'Please sign in to continue. More login methods coming in the future!'}
        </Typography>
        <div id={'signInDiv'} />
      </LoginBox>
      <LoginImage
        alt={'therapy session'}
        src={'https://uploads-ssl.webflow.com/6297d5d89ac9c5b4308579e1/629e57d618ad222fc95ed12e_learning-happy-p-500.png'}
      />
    </div>
  );
};
