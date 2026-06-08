import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

// Dashboard Routes
const Analytics = lazy(() => import('@/app/(admin)/dashboard/analytics/page'));

const InvoiceMain = lazy(() => import('@/app/(admin)/invoicemain/page'));
const AllInvoices = lazy(() => import('@/app/(admin)/allinvoices/page'));
const OneInvoice = lazy(() => import('@/app/(admin)/pastinvoice/page'));

// Apps Routes

const Companies = lazy(() => import('@/app/(admin)/companies/page')); //In use

// Not Found Routes
const NotFound = lazy(() => import('@/app/(other)/(error-pages)/error-404/page'));

// Auth Routes
const AuthSignIn2 = lazy(() => import('@/app/(other)/auth/sign-in-2/page'));
const AuthSignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'));
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'));

// Loading component for Suspense fallback
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

// Wrapper for lazy components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

const initialRoutes = [{
  path: '/',
  name: 'root',
  element: <Navigate to="/auth/sign-in" />,
  isPublic: true
}, {
  path: '*',
  name: 'not-found',
  element: withSuspense(NotFound),
  isPublic: true
}
];

const generalRoutes = [{
  path: '/dashboard/analytics',
  name: 'Analytics',
  element: withSuspense(Analytics),
  isPublic: false
}];

const appsRoutes = [
{
  name: 'Company Invoice',
  path: '/company/invoice/:id',
  element: withSuspense(InvoiceMain),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
},
{
  name: 'All Invoices',
  path: '/company/invoice/:id/list',
  element: withSuspense(AllInvoices),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
},
{
  name: 'One Invoices',
  path: '/invoice/:invoiceId',
  element: withSuspense(OneInvoice),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
},
 {
  name: 'Companies',
  path: '/company/list',
  element: withSuspense(Companies),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}];

export const authRoutes = [
{
  name: 'Sign In',  //this route is in active use
  path: '/auth/sign-in',
  element: withSuspense(AuthSignIn2),
  isPublic: true
}, {
  name: 'Sign Up',
  path: '/auth/sign-up',
  element: withSuspense(AuthSignUp),
  isPublic: true
}, 
{
  name: 'Reset Password',
  path: '/:tenantSlug/reset-password',
  element: withSuspense(ResetPassword),
  isPublic: true
},
];

export const appRoutes = [...initialRoutes, ...generalRoutes, ...appsRoutes, ...authRoutes];