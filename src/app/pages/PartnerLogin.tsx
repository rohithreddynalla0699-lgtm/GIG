import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router';
import MotionReveal from '../components/shared/MotionReveal';
import AuthBrandHeader from '../components/shared/AuthBrandHeader';
import { getMockPartnerProfile, setMockPartnerSession } from '../data/mock/partners';

const phoneDigits = (value: string) => value.replace(/\D/g, '');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.replace(/\s+/g, '').toLowerCase().slice(0, 254);
}

function normalizePhone(value: string) {
  return phoneDigits(value).slice(0, 10);
}

function validateEmail(value: string) {
  if (!value) return 'Business email is required.';
  if (value.length > 254) return 'Business email must be 254 characters or fewer.';
  if (!emailPattern.test(value)) return 'Enter a valid business email address.';
  return '';
}

function validatePassword(value: string) {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (value.length > 72) return 'Password must be 72 characters or fewer.';
  return '';
}

function validatePhone(value: string) {
  if (!value) return 'Phone number is required.';
  if (value.length !== 10) return 'Phone number must be exactly 10 digits.';
  if (!/^[6-9]/.test(value)) return 'Phone number must start with 6, 7, 8, or 9.';
  return '';
}

function validateOtp(value: string) {
  if (!value) return 'OTP is required.';
  if (!/^\d{6}$/.test(value)) return 'Enter the 6-digit OTP.';
  return '';
}

