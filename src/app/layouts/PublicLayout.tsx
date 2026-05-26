import { ScrollRestoration } from 'react-router';
import RouteTransitionOutlet from '../components/shared/RouteTransitionOutlet';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f5ee_0%,#fbfaf6_12%,#ffffff_38%)] text-[color:var(--gig-text)] antialiased">
      <ScrollRestoration />
      <RouteTransitionOutlet />
    </div>
  );
}
