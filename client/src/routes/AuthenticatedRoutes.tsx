import { ROUTES } from './ROUTES';
import { Home } from '../views/home/Home';
import { CreateOrganization } from '../views/createOrganization/CreateOrganization';
import { Navigate, Route, Routes } from 'react-router-dom';
import { OrganizationDetails } from '../views/organizationDetails/OrganizationDetails';

export const AuthenticatedRoutes = [
  {
    path: ROUTES.home,
    element: <Home />,
  },
  {
    path: ROUTES.createOrganization,
    element: <CreateOrganization />,
  },
  {
    path: ROUTES.organization.root + '/*',
    element: (
      <Routes>
        <Route path='/:id/*' element={<OrganizationDetails />} />
        <Route path='/' element={<Navigate to={ROUTES.home} />} />
        <Route path='*' element={<Navigate to={ROUTES.home} />} />
      </Routes>
    ),
  },
];
