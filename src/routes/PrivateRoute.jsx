import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import AdminLayout from '@/layouts/AdminLayout';
import UserLayout from '@/layouts/UserLayout';
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

const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuthContext();
  const location = useLocation();
  const { tenantSlug } = useParams();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/sign-in"
        replace
        state={{ from: location }}
      />
    );
  }

  // Role-based access control
  if (roles.length > 0 && user && user.roles) {
    const hasRequiredRole = roles.some(role => user.roles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('User:', user);
  console.log('User type:', user?.userType);

  // Determine which layout to use based on user role
  const getLayout = () => {
    // Check if user has admin roles (system admin or normal admin)
    // const isAdmin = user?.roles?.some(role => 
    //   role === 'system_admin' || role === 'normal_admin'
    // );
    
    // if (isAdmin) {
    //   return <AdminLayout>{children}</AdminLayout>;
    // }
    
    // For non-admin users with tenantSlug, use UserLayout
    if (tenantSlug) {
      return <UserLayout>{children}</UserLayout>;
    } else {
      return <AdminLayout>{children}</AdminLayout>;
    }
    
    // Fallback for users without a recognized role or tenantSlug
    return <div>No suitable layout found for this user.</div>;
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {getLayout()}
    </Suspense>
  );
};

export default PrivateRoute;