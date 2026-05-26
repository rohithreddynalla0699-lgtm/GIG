import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Footer from '../components/Footer';
import MotionReveal from '../components/shared/MotionReveal';
import AuthBrandHeader from '../components/shared/AuthBrandHeader';
import { setMockCustomerSession } from '../data/mock/customers';

const phoneDigits = (value: string) => value.replace(/\D/g, '');
const fullNamePattern = /^[A-Za-z][A-Za-z .'-]*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.replace(/\s+/g, '').toLowerCase().slice(0, 254);
}

function normalizePhone(value: string) {
  return phoneDigits(value).slice(0, 10);
}

function normalizeName(value: string) {
  return value.replace(/\s{2,}/g, ' ').slice(0, 60);
}

function validateFullName(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 'Full name is required.';
  if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
  if (trimmed.length > 60) return 'Full name must be 60 characters or fewer.';
  if (!fullNamePattern.test(trimmed)) return 'Use letters, spaces, hyphens, apostrophes, or periods only.';
  return '';
}

function validateEmail(value: string) {
  if (!value) return 'Email address is required.';
  if (value.length > 254) return 'Email address must be 254 characters or fewer.';
  if (!emailPattern.test(value)) return 'Enter a valid email address.';
  return '';
}

function validatePhone(value: string) {
  if (!value) return 'Phone number is required.';
  if (value.length !== 10) return 'Phone number must be exactly 10 digits.';
  if (!/^[6-9]/.test(value)) return 'Phone number must start with 6, 7, 8, or 9.';
  return '';
}

function validateSigninPassword(value: string) {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (value.length > 72) return 'Password must be 72 characters or fewer.';
  return '';
}

function validateSignupPassword(value: string) {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (value.length > 72) return 'Password must be 72 characters or fewer.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Password must include at least 1 letter and 1 number.';
  return '';
}

function validateOtp(value: string) {
  if (!value) return 'OTP is required.';
  if (!/^\d{6}$/.test(value)) return 'Enter the 6-digit OTP.';
  return '';
}

