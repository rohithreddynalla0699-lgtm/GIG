import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import PublicLayout from './layouts/PublicLayout';
import CustomerProtectedLayout from './layouts/CustomerProtectedLayout';
import PartnerAuthLayout from './layouts/PartnerAuthLayout';
import PartnerDashboardLayout from './layouts/PartnerDashboardLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const PartnerLogin = lazy(() => import('./pages/PartnerLogin'));
const BusinessSignup = lazy(() => import('./pages/BusinessSignup'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CustomerAuth = lazy(() => import('./pages/CustomerAuth'));
const PartnerOverviewPage = lazy(() => import('./pages/partner/PartnerOverviewPage'));
const PartnerListingsPage = lazy(() => import('./pages/partner/PartnerListingsPage'));
const PartnerNewListingPage = lazy(() => import('./pages/partner/PartnerNewListingPage'));
const PartnerOrdersPage = lazy(() => import('./pages/partner/PartnerOrdersPage'));
const PartnerOrderDetailsPage = lazy(() => import('./pages/partner/PartnerOrderDetailsPage'));
const PartnerProfilePage = lazy(() => import('./pages/partner/PartnerProfilePage'));
const PartnerSubscriptionPage = lazy(() => import('./pages/partner/PartnerSubscriptionPage'));
const FindFoodPage = lazy(() => import('./pages/public/FindFoodPage'));
const StorePage = lazy(() => import('./pages/public/StorePage'));
const BagPage = lazy(() => import('./pages/public/BagPage'));
const SavedPage = lazy(() => import('./pages/public/SavedPage'));
const OrdersPage = lazy(() => import('./pages/public/OrdersPage'));
const OrderDetailsPage = lazy(() => import('./pages/public/OrderDetailsPage'));
const CustomerProfilePage = lazy(() => import('./pages/public/CustomerProfilePage'));
const SupportPage = lazy(() => import('./pages/public/SupportPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));

function RouteFallback() {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-4 py-10">
      <div className="text-[14px] font-medium text-[color:var(--gig-text-muted)]">Loading...</div>
    </div>
  );
}

function withRouteFallback(node: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: withRouteFallback(<HomePage />) },
      { path: '/find-food', element: withRouteFallback(<FindFoodPage />) },
      { path: '/store/:id', element: withRouteFallback(<StorePage />) },
      { path: '/bag/:id', element: withRouteFallback(<BagPage />) },
      { path: '/support', element: withRouteFallback(<SupportPage />) },
      { path: '/customer-auth', element: withRouteFallback(<CustomerAuth />) },
      { path: '/privacy-policy', element: withRouteFallback(<PrivacyPolicy />) },
      { path: '*', element: withRouteFallback(<NotFoundPage />) },
    ],
  },
  {
    element: <CustomerProtectedLayout />,
    children: [
      { path: '/saved', element: withRouteFallback(<SavedPage />) },
      { path: '/orders', element: withRouteFallback(<OrdersPage />) },
      { path: '/orders/:id', element: withRouteFallback(<OrderDetailsPage />) },
      { path: '/customer-profile', element: withRouteFallback(<CustomerProfilePage />) },
    ],
  },
  {
    path: '/partner',
    element: <PartnerAuthLayout />,
    children: [
      { path: 'login', element: withRouteFallback(<PartnerLogin />) },
      { path: 'onboarding', element: withRouteFallback(<BusinessSignup />) },
    ],
  },
  {
    path: '/partner',
    element: <PartnerDashboardLayout />,
    children: [
      { index: true, element: withRouteFallback(<PartnerOverviewPage />) },
      { path: 'profile', element: withRouteFallback(<PartnerProfilePage />) },
      { path: 'listings', element: withRouteFallback(<PartnerListingsPage />) },
      { path: 'listings/new', element: withRouteFallback(<PartnerNewListingPage />) },
      { path: 'orders', element: withRouteFallback(<PartnerOrdersPage />) },
      { path: 'orders/:id', element: withRouteFallback(<PartnerOrderDetailsPage />) },
      { path: 'billing', element: withRouteFallback(<PartnerSubscriptionPage />) },
      { path: 'payouts', element: <Navigate to="/partner" replace /> },
      { path: 'subscription', element: <Navigate to="/partner/billing" replace /> },
      { path: 'team', element: <Navigate to="/partner" replace /> },
      { path: 'settings', element: <Navigate to="/partner/profile" replace /> },
      { path: 'help', element: <Navigate to="/partner" replace /> },
    ],
  },
  { path: '/partner-login', element: <Navigate to="/partner/login" replace /> },
  { path: '/business-signup', element: <Navigate to="/partner/onboarding" replace /> },
  { path: '/partner-dashboard', element: <Navigate to="/partner" replace /> },
]);
