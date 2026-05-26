import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-[#081311] px-[5%] pb-8 pt-14 text-white md:pt-16">
      <div className="section-shell">
        <div className="grid gap-10 border-b border-white/8 pb-10 md:grid-cols-[1.35fr_0.78fr_0.8fr_0.78fr] md:pb-12">
          <div className="max-w-[400px]">
            <div className="mb-4 flex items-center gap-[10px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,var(--gig-green)_0%,var(--gig-green-deep)_100%)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.5 8.5L22 9.5L17 14.5L18 21L12 18L6 21L7 14.5L2 9.5L8.5 8.5L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-['Fraunces',serif] text-[19px] font-semibold tracking-[-0.03em] text-white">
                Grab It <span className="text-[color:var(--gig-green)]">Good</span>
              </span>
            </div>

            <p className="text-[15px] leading-[1.8] text-white/74">
              GIG is a pickup-first marketplace for fresh same-day food discovery from nearby restaurants, cafes, bakeries, and neighbourhood kitchens.
            </p>
          </div>

          <div>
            <div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/62">Explore</div>
            <ul className="space-y-3.5">
              <li><Link to="/find-food" className="text-[15px] text-white/76 transition-colors hover:text-white">Find food</Link></li>
              <li><Link to="/saved" className="text-[15px] text-white/76 transition-colors hover:text-white">Saved</Link></li>
              <li><Link to="/orders" className="text-[15px] text-white/76 transition-colors hover:text-white">Orders</Link></li>
              <li><Link to="/support" className="text-[15px] text-white/76 transition-colors hover:text-white">Support</Link></li>
            </ul>
          </div>

          <div>
            <div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/62">Company</div>
            <ul className="space-y-3.5">
              <li><Link to="/" className="text-[15px] text-white/76 transition-colors hover:text-white">About GIG</Link></li>
              <li><a href="#for-businesses" className="text-[15px] text-white/76 transition-colors hover:text-white">For businesses</a></li>
              <li><Link to="/partner/login" className="text-[15px] text-white/76 transition-colors hover:text-white">Partner login</Link></li>
              <li><Link to="/privacy-policy" className="text-[15px] text-white/76 transition-colors hover:text-white">Privacy policy</Link></li>
            </ul>
          </div>

          <div>
            <div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/62">App</div>
            <ul className="space-y-3.5">
              <li><Link to="/find-food" className="text-[15px] text-white/76 transition-colors hover:text-white">Find food</Link></li>
              <li><a href="#how-it-works" className="text-[15px] text-white/76 transition-colors hover:text-white">How it works</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-[14px] text-white/62">© 2026 Grab It Good. Pickup-first food rescue for Indian cities.</div>
        </div>
      </div>
    </footer>
  );
}
