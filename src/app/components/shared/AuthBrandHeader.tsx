import { Link } from 'react-router';

type AuthBrandHeaderProps = {
  backLabel?: string;
  backTo?: string;
  note?: string;
  variant?: 'light' | 'dark';
};

export default function AuthBrandHeader({
  backLabel = 'Back to website',
  backTo = '/',
  note,
  variant = 'light',
}: AuthBrandHeaderProps) {
  const dark = variant === 'dark';

  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link to="/" className="group inline-flex items-center gap-2 rounded-[14px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,var(--gig-green)_0%,var(--gig-green-deep)_100%)] shadow-[0_10px_20px_rgba(0,166,97,0.18)] transition-transform duration-[var(--gig-motion-fast)] group-hover:scale-[1.03]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.5 8.5L22 9.5L17 14.5L18 21L12 18L6 21L7 14.5L2 9.5L8.5 8.5L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={`font-['Fraunces',serif] text-[21px] font-semibold tracking-[-0.03em] ${dark ? 'text-[#f4ecdd]' : 'text-[color:var(--gig-text)]'}`}>
            Grab It <span className={dark ? 'text-[#7bc3ab]' : 'text-[color:var(--gig-green)]'}>Good</span>
          </span>
        </Link>
        {note ? (
          <div className={`mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] ${dark ? 'text-white/56' : 'text-[color:var(--gig-text-soft)]'}`}>
            {note}
          </div>
        ) : null}
      </div>

      <Link to={backTo} className={`btn-ghost self-start sm:self-auto ${dark ? 'text-white/74 hover:bg-white/8 hover:text-white' : ''}`}>
        {backLabel}
      </Link>
    </div>
  );
}
