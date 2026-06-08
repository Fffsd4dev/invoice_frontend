// layouts/UserLayout.jsx (for regular users)
import { lazy, Suspense } from 'react';
import FallbackLoading from '@/components/FallbackLoading';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/Preloader';

const TopNavigationBar = lazy(() => import('@/components/layout2/TopNavigationBar'));
const VerticalNavigationBar = lazy(() => import('@/components/layout2/VerticalNavigationBar'));

const UserLayout = ({ children }) => {
  return (
    <div className="wrapper user-layout">
      <Suspense fallback={<FallbackLoading />}>
        <TopNavigationBar />
      </Suspense>

      <Suspense fallback={<FallbackLoading />}>
        <VerticalNavigationBar />
      </Suspense>

      <div className="page-content">
        <div className="container-xxl">
          <Suspense fallback={<Preloader />}>{children}</Suspense>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;