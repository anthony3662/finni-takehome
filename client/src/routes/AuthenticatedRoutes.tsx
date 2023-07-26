import { ROUTES } from './ROUTES';
import { Home } from '../views/home/Home';

export const AuthenticatedRoutes = [
  {
    path: ROUTES.home,
    element: <Home />,
  },
];
