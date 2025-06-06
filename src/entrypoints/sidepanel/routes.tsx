import { OnboardedRoute } from '@/components/Onboarding/OnboardedRoute';
import Onboarding from '@/components/Onboarding/Onboarding';
import SidePanel from '@/components/SidePanel';
import { Navigate, useRoutes } from 'react-router-dom';

export const SidePanelRoutes = () => {
  const routes = [
    { path: '/', element: <Navigate to={'/chat'} replace /> },
    {
      path: '/chat',
      element: (
        <OnboardedRoute>
          <SidePanel />
        </OnboardedRoute>
      ),
    },
    {
      path: '/onboarding',
      element: <Onboarding />,
    },
  ];

  return useRoutes(routes);
};
