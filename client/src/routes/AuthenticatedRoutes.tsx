import { ROUTES } from './ROUTES';
import { Home } from '../views/home/Home';
import { CreateOrganization } from '../views/createOrganization/CreateOrganization';

export const AuthenticatedRoutes = [
  {
    path: ROUTES.home,
    element: <Home />,
  },
  {
    path: ROUTES.createOrganization,
    element: <CreateOrganization />,
  },
];
