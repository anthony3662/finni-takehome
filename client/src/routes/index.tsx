import * as React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import { ROUTES } from './ROUTES';

export const AppRoutes = () => {
  const commonRoutes: RouteObject[] = [
    {
      path: ROUTES.home,
      element: <div>Home</div>,
    },
  ];

  const element = useRoutes(commonRoutes);

  return element;
};
