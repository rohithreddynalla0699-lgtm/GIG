import { createBrowserRouter, Navigate } from 'react-router';
import PublicLayout from './layouts/PublicLayout';
import CustomerProtectedLayout from './layouts/CustomerProtectedLayout';
import PartnerAuthLayout from './layouts/PartnerAuthLayout';
import PartnerDashboardLayout from './layouts/PartnerDashboardLayout';
import HomePage from './pages/HomePage';
import PartnerLogin from './pages/PartnerLogin';
import BusinessSignup from './pages/BusinessSignup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CustomerAuth from './pages/CustomerAuth';
import PartnerOverviewPage from './pages/partner/PartnerOverviewPage';
import PartnerListingsPage from './pages/partner/PartnerListingsPage';
import PartnerNewListingPage from './pages/partner/PartnerNewListingPage';
import PartnerOrdersPage from './pages/partner/PartnerOrdersPage';
import PartnerOrderDetailsPage from './pages/partner/PartnerOrderDetailsPage';
import PartnerProfilePage from './pages/partner/PartnerProfilePage';
import PartnerPayoutsPage from './pages/partner/PartnerPayoutsPage';
import PartnerSubscriptionPage from './pages/partner/PartnerSubscriptionPage';
import PartnerTeamPage from './pages/partner/PartnerTeamPage';
import PartnerSettingsPage from './pages/partner/PartnerSettingsPage';
import PartnerHelpPage from './pages/partner/PartnerHelpPage';
import FindFoodPage from './pages/public/FindFoodPage';
import StorePage from './pages/public/StorePage';
import BagPage from './pages/public/BagPage';
import SavedPage from './pages/public/SavedPage';
import OrdersPage from './pages/public/OrdersPage';
import OrderDetailsPage from './pages/public/OrderDetailsPage';
import CustomerProfilePage from './pages/public/CustomerProfilePage';
import SupportPage from './pages/public/SupportPage';
import NotFoundPage from './pages/public/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', Component: HomePage },
      { path: '/find-food', Component: FindFoodPage },
      { path: '/store/:id', Component: StorePage },
      { path: '/bag/:id', Component: BagPage },
      { path: '/support', Component: SupportPage },
      { path: '/customer-auth', Component: CustomerAuth },
      { path: '/privacy-policy', Component: PrivacyPolicy },
      { path: '*', Component: NotFoundPage },
    ],
  },
  {
    element: <CustomerProtectedLayout />,
    children: [
      { path: '/saved', Component: SavedPage },
      { path: '/orders', Component: OrdersPage },
      { path: '/orders/:id', Component: OrderDetailsPage },
      { path: '/customer-profile', Component: CustomerProfilePage },
    ],
  },
  {
    path: '/partner',
    element: <PartnerAuthLayout />,
    children: [
      { path: 'login', Component: PartnerLogin },
      { path: 'onboarding', Component: BusinessSignup },
    ],
  },
  {
    path: '/partner',
    element: <PartnerDashboardLayout />,
    children: [
      { index: true, Component: PartnerOverviewPage },
      { path: 'profile', Component: PartnerProfilePage },
      { path: 'listings', Component: PartnerListingsPage },
      { path: 'listings/new', Component: PartnerNewListingPage },
      { path: 'orders', Component: PartnerOrdersPage },
      { path: 'orders/:id', Component: PartnerOrderDetailsPage },
      { path: 'billing', Component: PartnerSubscriptionPage },
      { path: 'payouts', Component: PartnerPayoutsPage },
      { path: 'subscription', Component: PartnerSubscriptionPage },
      { path: 'team', Component: PartnerTeamPage },
      { path: 'settings', Component: PartnerSettingsPage },
      { path: 'help', Component: PartnerHelpPage },
    ],
  },
  { path: '/partner-login', element: <Navigate to="/partner/login" replace /> },
  { path: '/business-signup', element: <Navigate to="/partner/onboarding" replace /> },
  { path: '/partner-dashboard', element: <Navigate to="/partner" replace /> },
]);
