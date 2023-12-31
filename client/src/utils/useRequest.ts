import { useAuthentication } from '../services/useAuthentication';
import { useState } from 'react';

export type UseRequest<T, P = object> = {
  get: (endpoint: string) => Promise<T>;
  post: (options: { endpoint: string; body: P }) => Promise<T>;
  data: T | null;
  isLoading: boolean;
};

/**
 * Logs out the user if anything comes back 403, for example if their cookie expires.
 */
export const useRequest = <T, P = object>(): UseRequest<T, P> => {
  const { logout } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null); // add generics later please!

  const get = async (endpoint: string): Promise<T> => {
    setIsLoading(true);
    const data = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include the cookie in the request
    })
      .then(async res => {
        setIsLoading(false);
        if (res.status === 403) {
          await logout();
          throw Error('log out due to 403');
        }
        return res.json();
      })
      .catch(e => {
        setIsLoading(false);
        console.error(e);
        throw e;
      });
    setData(data);
    return data;
  };

  const post = async (options: { endpoint: string; body: P }): Promise<T> => {
    const { endpoint, body } = options;
    setIsLoading(true);
    const data = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include the cookie in the request
    })
      .then(async res => {
        setIsLoading(false);
        if (res.status === 403) {
          await logout();
          throw Error('log out due to 403');
        }
        return res.json();
      })
      .catch(e => {
        setIsLoading(false);
        console.error(e);
        throw e;
      });
    setData(data);
    return data;
  };

  return { get, post, data, isLoading };
};
