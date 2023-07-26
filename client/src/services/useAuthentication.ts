import * as React from 'react';
import { createContext } from '../utils/createContext';

type AuthenticationContext = {
  user: any;
};

const [useAuthentication, AuthenticationProvider, authenticationContext] = createContext<AuthenticationContext>(() => {
  return {
    user: { name: 'test' },
  };
});
