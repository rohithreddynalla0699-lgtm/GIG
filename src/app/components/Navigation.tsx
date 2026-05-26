import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { clearMockCustomerSession, isMockCustomerSignedIn } from '../data/mock/customers';

type NavigationProps = {
  navTheme?: 'adaptive' | 'light' | 'dark';
  variant?: 'home' | 'public';
};

export default function Navigation({
  navTheme = 'adaptive',
  variant = 'home',
}: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [signedIn, setSignedIn] = useState(() => isMockCustomerSignedIn());
  const [scrolled, setScrolled] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(navTheme === 'light');
  const lastResolvedThemeRef = useRef<'light' | 'dark'>(navTheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    setSignedIn(isMockCustomerSignedIn());
  }, [location.pathname]);

  useEffect(() => {
    const resolveThemeAtProbe = (
      themeSections: HTMLElement[],
      probeLine: number
    ): 'light' | 'dark' | null => {
      const matchingSections = themeSections.filter((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probeLine && rect.bottom > probeLine;
      });

      const activeSection =
        matchingSections.at(-1) ??
        [...themeSections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= probeLine) ??
        themeSections.find((section) => section.getBoundingClientRect().top > probeLine);

      const theme = activeSection?.dataset.navTheme;
      return theme === 'light' || theme === 'dark' ? theme : null;
    };

    const resolveTheme = () => {
      setScrolled(window.scrollY > 20);

      if (navTheme === 'light') {
        lastResolvedThemeRef.current = 'light';
        setIsLightTheme(true);
        return;
      }

      if (navTheme === 'dark') {
        lastResolvedThemeRef.current = 'dark';
        setIsLightTheme(false);
        return;
      }

      const themeSections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-theme]'));
      const topProbeTheme = resolveThemeAtProbe(themeSections, 44);
      const probeThemes = [
        topProbeTheme,
        resolveThemeAtProbe(themeSections, 60),
        resolveThemeAtProbe(themeSections, 76),
      ].filter((theme): theme is 'light' | 'dark' => Boolean(theme));

      const lightVotes = probeThemes.filter((theme) => theme === 'light').length;
      const darkVotes = probeThemes.filter((theme) => theme === 'dark').length;
      const atTop = window.scrollY <= 8;
      const nextTheme = atTop && topProbeTheme === 'light'
        ? 'light'
        : lightVotes >= 2
        ? 'light'
        : darkVotes >= 2
        ? 'dark'
        : lastResolvedThemeRef.current;

      lastResolvedThemeRef.current = nextTheme;
      setIsLightTheme(nextTheme === 'light');
    };

    resolveTheme();
    window.addEventListener('scroll', resolveTheme, { passive: true });
    window.addEventListener('resize', resolveTheme);

    return () => {
      window.removeEventListener('scroll', resolveTheme);
      window.removeEventListener('resize', resolveTheme);
    };
  }, [location.pathname, navTheme]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      setMenuOpen(false);
    }
  };

  const desktopLinkClass = isLightTheme
    ? 'text-[rgba(7,20,16,0.99)] hover:text-[rgb(7,20,16)]'
    : 'text-[#f4ecdd]/82 hover:text-white';
  const logoDestination = signedIn ? '/find-food' : '/';
  const logoTextClass = isLightTheme ? 'text-[#081b16]' : 'text-[#f4ecdd]';
  const logoAccentClass = isLightTheme ? 'text-[#086945]' : 'text-[#7bc3ab]';
  const menuButtonClass = isLightTheme
    ? 'text-[#081b16]'
    : 'text-[#f4ecdd]';
  const accountLabel = signedIn ? 'Account' : 'Sign in';
  const accountTo = signedIn ? '/customer-profile' : '/customer-auth';
  const isHome = variant === 'home';
  const isCustomerAppRoute =
    location.pathname === '/find-food' ||
    location.pathname === '/orders' ||
    location.pathname.startsWith('/orders/') ||
    location.pathname === '/saved' ||
    location.pathname === '/customer-profile';
  const homeSignInLabel = 'Sign in';
  const homeSignInTo = '/customer-auth';
  const publicPartnerLabel = 'Partner';
  const publicPartnerTo = '/partner/login';
  const isRouteActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : path.endsWith('/:id')
      ? location.pathname.startsWith(path.replace('/:id', '/'))
      : location.pathname === path || location.pathname.startsWith(`${path}/`);
  const navItemClass = (active: boolean) =>
    active
      ? isLightTheme
        ? 'bg-[rgba(15,36,30,0.08)] text-[rgb(7,20,16)]'
        : 'bg-white/[0.09] text-white'
      : desktopLinkClass;
  const mobileItemClass = (active: boolean) =>
    active ? 'bg-white/10 text-white' : 'text-white transition-colors hover:bg-white/8';

  function handleSignOut() {
    clearMockCustomerSession();
    setSignedIn(false);
    setMenuOpen(false);
    navigate('/find-food');
  }

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 overflow-hidden transition-all duration-[var(--gig-motion-base)] ${
          isLightTheme
            ? 'bg-[linear-gradient(180deg,rgba(250,247,240,0.5)_0%,rgba(250,247,240,0.2)_56%,rgba(250,247,240,0)_100%)] shadow-[0_8px_18px_rgba(15,36,30,0.025)] backdrop-blur-[7px]'
            : scrolled
            ? 'bg-[linear-gradient(180deg,rgba(8,18,16,0.26)_0%,rgba(8,18,16,0.14)_58%,rgba(8,18,16,0.02)_100%)] backdrop-blur-[8px]'
            : 'bg-[linear-gradient(180deg,rgba(7,20,17,0.16)_0%,rgba(7,20,17,0.08)_46%,rgba(7,20,17,0)_100%)] backdrop-blur-[4px]'
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[88px] ${
            isLightTheme
              ? 'bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.03),transparent_18%),radial-gradient(circle_at_82%_8%,rgba(214,160,106,0.008),transparent_12%)]'
              : 'bg-[radial-gradient(circle_at_18%_0%,rgba(123,195,171,0.05),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(232,185,128,0.035),transparent_22%)]'
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-[var(--gig-motion-base)] ${
            isLightTheme ? 'bg-[rgba(15,36,30,0.055)] opacity-100' : 'bg-transparent opacity-0'
          }`}
        />
        <div className="relative mx-auto flex h-[74px] w-full max-w-[1180px] items-center justify-between px-4 sm:px-[5%] lg:px-8">
          <Link to={logoDestination} className="group flex items-center gap-2 rounded-[14px]" onClick={() => setMenuOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[linear-gradient(135deg,var(--gig-green)_0%,var(--gig-green-deep)_100%)] shadow-[0_10px_20px_rgba(0,166,97,0.18)] transition-transform duration-[var(--gig-motion-fast)] group-hover:scale-[1.03]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.5 8.5L22 9.5L17 14.5L18 21L12 18L6 21L7 14.5L2 9.5L8.5 8.5L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={`font-['Fraunces',serif] text-[20px] font-semibold tracking-[-0.03em] transition-[color,opacity] duration-[var(--gig-motion-base)] group-hover:opacity-80 ${logoTextClass}`}>
              Grab It <span className={logoAccentClass}>Good</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-3 lg:flex">
            <li><Link to="/find-food" className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${navItemClass(isRouteActive('/find-food'))}`}>Find food</Link></li>
            {isHome ? (
              <>
                <li><button onClick={() => scrollToSection('how-it-works')} className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${navItemClass(false)}`}>How it works</button></li>
                <li><button onClick={() => scrollToSection('for-businesses')} className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${navItemClass(false)}`}>For businesses</button></li>
                <li><Link to={homeSignInTo} className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${desktopLinkClass}`}>{homeSignInLabel}</Link></li>
                <li><Link to={publicPartnerTo} className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${desktopLinkClass}`}>{publicPartnerLabel}</Link></li>
                <li>
                  <Link to="/find-food" className="btn-primary min-h-[40px] px-5 py-2 text-[14px] shadow-none">
                    Get the app
                  </Link>
                </li>
              </>
            ) : isCustomerAppRoute && signedIn ? (
              <>
                <li><Link to="/orders" className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${navItemClass(isRouteActive('/orders'))}`}>Orders</Link></li>
                <li><Link to={accountTo} className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${navItemClass(isRouteActive('/customer-profile'))}`}>{accountLabel}</Link></li>
                <li aria-hidden="true" className={isLightTheme ? 'text-[rgba(15,36,30,0.28)]' : 'text-white/24'}>•</li>
                <li>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${desktopLinkClass}`}
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/#how-it-works" className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${navItemClass(false)}`}>How it works</Link></li>
                <li><Link to="/#for-businesses" className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${navItemClass(false)}`}>For businesses</Link></li>
                <li><Link to="/customer-auth" className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${desktopLinkClass}`}>Sign in</Link></li>
                <li><Link to={publicPartnerTo} className={`rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors ${desktopLinkClass}`}>{publicPartnerLabel}</Link></li>
                <li>
                  <Link to="/find-food" className="btn-primary min-h-[40px] px-5 py-2 text-[14px] shadow-none">
                    Get the app
                  </Link>
                </li>
              </>
            )}
          </ul>

          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-[color,border-color,background-color] duration-[var(--gig-motion-base)] lg:hidden ${menuButtonClass} ${
              isLightTheme
                ? 'border border-[rgba(15,36,30,0.09)] bg-[rgba(255,253,248,0.3)]'
                : scrolled
                ? 'border border-white/8 bg-white/[0.025]'
                : 'border border-white/0 bg-transparent'
            }`}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-[4px]">
              <span className={`h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-[var(--gig-motion-fast)] ${menuOpen ? 'translate-y-[5.5px] rotate-45' : ''}`}></span>
              <span className={`h-[1.5px] w-[18px] rounded-full bg-current transition-opacity duration-[var(--gig-motion-fast)] ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-[var(--gig-motion-fast)] ${menuOpen ? '-translate-y-[5.5px] -rotate-45' : ''}`}></span>
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-[rgba(7,15,13,0.48)] backdrop-blur-[6px] transition-opacity duration-[var(--gig-motion-base)] lg:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed inset-x-[5%] top-[84px] z-50 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,43,37,0.98)_0%,rgba(9,26,23,0.98)_100%)] p-5 text-white shadow-[0_28px_60px_rgba(0,0,0,0.28)] transition-all duration-[var(--gig-motion-base)] lg:hidden ${
          menuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/68">
          {isHome ? 'Find good food nearby.' : signedIn ? 'Your account' : 'Explore GIG'}
        </div>
        <div className="space-y-2 pt-2">
          <Link to="/find-food" onClick={() => setMenuOpen(false)} className={`flex min-h-[48px] items-center rounded-[18px] px-4 text-[15px] font-medium ${mobileItemClass(isRouteActive('/find-food'))}`}>
            Find food
          </Link>
          {isHome ? (
            <>
              <button onClick={() => scrollToSection('how-it-works')} className="flex min-h-[48px] w-full items-center rounded-[18px] px-4 text-left text-[15px] font-medium text-white transition-colors hover:bg-white/8">
                How it works
              </button>
              <button onClick={() => scrollToSection('for-businesses')} className="flex min-h-[48px] w-full items-center rounded-[18px] px-4 text-left text-[15px] font-medium text-white transition-colors hover:bg-white/8">
                For businesses
              </button>
              <Link to={homeSignInTo} onClick={() => setMenuOpen(false)} className="flex min-h-[48px] items-center rounded-[18px] px-4 text-[15px] font-medium text-white transition-colors hover:bg-white/8">
                {homeSignInLabel}
              </Link>
              <Link to={publicPartnerTo} onClick={() => setMenuOpen(false)} className="flex min-h-[48px] items-center rounded-[18px] px-4 text-[15px] font-medium text-white transition-colors hover:bg-white/8">
                {publicPartnerLabel}
              </Link>
            </>
          ) : isCustomerAppRoute && signedIn ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className={`flex min-h-[48px] items-center rounded-[18px] px-4 text-[15px] font-medium ${mobileItemClass(isRouteActive('/orders'))}`}>
                Orders
              </Link>
              <Link to={accountTo} onClick={() => setMenuOpen(false)} className={`flex min-h-[48px] items-center rounded-[18px] px-4 text-[15px] font-medium ${mobileItemClass(isRouteActive('/customer-profile'))}`}>
                {accountLabel}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex min-h-[48px] w-full items-center rounded-[18px] px-4 text-left text-[15px] font-medium text-white transition-colors hover:bg-white/8"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/#how-it-works" onClick={() => setMenuOpen(false)} className="flex min-h-[48px] items-center rounded-[18px] px-4 text-[15px] font-medium text-white transition-colors hover:bg-white/8">
                How it works
              </Link>
              <Link to="/#for-businesses" onClick={() => setMenuOpen(false)} className="flex min-h-[48px] items-center rounded-[18px] px-4 text-[15px] font-medium text-white transition-colors hover:bg-white/8">
                For businesses
              </Link>
              <Link to="/customer-auth" onClick={() => setMenuOpen(false)} className="flex min-h-[48px] items-center rounded-[18px] px-4 text-[15px] font-medium text-white transition-colors hover:bg-white/8">
                Sign in
              </Link>
              <Link to={publicPartnerTo} onClick={() => setMenuOpen(false)} className="flex min-h-[48px] items-center rounded-[18px] px-4 text-[15px] font-medium text-white transition-colors hover:bg-white/8">
                {publicPartnerLabel}
              </Link>
            </>
          )}
        </div>
        {(isHome || !signedIn) ? (
          <div className="mt-5 flex flex-col gap-3">
            <Link to="/find-food" onClick={() => setMenuOpen(false)} className="btn-secondary w-full justify-center border-white/12 bg-white text-[color:var(--gig-green-deep)]">
              Get the app
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
