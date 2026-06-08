import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import PrivateRoute from '@/routes/PrivateRoute';
import { useAuthContext } from '@/context/useAuthContext';
import GuestRoute from '@/routes/GuestRoute'; 
import { appRoutes, authRoutes } from '@/routes';
import { Suspense } from 'react';

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

const AppRouter = (props) => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Auth Routes */}
        {authRoutes.map((route, idx) => (
          <Route
            key={`auth-${idx}`}
            path={route.path}
            element={
            <GuestRoute>
              <AuthLayout {...props}>
                {route.element}
              </AuthLayout>
            </GuestRoute>
            }
          />
        ))}

        {/* Protected App Routes */}
        {appRoutes
          .filter(route => !route.isPublic)
          .map((route, idx) => (
            <Route
              key={`protected-${idx}`}
              path={route.path}
              element={
                <PrivateRoute roles={route.roles}>
                  {route.element}
                </PrivateRoute>
              }
            />
          ))}

        {/* Public App Routes */}
        {appRoutes
          .filter(route => route.isPublic)
          .map((route, idx) => (
            <Route
              key={`public-${idx}`}
              path={route.path}
              element={route.element}
            />
          ))}

        {/* Fallback Route - redirect based on authentication */}
        <Route
          path="*"
          element={
            <Navigate 
              to={isAuthenticated ? '/dashboard/analytics' : '/auth/sign-in'} 
              replace 
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

