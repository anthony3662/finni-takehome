import * as React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import { ROUTES } from './ROUTES';
import { Login } from '../views/login/Login';
import { useAuthentication } from '../services/useAuthentication';
import { AuthenticatedRoutes } from './AuthenticatedRoutes';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuthentication();
  const routes = isAuthenticated
    ? AuthenticatedRoutes
    : [
        {
          path: ROUTES.home,
          element: <Login />,
        },
      ];

  const element = useRoutes(routes);

  return element;
};
