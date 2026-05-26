import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import WhatGigIs from '../components/WhatGigIs';
import Mission from '../components/Mission';
import SurpriseBag from '../components/SurpriseBag';
import HowItWorks from '../components/HowItWorks';
import Business from '../components/Business';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="font-['DM_Sans',sans-serif] text-[color:var(--gig-text)]">
      <Navigation navTheme="adaptive" />
      <div data-nav-theme="dark">
        <Hero />
      </div>
      <div data-nav-theme="light">
        <WhatGigIs />
      </div>
      <div data-nav-theme="dark">
        <HowItWorks />
      </div>
      <div data-nav-theme="light">
        <SurpriseBag />
      </div>
      <div data-nav-theme="dark">
        <Mission />
      </div>
      <div data-nav-theme="dark">
        <Business />
      </div>
      <FinalCTA />
      <Footer />
    </div>
  );
}
