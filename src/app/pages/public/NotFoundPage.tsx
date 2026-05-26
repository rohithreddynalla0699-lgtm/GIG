import { Link } from 'react-router';
import Footer from '../../components/Footer';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import SectionCard from '../../components/shared/SectionCard';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MarketplaceHeader />

      <main className="px-[5%] py-14 md:py-20">
        <div className="max-w-[920px] mx-auto">
          <SectionCard className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#E8F5E9] border border-[#C8E6C9]" />
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A661] mb-3">Page not found</div>
            <h1 className="font-['Fraunces',serif] text-[clamp(34px,5vw,54px)] font-bold leading-[1.05] tracking-[-1.4px] text-[#212121] mb-3">
              This page is not available
            </h1>
            <p className="max-w-[620px] mx-auto text-[16px] text-[#5A5A5A] leading-[1.7] mb-8">
              The link may be outdated, or the route may not exist. You can return to the homepage, browse nearby rescue listings, or head back into the correct partner area.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex min-h-[48px] items-center justify-center bg-[#00A661] text-white px-6 py-3 rounded-full text-[15px] font-semibold hover:bg-[#008A51] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] transition-colors"
              >
                Back to homepage
              </Link>
              <Link
                to="/find-food"
                className="inline-flex min-h-[48px] items-center justify-center border-2 border-[#E0E0E0] text-[#212121] px-6 py-3 rounded-full text-[15px] font-semibold hover:border-[#00A661] hover:text-[#00A661] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] transition-colors"
              >
                Browse find food
              </Link>
            </div>
          </SectionCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}
