import * as React from 'react';
import { createContext } from '../utils/createContext';
import { useCallback, useState } from 'react';
import { BASE_URL, ENDPOINTS } from '../constants/endpoints';

type AuthenticationContext = {
  isAuthenticated: boolean;
  login(jwt: string): Promise<void>;
  userEmail: string | null;
  validateSession: () => Promise<boolean>;
};

export const [useAuthentication, AuthenticationProvider, authenticationContext] = createContext<AuthenticationContext>(() => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const validateSession: () => Promise<boolean> = useCallback(async () => {
    const res = await fetch(ENDPOINTS.validateSession, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include the cookie in the request
    })
      .then(res => res.json())
      .catch(console.error);
    if (res.success) {
      setUserEmail(res.email);
    }
    return res.success;
  }, []);

  const login = useCallback(async (jwt: string) => {
    await fetch(ENDPOINTS.googleSignIn, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include the cookie in the request
      body: JSON.stringify({
        idToken: jwt,
      }),
    })
      .then(res => res.json())
      .then(json => {
        setUserEmail(json.email);
      })
      .catch(console.error);
  }, []);

  const logout = useCallback(async () => {
    await fetch(ENDPOINTS.logout, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include the cookie in the request
    }).catch(console.error);
    setUserEmail(null);
    window.location.replace(BASE_URL);
  }, []);

  return {
    isAuthenticated: Boolean(userEmail),
    login,
    userEmail,
    validateSession,
  };
});