export default function PartnerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const [showOTP, setShowOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showResetSent, setShowResetSent] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submittedPanels, setSubmittedPanels] = useState<Record<string, boolean>>({});

  const redirectTo = useMemo(() => {
    const stateRedirect =
      typeof location.state === 'object' && location.state && 'from' in location.state
        ? String((location.state as { from?: string }).from || '')
        : '';

    if (stateRedirect) {
      return stateRedirect;
    }

    const profile = getMockPartnerProfile();

    if (
      profile.verificationStatus === 'pending_verification' ||
      profile.verificationStatus === 'ready_for_review' ||
      profile.verificationStatus === 'submitted_for_review'
    ) {
      return '/partner/profile';
    }

    if (profile.verificationStatus === 'approved' && profile.billingStatus !== 'active') {
      return '/partner/billing';
    }

    if (profile.verificationStatus === 'approved' && profile.billingStatus === 'active') {
      return '/partner';
    }

    return '/partner/profile';
  }, [location.state]);

  const normalizedLoginEmail = normalizeEmail(loginEmail);
  const normalizedOtpPhone = normalizePhone(otpPhone);
  const normalizedResetEmail = normalizeEmail(resetEmail);

  const loginEmailError = validateEmail(normalizedLoginEmail);
  const loginPasswordError = validatePassword(loginPassword);
  const otpPhoneError = validatePhone(normalizedOtpPhone);
  const otpCodeError = validateOtp(otpCode);
  const resetEmailError = validateEmail(normalizedResetEmail);

  const isLoginValid = loginEmailError === '' && loginPasswordError === '';
  const isOtpRequestValid = otpPhoneError === '';
  const isOtpVerifyValid = otpCodeError === '';
  const isResetValid = resetEmailError === '';

  const activePanelKey = showOTP
    ? otpSent
      ? 'otp-verify'
      : 'otp-request'
    : showReset
    ? 'reset'
    : showResetSent
    ? 'reset-sent'
    : 'login';

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

  const resetTransientPanels = () => {
    setShowOTP(false);
    setOtpSent(false);
    setShowReset(false);
    setShowResetSent(false);
    setOtpCode('');
  };

  const completePartnerLogin = () => {
    setMockPartnerSession();
    navigate(redirectTo);
  };

  const handleEmailLogin = () => {
    if (!isLoginValid) {
      markPanelSubmitted(activePanelKey);
      markTouched('loginEmail');
      markTouched('loginPassword');
      return;
    }
    completePartnerLogin();
  };

  const handleOtpRequest = () => {
    if (!isOtpRequestValid) {
      markPanelSubmitted(activePanelKey);
      markTouched('otpPhone');
      return;
    }
    setOtpPhone(normalizedOtpPhone);
    setOtpSent(true);
    setOtpCode('');
  };

  const handleOtpVerify = () => {
    if (!isOtpVerifyValid) {
      markPanelSubmitted(activePanelKey);
      markTouched('otpCode');
      return;
    }
    completePartnerLogin();
  };

  const handleResetPassword = () => {
    if (!isResetValid) {
      markPanelSubmitted(activePanelKey);
      markTouched('resetEmail');
      return;
    }
    setShowReset(false);
    setShowResetSent(true);
  };

  return (
    <div className="min-h-screen">
      <main className="auth-stage px-[5%] py-8 md:py-12">
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={reduceMotion ? undefined : { x: [0, 14, 0], y: [0, 10, 0] }}
            transition={reduceMotion ? undefined : { duration: 20, ease: 'easeInOut', repeat: Infinity }}
            className="absolute left-[-3%] top-[10%] h-[170px] w-[170px] rounded-full bg-[rgba(44,137,120,0.07)] blur-[40px]"
          />
          <motion.div
            animate={reduceMotion ? undefined : { x: [0, -12, 0], y: [0, 12, 0] }}
            transition={reduceMotion ? undefined : { duration: 22, ease: 'easeInOut', repeat: Infinity }}
            className="absolute right-[-2%] top-[18%] h-[160px] w-[160px] rounded-full bg-[rgba(214,160,106,0.06)] blur-[38px]"
          />
        </motion.div>

        <div className="section-shell relative z-10">
          <MotionReveal y={18}>
            <AuthBrandHeader note="Partner access" />
          </MotionReveal>

          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-8">
            <MotionReveal className="order-2 self-start lg:order-1 lg:min-h-[760px] lg:flex lg:items-center" delay={0.06} y={24}>
              <section className="auth-showcase w-full rounded-[32px] p-6 transition-transform duration-[var(--gig-motion-slow)] hover:-translate-y-[2px] md:p-7">
                <div className="relative z-10">
                  <div className="eyebrow mb-3 text-[#cde7db]">Partner access</div>
                  <h1 className="font-['Fraunces',serif] text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                    Resume your partner account.
                  </h1>
                  <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.8] text-white/78 md:text-[16px]">
                    Continue verification, billing setup, or rescue bag management from the same saved workspace.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {['Continue verification', 'Finish billing setup', 'Manage rescue bags'].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[12px] font-medium text-white/74 transition-colors duration-[var(--gig-motion-fast)] hover:bg-white/10 hover:text-white/82"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 space-y-3">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/48">
                      New partner setup
                    </div>
                    <p className="max-w-[36ch] text-[14px] leading-[1.75] text-white/72">
                      If your outlet is not onboarded yet, start with the partner setup flow and we&apos;ll take you through verification.
                    </p>
                    <Link
                      to="/partner/onboarding"
                      className="inline-flex items-center gap-2 text-[14px] font-medium text-white/74 transition-all duration-[var(--gig-motion-fast)] hover:translate-x-[2px] hover:text-white"
                    >
                      <span>Start partner onboarding</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </section>
            </MotionReveal>

            <MotionReveal delay={0.14} className="order-1 lg:order-2" y={22}>
              <section className="auth-form-card rounded-[30px] p-5 transition-shadow duration-[var(--gig-motion-slow)] hover:shadow-[var(--gig-shadow-lg)] md:p-7 lg:min-h-[760px] lg:flex lg:flex-col">
                <div className="mb-6">
                  <div className="eyebrow mb-3">Partner sign in</div>
                  <h2 className="font-['Fraunces',serif] text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-[color:var(--gig-text)]">
                    Resume your partner account.
                  </h2>
                  <p className="mt-2 text-[15px] leading-[1.72] text-[color:var(--gig-text-muted)]">
                    Sign in to continue verification, billing setup, or rescue bag management from your saved partner workspace.
                  </p>
                </div>

                <div className="lg:min-h-[430px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {!showOTP && !showReset && !showResetSent ? (
                      <motion.div
                        key="login"
                        initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="mb-4">
                          <label className="operational-label mb-2 block">Business email</label>
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(normalizeEmail(e.target.value))}
                            onBlur={() => markTouched('loginEmail')}
                            placeholder="business@example.com"
                            aria-invalid={showError('loginEmail') && Boolean(loginEmailError)}
                            aria-describedby={showError('loginEmail') && loginEmailError ? 'partner-login-email-error' : undefined}
                            className={`auth-input ${fieldErrorClass(showError('loginEmail') && Boolean(loginEmailError))}`}
                          />
                          {showError('loginEmail') && loginEmailError ? (
                            <div id="partner-login-email-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
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
                            aria-describedby={showError('loginPassword') && loginPasswordError ? 'partner-login-password-error' : undefined}
                            className={`auth-input ${fieldErrorClass(showError('loginPassword') && Boolean(loginPasswordError))}`}
                          />
                          {showError('loginPassword') && loginPasswordError ? (
                            <div id="partner-login-password-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {loginPasswordError}
                            </div>
                          ) : null}
                        </div>

                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[13px]">
                          <button
                            type="button"
                            onClick={() => {
                              setShowReset(true);
                              setShowOTP(false);
                              setShowResetSent(false);
                            }}
                            className="font-semibold text-[color:var(--gig-green-deep)] transition-colors duration-[var(--gig-motion-fast)] hover:text-[color:var(--gig-green)]"
                          >
                            Forgot password?
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowOTP(true);
                              setOtpSent(false);
                              setShowReset(false);
                              setShowResetSent(false);
                              setOtpCode('');
                            }}
                            className="font-semibold text-[color:var(--gig-green-deep)] transition-colors duration-[var(--gig-motion-fast)] hover:text-[color:var(--gig-green)]"
                          >
                            Use OTP instead
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleEmailLogin}
                          disabled={!isLoginValid}
                          className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Sign in
                        </button>
                      </motion.div>
                    ) : null}

                    {showOTP ? (
                      <motion.div
                        key={otpSent ? 'otp-verify' : 'otp-request'}
                        initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            resetTransientPanels();
                            setOtpPhone('');
                          }}
                          className="mb-6 text-[14px] font-medium text-[color:var(--gig-text-muted)] transition-colors duration-[var(--gig-motion-fast)] hover:text-[color:var(--gig-green-deep)]"
                        >
                          Back to login
                        </button>

                        <div className="eyebrow mb-3">OTP access</div>
                        <h2 className="section-title mb-2">{otpSent ? 'Verify your code' : 'Use OTP instead'}</h2>
                        <p className="body-regular mb-5">
                          {otpSent
                            ? 'Enter the 6-digit code sent to your registered outlet phone number.'
                            : 'Use your registered outlet phone number to sign in without a password.'}
                        </p>

                        {!otpSent ? (
                          <>
                            <div className="mb-4">
                              <label className="operational-label mb-2 block">Phone number</label>
                              <div className={`auth-input-shell ${shellErrorClass(showError('otpPhone') && Boolean(otpPhoneError))}`}>
                                <span className="flex items-center border-r border-[color:var(--gig-border)] bg-[rgba(32,38,28,0.03)] px-4 text-[14px] font-semibold text-[color:var(--gig-text)]">
                                  +91
                                </span>
                                <input
                                  type="tel"
                                  value={otpPhone}
                                  onChange={(e) => setOtpPhone(normalizePhone(e.target.value))}
                                  onBlur={() => markTouched('otpPhone')}
                                  placeholder="98765 43210"
                                  className="w-full bg-transparent px-4 py-[14px] text-[15px] outline-none"
                                  inputMode="numeric"
                                  maxLength={10}
                                  aria-label="Phone number"
                                  aria-invalid={showError('otpPhone') && Boolean(otpPhoneError)}
                                  aria-describedby={showError('otpPhone') && otpPhoneError ? 'partner-otp-phone-error' : undefined}
                                />
                              </div>
                              {showError('otpPhone') && otpPhoneError ? (
                                <div id="partner-otp-phone-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                                  {otpPhoneError}
                                </div>
                              ) : null}
                            </div>

                            <button
                              type="button"
                              onClick={handleOtpRequest}
                              disabled={!isOtpRequestValid}
                              className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Send OTP
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="mb-4 rounded-[20px] border border-[rgba(11,122,77,0.08)] bg-[rgba(11,122,77,0.04)] px-4 py-3">
                              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">
                                Registered phone
                              </div>
                              <div className="mt-1 text-[15px] font-semibold text-[color:var(--gig-text)]">
                                +91 {normalizedOtpPhone}
                              </div>
                            </div>

                            <div className="mb-4">
                              <label className="operational-label mb-2 block">OTP</label>
                              <input
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(phoneDigits(e.target.value).slice(0, 6))}
                                onBlur={() => markTouched('otpCode')}
                                placeholder="Enter 6-digit OTP"
                                inputMode="numeric"
                                maxLength={6}
                                aria-invalid={showError('otpCode') && Boolean(otpCodeError)}
                                aria-describedby={showError('otpCode') && otpCodeError ? 'partner-otp-code-error' : undefined}
                                className={`auth-input ${fieldErrorClass(showError('otpCode') && Boolean(otpCodeError))}`}
                              />
                              {showError('otpCode') && otpCodeError ? (
                                <div id="partner-otp-code-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                                  {otpCodeError}
                                </div>
                              ) : null}
                            </div>

                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[13px]">
                              <button
                                type="button"
                                onClick={() => {
                                  setOtpSent(false);
                                  setOtpCode('');
                                }}
                                className="font-semibold text-[color:var(--gig-green-deep)] transition-colors duration-[var(--gig-motion-fast)] hover:text-[color:var(--gig-green)]"
                              >
                                Change phone number
                              </button>
                              <button
                                type="button"
                                onClick={handleOtpRequest}
                                className="font-semibold text-[color:var(--gig-green-deep)] transition-colors duration-[var(--gig-motion-fast)] hover:text-[color:var(--gig-green)]"
                              >
                                Resend OTP
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={handleOtpVerify}
                              disabled={!isOtpVerifyValid}
                              className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Verify OTP
                            </button>
                          </>
                        )}
                      </motion.div>
                    ) : null}

                    {showReset ? (
                      <motion.div
                        key="reset"
                        initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <button
                          type="button"
                          onClick={resetTransientPanels}
                          className="mb-6 text-[14px] font-medium text-[color:var(--gig-text-muted)] transition-colors duration-[var(--gig-motion-fast)] hover:text-[color:var(--gig-green-deep)]"
                        >
                          Back to login
                        </button>
                        <div className="eyebrow mb-3">Reset access</div>
                        <h2 className="section-title mb-2">Reset your password</h2>
                        <p className="body-regular mb-6">Enter your business email and we&apos;ll send you a reset link.</p>

                        <div className="mb-4">
                          <label className="operational-label mb-2 block">Business email</label>
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(normalizeEmail(e.target.value))}
                            onBlur={() => markTouched('resetEmail')}
                            placeholder="business@example.com"
                            aria-invalid={showError('resetEmail') && Boolean(resetEmailError)}
                            aria-describedby={showError('resetEmail') && resetEmailError ? 'partner-reset-email-error' : undefined}
                            className={`auth-input ${fieldErrorClass(showError('resetEmail') && Boolean(resetEmailError))}`}
                          />
                          {showError('resetEmail') && resetEmailError ? (
                            <div id="partner-reset-email-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {resetEmailError}
                            </div>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={handleResetPassword}
                          disabled={!isResetValid}
                          className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Send reset link
                        </button>
                      </motion.div>
                    ) : null}

                    {showResetSent ? (
                      <motion.div
                        key="reset-sent"
                        initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="py-2 text-center"
                      >
                        <div className="eyebrow mb-3">Check your inbox</div>
                        <h2 className="section-title mb-2">Reset link sent</h2>
                        <p className="body-regular mb-5">
                          We&apos;ve sent a password reset link to{' '}
                          <strong className="text-[color:var(--gig-text)]">{normalizedResetEmail || 'business@example.com'}</strong>.
                        </p>

                        <div className="mb-6 text-[13px] text-[color:var(--gig-text-muted)]">
                          Didn&apos;t receive it?{' '}
                          <button
                            type="button"
                            onClick={handleResetPassword}
                            className="font-semibold text-[color:var(--gig-green-deep)] transition-colors duration-[var(--gig-motion-fast)] hover:text-[color:var(--gig-green)]"
                          >
                            Resend link
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={resetTransientPanels}
                          className="btn-secondary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px]"
                        >
                          Back to login
                        </button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="mt-7 border-t border-[color:var(--gig-border)] pt-5 text-center text-[14px] text-[color:var(--gig-text-muted)]">
                  Need partner access?{' '}
                  <Link to="/partner/onboarding" className="font-semibold text-[color:var(--gig-green-deep)]">
                    Sign up as a partner
                  </Link>
                </div>
              </section>
            </MotionReveal>
          </div>
        </div>
      </main>
    </div>
  );
}
