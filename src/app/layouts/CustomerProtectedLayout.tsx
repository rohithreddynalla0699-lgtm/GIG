import { useMemo } from 'react';
import { Navigate, ScrollRestoration, useLocation } from 'react-router';
import RouteTransitionOutlet from '../components/shared/RouteTransitionOutlet';
import { isMockCustomerSignedIn } from '../data/mock/customers';

export default function CustomerProtectedLayout() {
  const location = useLocation();
  const redirectPath = useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.hash, location.pathname, location.search],
  );

  if (!isMockCustomerSignedIn()) {
    return <Navigate to="/customer-auth" replace state={{ from: redirectPath }} />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f5ee_0%,#fbfaf6_12%,#ffffff_38%)] text-[color:var(--gig-text)] antialiased">
      <ScrollRestoration />
      <RouteTransitionOutlet />
    </div>
  );
}
