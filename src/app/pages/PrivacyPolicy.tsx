import { Link } from 'react-router';
import Footer from '../components/Footer';
import MarketplaceHeader from '../components/shared/MarketplaceHeader';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <MarketplaceHeader />

      <main className="px-[5%] py-10 md:py-14">
        <div className="mx-auto max-w-[920px]">
          <section className="mb-8 rounded-[32px] bg-[linear-gradient(180deg,rgba(241,251,244,0.85)_0%,rgba(255,255,255,0.9)_100%)] px-7 py-9 shadow-[var(--gig-shadow-sm)] md:px-10">
            <div className="eyebrow mb-4">Legal</div>
            <h1 className="page-title mb-3">Privacy Policy</h1>
            <p className="body-large max-w-[58ch]">
              How Grab It Good handles customer, partner, and outlet data across the web experience and the connected mobile app.
            </p>
            <div className="meta-text mt-4">Last updated: April 6, 2026. Applies across India to public, customer, and partner surfaces.</div>
          </section>

          <div className="surface-card rounded-[32px] p-7 md:p-10">
            <div className="surface-quiet mb-10 rounded-[24px] p-5">
              <p className="body-regular">
                <strong className="text-[color:var(--gig-text)]">Your privacy matters.</strong> Grab It Good is committed to being clear about what data we collect, why we use it, and how we protect it across customer and partner experiences.
              </p>
            </div>

            <section className="mb-10">
              <h2 className="section-title mb-3 text-[24px]">1. Overview</h2>
              <p className="body-regular mb-4">
                Grab It Good is a food rescue marketplace that connects customers with surplus food from restaurants, bakeries, cafes, and other food businesses across India.
              </p>
              <p className="body-regular">
                By using the GIG website, mobile app preview, and related services, you agree to this Privacy Policy. If you disagree with any part of it, please do not use the service.
              </p>
            </section>

            <section className="mb-10 border-t border-[color:var(--gig-border)] pt-10">
              <h2 className="section-title mb-3 text-[24px]">2. Data we collect</h2>
              <p className="body-regular mb-4"><strong className="text-[color:var(--gig-text)]">For customers:</strong></p>
              <ul className="space-y-3 pl-5">
                <li className="body-regular">Account information such as name, email address, phone number, and password.</li>
                <li className="body-regular">Location details such as pincode or approximate area to show nearby stores and pickup windows.</li>
                <li className="body-regular">Order details needed to issue pickup codes, show live status, and support collection verification.</li>
              </ul>
            </section>

            <section className="mb-10 border-t border-[color:var(--gig-border)] pt-10">
              <h2 className="section-title mb-3 text-[24px]">3. How we use your data</h2>
              <ul className="space-y-3 pl-5">
                <li className="body-regular">To create and manage your GIG account.</li>
                <li className="body-regular">To show nearby stores, available surplus food, and pickup timing.</li>
                <li className="body-regular">To send reservation details, pickup reminders, and service notifications.</li>
                <li className="body-regular">To support partner-side collection verification and operational support.</li>
              </ul>
            </section>

            <section className="mb-10 border-t border-[color:var(--gig-border)] pt-10">
              <h2 className="section-title mb-3 text-[24px]">4. Your rights</h2>
              <ul className="space-y-3 pl-5">
                <li className="body-regular">You can request access to the personal data we hold about you.</li>
                <li className="body-regular">You can ask us to correct inaccurate information.</li>
                <li className="body-regular">You can request deletion of your account and associated data, subject to legal requirements.</li>
              </ul>
              <p className="body-regular mt-4">
                To exercise these rights, email <a href="mailto:privacy@grabitgood.com" className="font-semibold text-[color:var(--gig-green-deep)]">privacy@grabitgood.com</a>.
              </p>
            </section>

            <section className="border-t border-[color:var(--gig-border)] pt-10">
              <h2 className="section-title mb-3 text-[24px]">5. Contact us</h2>
              <div className="surface-subtle rounded-[24px] p-6">
                <p className="body-regular mb-4">
                  Questions about privacy, account data, or collection verification records can be sent to our privacy team.
                </p>
                <div className="meta-text leading-7">
                  privacy@grabitgood.com<br />
                  Grab It Good Private Limited<br />
                  Siddipet, Telangana 502103, India
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/" className="btn-primary">Back to website</Link>
                  <Link to="/support" className="btn-secondary">Visit support</Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