export default function CustomerAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [currentTab, setCurrentTab] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  const [showOTP, setShowOTP] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showForgotSent, setShowForgotSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submittedPanels, setSubmittedPanels] = useState<Record<string, boolean>>({});

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const redirectTo = useMemo(() => {
    const stateRedirect =
      typeof location.state === 'object' && location.state && 'from' in location.state
        ? String((location.state as { from?: string }).from || '')
        : '';
    return stateRedirect || '/find-food';
  }, [location.state]);

  const normalizedLoginEmail = normalizeEmail(loginEmail);
  const normalizedSignupEmail = normalizeEmail(signupEmail);
  const normalizedResetEmail = normalizeEmail(resetEmail);
  const normalizedLoginPhone = normalizePhone(otpPhone);
  const normalizedSignupPhone = normalizePhone(signupPhone);
  const resetEmailValid = validateEmail(normalizedResetEmail) === '';
  const loginEmailError = validateEmail(normalizedLoginEmail);
  const loginPhoneError = validatePhone(normalizedLoginPhone);
  const signupNameError = validateFullName(signupName);
  const signupEmailError = validateEmail(normalizedSignupEmail);
  const signupPhoneError = validatePhone(normalizedSignupPhone);
  const loginPasswordError = validateSigninPassword(loginPassword);
  const signupPasswordError = validateSignupPassword(signupPassword);
  const otpError = validateOtp(otpCode);
  const resetEmailError = validateEmail(normalizedResetEmail);
  const isEmailLoginValid = loginEmailError === '' && loginPasswordError === '';
  const isPhoneLoginValid = loginPhoneError === '' && loginPasswordError === '';
  const isEmailSignupValid = signupNameError === '' && signupEmailError === '' && signupPhoneError === '' && signupPasswordError === '';
  const isPhoneSignupValid = signupNameError === '' && signupPhoneError === '' && signupPasswordError === '';

  const resetPanels = () => {
    setShowOTP(false);
    setShowForgot(false);
    setShowForgotSent(false);
    setOtpCode('');
  };

  const goAfterAuth = () => navigate(redirectTo);

  const handleLogin = () => {
    setMockCustomerSession();
    goAfterAuth();
  };

  const handleSendOTP = (phone: string) => {
    const normalizedPhone = normalizePhone(phone);
    if (validatePhone(normalizedPhone) !== '') {
      markPanelSubmitted(activePanelKey);
      markTouched('loginPhone');
      return;
    }

    setOtpPhone(normalizedPhone);
    setShowForgot(false);
    setShowForgotSent(false);
    setShowOTP(true);
    setOtpCode('');
  };

  const handleCreateAccount = () => {
    if (signupMethod === 'phone') {
      handleSendOTP(signupPhone);
      return;
    }
    setMockCustomerSession();
    goAfterAuth();
  };

  const handleVerifyOTP = () => {
    if (otpError) {
      markPanelSubmitted(activePanelKey);
      markTouched('otpCode');
      return;
    }
    setMockCustomerSession();
    goAfterAuth();
  };

  const handleEmailLogin = () => {
    if (!isEmailLoginValid) {
      markPanelSubmitted(activePanelKey);
      markTouched('loginEmail');
      markTouched('loginPassword');
      return;
    }
    handleLogin();
  };

  const handlePhoneLogin = () => {
    if (!isPhoneLoginValid) {
      markPanelSubmitted(activePanelKey);
      markTouched('loginPhone');
      markTouched('loginPassword');
      return;
    }
    handleLogin();
  };

  const handleSignupSubmit = () => {
    const valid = signupMethod === 'email' ? isEmailSignupValid : isPhoneSignupValid;
    if (!valid) {
      markPanelSubmitted(activePanelKey);
      markTouched('signupName');
      markTouched('signupPhone');
      markTouched('signupPassword');
      if (signupMethod === 'email') markTouched('signupEmail');
      return;
    }
    handleCreateAccount();
  };

  const handleResetPassword = () => {
    if (!resetEmailValid) {
      markPanelSubmitted(activePanelKey);
      markTouched('resetEmail');
      return;
    }
    setShowForgot(false);
    setShowForgotSent(true);
  };

  const authHeading =
    currentTab === 'login' ? 'Sign in to continue.' : 'Create your account.';
  const authBody =
    currentTab === 'login'
      ? 'Access saved stores, pickups, and app handoff details.'
      : 'Save favourites, view pickups, and continue reservations.';
  const activePanelKey = showOTP
    ? 'otp'
    : showForgot
    ? 'forgot'
    : showForgotSent
    ? 'forgot-sent'
    : `${currentTab}-${currentTab === 'login' ? loginMethod : signupMethod}`;
  const showError = (field: string) => touched[field] || submittedPanels[activePanelKey];
  const fieldErrorClass = (hasError: boolean) =>
    hasError
      ? 'border-[rgba(166,94,94,0.32)] focus:border-[rgba(166,94,94,0.38)] focus:shadow-[0_0_0_3px_rgba(166,94,94,0.08)]'
      : '';
  const shellErrorClass = (hasError: boolean) =>
    hasError ? 'border-[rgba(166,94,94,0.32)] shadow-[0_0_0_3px_rgba(166,94,94,0.08)]' : '';

  const markTouched = (field: string) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const markPanelSubmitted = (panel: string) => {
    setSubmittedPanels((current) => ({ ...current, [panel]: true }));
  };

  return (
    <div className="min-h-screen">
      <main className="auth-stage px-[5%] py-8 md:py-12">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            animate={reduceMotion ? undefined : { x: [0, 14, 0], y: [0, 10, 0] }}
            transition={reduceMotion ? undefined : { duration: 18, ease: 'easeInOut', repeat: Infinity }}
            className="absolute left-[-4%] top-[8%] h-[180px] w-[180px] rounded-full bg-[rgba(44,137,120,0.08)] blur-[42px]"
          />
          <motion.div
            animate={reduceMotion ? undefined : { x: [0, -12, 0], y: [0, 12, 0] }}
            transition={reduceMotion ? undefined : { duration: 20, ease: 'easeInOut', repeat: Infinity }}
            className="absolute right-[-2%] top-[16%] h-[170px] w-[170px] rounded-full bg-[rgba(214,160,106,0.07)] blur-[40px]"
          />
        </motion.div>
        <div className="section-shell relative z-10">
          <MotionReveal y={18}>
            <AuthBrandHeader note="Customer access" />
          </MotionReveal>

          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-8">
            <MotionReveal className="order-2 self-start lg:order-1 lg:min-h-[760px] lg:flex lg:items-center" delay={0.06} y={26}>
              <section className="auth-showcase w-full rounded-[32px] p-6 transition-transform duration-[var(--gig-motion-slow)] hover:-translate-y-[2px] md:p-7">
                <div className="relative z-10">
                  <div className="eyebrow mb-3 text-[#cde7db]">Customer access</div>
                  <h1 className="font-['Fraunces',serif] text-[clamp(2rem,4.4vw,3.7rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                    Find good food near you.
                  </h1>
                  <p className="mt-4 max-w-[44ch] text-[15px] leading-[1.8] text-white/78 md:text-[16px]">
                    Sign in to save your favourite outlets, view pickups, and continue reservations.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {['Save favourite outlets', 'View upcoming pickups', 'Continue reservations'].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[12px] font-medium text-white/74 transition-colors duration-[var(--gig-motion-fast)] hover:bg-white/10 hover:text-white/82"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7">
                    <Link
                      to="/find-food"
                      className="inline-flex items-center gap-2 text-[14px] font-medium text-white/72 transition-all duration-[var(--gig-motion-fast)] hover:translate-x-[2px] hover:text-white"
                    >
                      <span>Browse nearby food</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </section>
            </MotionReveal>

            <MotionReveal delay={0.14} className="order-1 lg:order-2" y={22}>
              <section className="auth-form-card rounded-[30px] p-5 transition-shadow duration-[var(--gig-motion-slow)] hover:shadow-[var(--gig-shadow-lg)] md:p-7 lg:min-h-[760px] lg:flex lg:flex-col">
                <div className="mb-6">
                  <div className="auth-pill-toggle mb-4">
                    <button
                      onClick={() => {
                        setCurrentTab('login');
                        resetPanels();
                      }}
                      className={`rounded-full px-4 py-[10px] text-[14px] font-semibold transition-all duration-[var(--gig-motion-fast)] ${
                        currentTab === 'login'
                          ? 'bg-white text-[color:var(--gig-text)] shadow-[0_8px_18px_rgba(31,34,29,0.06)]'
                          : 'text-[color:var(--gig-text-soft)] hover:text-[color:var(--gig-text)]'
                      }`}
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('signup');
                        resetPanels();
                      }}
                      className={`rounded-full px-4 py-[10px] text-[14px] font-semibold transition-all duration-[var(--gig-motion-fast)] ${
                        currentTab === 'signup'
                          ? 'bg-white text-[color:var(--gig-text)] shadow-[0_8px_18px_rgba(31,34,29,0.06)]'
                          : 'text-[color:var(--gig-text-soft)] hover:text-[color:var(--gig-text)]'
                      }`}
                    >
                      Create account
                    </button>
                  </div>

                  <h2 className="font-['Fraunces',serif] text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-[color:var(--gig-text)]">
                    {authHeading}
                  </h2>
                  <p className="mt-2 text-[15px] leading-[1.72] text-[color:var(--gig-text-muted)]">
                    {authBody}
                  </p>
                </div>

                <div className="lg:min-h-[430px]">
                <AnimatePresence mode="wait" initial={false}>
                  {!showOTP && !showForgot && !showForgotSent && currentTab === 'login' && (
                    <motion.div
                      key={activePanelKey}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                    <div className="mb-5 flex gap-2">
                      {(['email', 'phone'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setLoginMethod(method)}
                          className={`flex-1 rounded-[18px] border px-4 py-3 text-[14px] font-semibold transition-all duration-[var(--gig-motion-fast)] ${
                            loginMethod === method
                              ? 'border-[rgba(11,122,77,0.14)] bg-[rgba(11,122,77,0.05)] text-[color:var(--gig-green-deep)]'
                              : 'border-[color:var(--gig-border)] text-[color:var(--gig-text-muted)] hover:border-[rgba(11,122,77,0.12)] hover:bg-[rgba(11,122,77,0.02)]'
                          }`}
                        >
                          {method === 'email' ? 'Email' : 'Phone'}
                        </button>
                      ))}
                    </div>

                    {loginMethod === 'email' ? (
                      <>
                        <div className="mb-4">
                          <label className="operational-label mb-2 block">Email address</label>
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(normalizeEmail(e.target.value))}
                            onBlur={() => markTouched('loginEmail')}
                            placeholder="you@example.com"
                            aria-invalid={showError('loginEmail') && Boolean(loginEmailError)}
                            aria-describedby={showError('loginEmail') && loginEmailError ? 'login-email-error' : undefined}
                            className={`auth-input ${fieldErrorClass(showError('loginEmail') && Boolean(loginEmailError))}`}
                          />
                          {showError('loginEmail') && loginEmailError ? (
                            <div id="login-email-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {loginEmailError}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-4">
                          <label className="operational-label mb-2 block">Password</label>
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value.slice(0, 72))}
                            onBlur={() => markTouched('loginPassword')}
                            placeholder="Enter your password"
                            aria-invalid={showError('loginPassword') && Boolean(loginPasswordError)}
                            aria-describedby={showError('loginPassword') && loginPasswordError ? 'login-password-error' : undefined}
                            className={`auth-input ${fieldErrorClass(showError('loginPassword') && Boolean(loginPasswordError))}`}
                          />
                          {showError('loginPassword') && loginPasswordError ? (
                            <div id="login-password-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {loginPasswordError}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-5 text-right">
                          <button
                            onClick={() => setShowForgot(true)}
                            className="text-[13px] font-semibold text-[color:var(--gig-green-deep)]"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <button
                          onClick={handleEmailLogin}
                          disabled={!isEmailLoginValid}
                          className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Sign in
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <label className="operational-label mb-2 block">Phone number</label>
                          <div className={`auth-input-shell ${shellErrorClass(showError('loginPhone') && Boolean(loginPhoneError))}`}>
                            <span className="flex items-center border-r border-[color:var(--gig-border)] bg-[rgba(32,38,28,0.03)] px-4 text-[14px] font-semibold text-[color:var(--gig-text)]">
                              +91
                            </span>
                            <input
                              type="tel"
                              value={otpPhone}
                              onChange={(e) => setOtpPhone(normalizePhone(e.target.value))}
                              onBlur={() => markTouched('loginPhone')}
                              placeholder="98765 43210"
                              className="w-full bg-transparent px-4 py-[14px] text-[15px] outline-none"
                              aria-label="Phone number"
                              inputMode="numeric"
                              maxLength={10}
                              aria-invalid={showError('loginPhone') && Boolean(loginPhoneError)}
                              aria-describedby={showError('loginPhone') && loginPhoneError ? 'login-phone-error' : undefined}
                            />
                          </div>
                          {showError('loginPhone') && loginPhoneError ? (
                            <div id="login-phone-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {loginPhoneError}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-4">
                          <label className="operational-label mb-2 block">Password</label>
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value.slice(0, 72))}
                            onBlur={() => markTouched('loginPassword')}
                            placeholder="Enter your password"
                            aria-invalid={showError('loginPassword') && Boolean(loginPasswordError)}
                            aria-describedby={showError('loginPassword') && loginPasswordError ? 'login-phone-password-error' : undefined}
                            className={`auth-input ${fieldErrorClass(showError('loginPassword') && Boolean(loginPasswordError))}`}
                          />
                          {showError('loginPassword') && loginPasswordError ? (
                            <div id="login-phone-password-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {loginPasswordError}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[13px]">
                          <button
                            onClick={() => setShowForgot(true)}
                            className="font-semibold text-[color:var(--gig-green-deep)]"
                          >
                            Forgot password?
                          </button>
                          <button
                            onClick={() => handleSendOTP(otpPhone)}
                            className="font-semibold text-[color:var(--gig-green-deep)]"
                          >
                            Use OTP instead
                          </button>
                        </div>
                        <button
                          onClick={handlePhoneLogin}
                          disabled={!isPhoneLoginValid}
                          className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Sign in
                        </button>
                      </>
                    )}

                    {loginMethod === 'email' ? (
                      <>
                        <div className="auth-divider my-6">
                          <span className="auth-divider-label">Or continue with</span>
                        </div>
                        <button className="btn-secondary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px]">Continue with Google</button>
                      </>
                    ) : null}
                    </motion.div>
                  )}

                  {!showOTP && !showForgot && !showForgotSent && currentTab === 'signup' && (
                    <motion.div
                      key={activePanelKey}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                    <div className="mb-5 flex gap-2">
                      {(['email', 'phone'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setSignupMethod(method)}
                          className={`flex-1 rounded-[18px] border px-4 py-3 text-[14px] font-semibold transition-all duration-[var(--gig-motion-fast)] ${
                            signupMethod === method
                              ? 'border-[rgba(11,122,77,0.14)] bg-[rgba(11,122,77,0.05)] text-[color:var(--gig-green-deep)]'
                              : 'border-[color:var(--gig-border)] text-[color:var(--gig-text-muted)] hover:border-[rgba(11,122,77,0.12)] hover:bg-[rgba(11,122,77,0.02)]'
                          }`}
                        >
                          {method === 'email' ? 'Email' : 'Phone'}
                        </button>
                      ))}
                    </div>

                    <div className="mb-4">
                      <label className="operational-label mb-2 block">Full name</label>
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(normalizeName(e.target.value))}
                        onBlur={() => markTouched('signupName')}
                        placeholder="Your full name"
                        aria-invalid={showError('signupName') && Boolean(signupNameError)}
                        aria-describedby={showError('signupName') && signupNameError ? 'signup-name-error' : undefined}
                        className={`auth-input ${fieldErrorClass(showError('signupName') && Boolean(signupNameError))}`}
                      />
                      {showError('signupName') && signupNameError ? (
                        <div id="signup-name-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                          {signupNameError}
                        </div>
                      ) : null}
                    </div>

                    {signupMethod === 'email' ? (
                      <div className="mb-4">
                        <label className="operational-label mb-2 block">Email address</label>
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(normalizeEmail(e.target.value))}
                          onBlur={() => markTouched('signupEmail')}
                          placeholder="you@example.com"
                          aria-invalid={showError('signupEmail') && Boolean(signupEmailError)}
                          aria-describedby={showError('signupEmail') && signupEmailError ? 'signup-email-error' : undefined}
                          className={`auth-input ${fieldErrorClass(showError('signupEmail') && Boolean(signupEmailError))}`}
                        />
                        {showError('signupEmail') && signupEmailError ? (
                          <div id="signup-email-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                            {signupEmailError}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mb-4">
                      <label className="operational-label mb-2 block">Phone number</label>
                      <div className={`auth-input-shell ${shellErrorClass(showError('signupPhone') && Boolean(signupPhoneError))}`}>
                        <span className="flex items-center border-r border-[color:var(--gig-border)] bg-[rgba(32,38,28,0.03)] px-4 text-[14px] font-semibold text-[color:var(--gig-text)]">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(normalizePhone(e.target.value))}
                          onBlur={() => markTouched('signupPhone')}
                          placeholder="98765 43210"
                          className="w-full bg-transparent px-4 py-[14px] text-[15px] outline-none"
                          inputMode="numeric"
                          maxLength={10}
                          aria-invalid={showError('signupPhone') && Boolean(signupPhoneError)}
                          aria-describedby={showError('signupPhone') && signupPhoneError ? 'signup-phone-error' : undefined}
                        />
                      </div>
                      {showError('signupPhone') && signupPhoneError ? (
                        <div id="signup-phone-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                          {signupPhoneError}
                        </div>
                      ) : null}
                    </div>

                    <div className="mb-4">
                      <label className="operational-label mb-2 block">Password</label>
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value.slice(0, 72))}
                        onBlur={() => markTouched('signupPassword')}
                        placeholder="At least 8 characters"
                        aria-invalid={showError('signupPassword') && Boolean(signupPasswordError)}
                        aria-describedby={showError('signupPassword') && signupPasswordError ? 'signup-password-error' : 'signup-password-help'}
                        className={`auth-input ${fieldErrorClass(showError('signupPassword') && Boolean(signupPasswordError))}`}
                      />
                      {showError('signupPassword') && signupPasswordError ? (
                        <div id="signup-password-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                          {signupPasswordError}
                        </div>
                      ) : (
                        <div id="signup-password-help" className="mt-2 text-[13px] text-[color:var(--gig-text-soft)]">
                          Use 8-72 characters with at least 1 letter and 1 number.
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSignupSubmit}
                      disabled={signupMethod === 'email' ? !isEmailSignupValid : !isPhoneSignupValid}
                      className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {signupMethod === 'email' ? 'Create account' : 'Send OTP'}
                    </button>

                    <div className="meta-text mt-4 text-center">
                      By continuing, you agree to the account terms and our{' '}
                      <Link to="/privacy-policy" className="text-[color:var(--gig-green-deep)]">
                        Privacy Policy
                      </Link>
                      .
                    </div>
                    </motion.div>
                  )}

                  {showOTP && (
                    <motion.div
                      key={activePanelKey}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="py-1"
                    >
                    <button
                      onClick={() => setShowOTP(false)}
                      className="mb-5 text-[14px] font-medium text-[color:var(--gig-text-muted)] hover:text-[color:var(--gig-green-deep)]"
                    >
                      Back
                    </button>
                    <div className="eyebrow mb-3">Phone verification</div>
                    <h2 className="font-['Fraunces',serif] text-[clamp(1.75rem,3vw,2.35rem)] font-semibold leading-[1] tracking-[-0.04em] text-[color:var(--gig-text)]">
                      Verify your phone
                    </h2>
                    <p className="mt-2 mb-6 text-[15px] leading-[1.72] text-[color:var(--gig-text-muted)]">
                      Enter the 6-digit code sent to <strong className="text-[color:var(--gig-text)]">+91 {normalizedLoginPhone || '9876543210'}</strong>.
                    </p>
                    <div className="mb-5 flex flex-wrap gap-2.5 sm:gap-3">
                      {[...Array(6)].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          aria-label={`OTP digit ${i + 1}`}
                          inputMode="numeric"
                          value={otpCode[i] ?? ''}
                          onChange={(e) => {
                            const digit = e.target.value.replace(/\D/g, '').slice(-1);
                            const next = otpCode.padEnd(6, ' ').split('');
                            next[i] = digit;
                            setOtpCode(next.join('').replace(/\s+/g, '').slice(0, 6));
                          }}
                          onBlur={() => markTouched('otpCode')}
                          aria-invalid={showError('otpCode') && Boolean(otpError)}
                          aria-describedby={showError('otpCode') && otpError ? 'otp-code-error' : undefined}
                          className={`h-[52px] w-[46px] rounded-[16px] border bg-white text-center text-lg font-semibold outline-none transition-colors focus:border-[rgba(11,122,77,0.18)] ${
                            showError('otpCode') && otpError ? 'border-[rgba(166,94,94,0.32)]' : 'border-[color:var(--gig-border)]'
                          }`}
                        />
                      ))}
                    </div>
                    {showError('otpCode') && otpError ? (
                      <div id="otp-code-error" className="mb-4 text-[13px] text-[rgba(143,78,78,0.9)]">
                        {otpError}
                      </div>
                    ) : null}
                    <div className="mb-5 text-[13px] text-[color:var(--gig-text-muted)]">
                      Didn&apos;t receive it? <button className="font-semibold text-[color:var(--gig-green-deep)]">Resend code</button>
                    </div>
                    <button onClick={handleVerifyOTP} className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px]">
                      Verify and continue
                    </button>
                    </motion.div>
                  )}

                  {showForgot && (
                    <motion.div
                      key={activePanelKey}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                    <button
                      onClick={() => setShowForgot(false)}
                      className="mb-5 text-[14px] font-medium text-[color:var(--gig-text-muted)] hover:text-[color:var(--gig-green-deep)]"
                    >
                      Back to sign in
                    </button>
                    <div className="eyebrow mb-3">Reset access</div>
                    <h2 className="font-['Fraunces',serif] text-[clamp(1.75rem,3vw,2.35rem)] font-semibold leading-[1] tracking-[-0.04em] text-[color:var(--gig-text)]">
                      Reset password
                    </h2>
                    <p className="mt-2 mb-6 text-[15px] leading-[1.72] text-[color:var(--gig-text-muted)]">
                      Enter your email and we&apos;ll send you a reset link.
                    </p>
                    <div className="mb-4">
                      <label className="operational-label mb-2 block">Email address</label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(normalizeEmail(e.target.value))}
                        onBlur={() => markTouched('resetEmail')}
                        placeholder="you@example.com"
                        aria-invalid={showError('resetEmail') && Boolean(resetEmailError)}
                        aria-describedby={showError('resetEmail') && resetEmailError ? 'reset-email-error' : undefined}
                        className={`auth-input ${fieldErrorClass(showError('resetEmail') && Boolean(resetEmailError))}`}
                      />
                      {showError('resetEmail') && resetEmailError ? (
                        <div id="reset-email-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                          {resetEmailError}
                        </div>
                      ) : null}
                    </div>
                    <button
                      onClick={handleResetPassword}
                      disabled={!resetEmailValid}
                      className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Send reset link
                    </button>
                    </motion.div>
                  )}

                  {showForgotSent && (
                    <motion.div
                      key={activePanelKey}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="py-1 text-center"
                    >
                    <div className="eyebrow mb-3">Check your inbox</div>
                    <h2 className="font-['Fraunces',serif] text-[clamp(1.75rem,3vw,2.35rem)] font-semibold leading-[1] tracking-[-0.04em] text-[color:var(--gig-text)]">
                      Check your email
                    </h2>
                    <p className="mt-2 mb-6 text-[15px] leading-[1.72] text-[color:var(--gig-text-muted)]">
                      We sent a reset link to <strong className="text-[color:var(--gig-text)]">{resetEmail || 'you@example.com'}</strong>.
                    </p>
                    <div className="mb-5 text-[13px] text-[color:var(--gig-text-muted)]">
                      Didn&apos;t get it? <button className="font-semibold text-[color:var(--gig-green-deep)]">Resend link</button>
                    </div>
                    <button
                      onClick={() => {
                        setShowForgotSent(false);
                        setCurrentTab('login');
                      }}
                      className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px]"
                    >
                      Back to sign in
                    </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>

                <div className="mt-6 border-t border-[color:var(--gig-border)] pt-5 text-center">
                  <div className="text-[14px] text-[color:var(--gig-text-muted)]">
                    {currentTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      onClick={() => {
                        setCurrentTab(currentTab === 'login' ? 'signup' : 'login');
                        resetPanels();
                      }}
                      className="font-semibold text-[color:var(--gig-green-deep)]"
                    >
                      {currentTab === 'login' ? 'Create one' : 'Sign in'}
                    </button>
                  </div>
                  <div className="mt-3 text-[13px] text-[color:var(--gig-text-soft)]">
                    Are you a business?{' '}
                    <Link to="/partner/onboarding" className="font-semibold text-[color:var(--gig-green-deep)]">
                      Join as a partner
                    </Link>
                  </div>
                </div>
              </section>
            </MotionReveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
