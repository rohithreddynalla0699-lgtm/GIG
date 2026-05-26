import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import MotionReveal from '../components/shared/MotionReveal';
import AuthBrandHeader from '../components/shared/AuthBrandHeader';
import { initializeMockPartnerProfileFromSignup, setMockPartnerSession } from '../data/mock/partners';

const phoneDigits = (value: string) => value.replace(/\D/g, '');
const namePattern = /^[A-Za-z][A-Za-z .'-]*$/;
const businessNamePattern = /^[A-Za-z0-9][A-Za-z0-9 .,&'()-]*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const businessTypes = [
  'Restaurant',
  'Cafe',
  'Bakery',
  'Grocery',
  'Cloud kitchen',
  'Other',
] as const;

const legalSnippets = {
  terms: {
    title: 'Terms & Conditions',
    body: 'Frontend placeholder: partners agree to use GIG responsibly, provide accurate business information, and follow marketplace rules while verification and activation are pending.',
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'Frontend placeholder: GIG may use partner account, outlet, and compliance details to review onboarding, manage verification, and operate the partner workspace.',
  },
  agreement: {
    title: 'Partner Agreement',
    body: 'Frontend placeholder: partner activation, pricing, content review, and listing responsibilities are finalized after verification and before live selling begins.',
  },
} as const;

function normalizeEmail(value: string) {
  return value.replace(/\s+/g, '').toLowerCase().slice(0, 254);
}

function normalizePhone(value: string) {
  return phoneDigits(value).slice(0, 10);
}

function normalizeName(value: string) {
  return value.replace(/\s{2,}/g, ' ').slice(0, 60);
}

function normalizeBusinessName(value: string) {
  return value.replace(/\s{2,}/g, ' ').slice(0, 80);
}

function validateBusinessName(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 'Business / outlet name is required.';
  if (trimmed.length < 2) return 'Business / outlet name must be at least 2 characters.';
  if (trimmed.length > 80) return 'Business / outlet name must be 80 characters or fewer.';
  if (!businessNamePattern.test(trimmed)) return 'Use letters, numbers, spaces, and basic punctuation only.';
  return '';
}

function validateRequiredChoice(value: string, label: string) {
  if (!value) return `${label} is required.`;
  return '';
}

function validateContactName(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 'Contact person is required.';
  if (trimmed.length < 2) return 'Contact person must be at least 2 characters.';
  if (trimmed.length > 60) return 'Contact person must be 60 characters or fewer.';
  if (!namePattern.test(trimmed)) return 'Use letters, spaces, hyphens, apostrophes, or periods only.';
  return '';
}

function validateEmail(value: string) {
  if (!value) return 'Business email is required.';
  if (value.length > 254) return 'Business email must be 254 characters or fewer.';
  if (!emailPattern.test(value)) return 'Enter a valid business email address.';
  return '';
}

function validatePhone(value: string) {
  if (!value) return 'Phone number is required.';
  if (value.length !== 10) return 'Phone number must be exactly 10 digits.';
  if (!/^[6-9]/.test(value)) return 'Phone number must start with 6, 7, 8, or 9.';
  return '';
}

function validatePassword(value: string) {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (value.length > 72) return 'Password must be 72 characters or fewer.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Password must include at least 1 letter and 1 number.';
  return '';
}

function validateConfirmPassword(password: string, confirmPassword: string) {
  if (!confirmPassword) return 'Confirm password is required.';
  if (confirmPassword !== password) return 'Passwords must match.';
  return '';
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="operational-label mb-2 block">
      {children}
      {required ? <span aria-hidden="true" className="ml-1 text-[color:var(--gig-text-soft)]">*</span> : null}
    </span>
  );
}

export default function BusinessSignup() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [contactName, setContactName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [openLegalDoc, setOpenLegalDoc] = useState<keyof typeof legalSnippets | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const normalizedBusinessName = normalizeBusinessName(businessName);
  const normalizedContactName = normalizeName(contactName);
  const normalizedBusinessEmail = normalizeEmail(businessEmail);
  const normalizedPhone = normalizePhone(phone);

  const errors = {
    businessName: validateBusinessName(normalizedBusinessName),
    businessType: validateRequiredChoice(businessType, 'Business type'),
    contactName: validateContactName(normalizedContactName),
    businessEmail: validateEmail(normalizedBusinessEmail),
    phone: validatePhone(normalizedPhone),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
    acceptedTerms: acceptedTerms ? '' : 'Agreement to the legal terms is required.',
  };

  const isFormValid = Object.values(errors).every((error) => error === '');

  const fieldErrorClass = (hasError: boolean) =>
    hasError
      ? 'border-[rgba(166,94,94,0.32)] focus:border-[rgba(166,94,94,0.38)] focus:shadow-[0_0_0_3px_rgba(166,94,94,0.08)]'
      : '';

  const shellErrorClass = (hasError: boolean) =>
    hasError ? 'border-[rgba(166,94,94,0.32)] shadow-[0_0_0_3px_rgba(166,94,94,0.08)]' : '';

  const showError = (field: keyof typeof errors) => touched[field] || submitted;

  const markTouched = (field: keyof typeof errors) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!isFormValid) return;

    setMockPartnerSession();
    initializeMockPartnerProfileFromSignup({
      businessName: normalizedBusinessName,
      businessType,
      contactName: normalizedContactName,
      businessEmail: normalizedBusinessEmail,
      phone: normalizedPhone,
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateRegion: '',
      pinCode: '',
      country: 'India',
      acceptedTerms,
      acknowledgedFoodSafety: false,
      acknowledgedResponsibility: false,
      acknowledgedLicensing: false,
      acknowledgedPricing: false,
    });
    navigate('/partner/profile', { replace: true });
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
            <AuthBrandHeader note="Partner onboarding" />
          </MotionReveal>

          <div className="mx-auto max-w-[880px]">
            <MotionReveal y={22}>
              <section className="auth-form-card rounded-[30px] p-5 transition-shadow duration-[var(--gig-motion-slow)] hover:shadow-[var(--gig-shadow-lg)] md:p-7">
                <div className="mb-7 text-center">
                  <div className="eyebrow mb-3">Partner account</div>
                  <h1 className="font-['Fraunces',serif] text-[clamp(1.95rem,4.2vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[color:var(--gig-text)]">
                    Create your partner account
                  </h1>
                  <p className="mx-auto mt-3 max-w-[38rem] text-[15px] leading-[1.72] text-[color:var(--gig-text-muted)]">
                    Start with your account. Verification, licenses, and payment setup happen next.
                  </p>
                </div>

                <div className="grid gap-7">
                  <section>
                    <div className="mb-4">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">
                        Business account
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <label>
                          <FieldLabel required>Business / outlet name</FieldLabel>
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(event) => setBusinessName(normalizeBusinessName(event.target.value))}
                          onBlur={() => markTouched('businessName')}
                          placeholder="e.g., Sunrise Bakery"
                          aria-invalid={showError('businessName') && Boolean(errors.businessName)}
                          aria-describedby={showError('businessName') && errors.businessName ? 'business-name-error' : undefined}
                          className={`auth-input ${fieldErrorClass(showError('businessName') && Boolean(errors.businessName))}`}
                        />
                        {showError('businessName') && errors.businessName ? (
                          <div id="business-name-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                            {errors.businessName}
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <label>
                          <FieldLabel required>Business type</FieldLabel>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {businessTypes.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setBusinessType(type)}
                              className={`rounded-[18px] border px-4 py-3 text-left text-[14px] font-semibold transition-all duration-[var(--gig-motion-fast)] ${
                                businessType === type
                                  ? 'border-[rgba(11,122,77,0.14)] bg-[rgba(11,122,77,0.05)] text-[color:var(--gig-green-deep)]'
                                  : 'border-[color:var(--gig-border)] text-[color:var(--gig-text-muted)] hover:border-[rgba(11,122,77,0.12)] hover:bg-[rgba(11,122,77,0.02)]'
                              } ${showError('businessType') && errors.businessType ? 'ring-1 ring-[rgba(166,94,94,0.14)]' : ''}`}
                              aria-pressed={businessType === type}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        {showError('businessType') && errors.businessType ? (
                          <div className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">{errors.businessType}</div>
                        ) : null}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label>
                            <FieldLabel required>Contact person</FieldLabel>
                          </label>
                          <input
                            type="text"
                            value={contactName}
                            onChange={(event) => setContactName(normalizeName(event.target.value))}
                            onBlur={() => markTouched('contactName')}
                            placeholder="Full name"
                            aria-invalid={showError('contactName') && Boolean(errors.contactName)}
                            aria-describedby={showError('contactName') && errors.contactName ? 'contact-name-error' : undefined}
                            className={`auth-input ${fieldErrorClass(showError('contactName') && Boolean(errors.contactName))}`}
                          />
                          {showError('contactName') && errors.contactName ? (
                            <div id="contact-name-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {errors.contactName}
                            </div>
                          ) : null}
                        </div>

                        <div>
                          <label>
                            <FieldLabel required>Business email</FieldLabel>
                          </label>
                          <input
                            type="email"
                            value={businessEmail}
                            onChange={(event) => setBusinessEmail(normalizeEmail(event.target.value))}
                            onBlur={() => markTouched('businessEmail')}
                            placeholder="business@example.com"
                            aria-invalid={showError('businessEmail') && Boolean(errors.businessEmail)}
                            aria-describedby={showError('businessEmail') && errors.businessEmail ? 'business-email-error' : undefined}
                            className={`auth-input ${fieldErrorClass(showError('businessEmail') && Boolean(errors.businessEmail))}`}
                          />
                          {showError('businessEmail') && errors.businessEmail ? (
                            <div id="business-email-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {errors.businessEmail}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <label>
                          <FieldLabel required>Phone number</FieldLabel>
                        </label>
                        <div className={`auth-input-shell ${shellErrorClass(showError('phone') && Boolean(errors.phone))}`}>
                          <span className="flex items-center border-r border-[color:var(--gig-border)] bg-[rgba(32,38,28,0.03)] px-4 text-[14px] font-semibold text-[color:var(--gig-text)]">
                            +91
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(normalizePhone(event.target.value))}
                            onBlur={() => markTouched('phone')}
                            placeholder="98765 43210"
                            className="w-full bg-transparent px-4 py-[14px] text-[15px] outline-none"
                            inputMode="numeric"
                            maxLength={10}
                            aria-label="Phone number"
                            aria-invalid={showError('phone') && Boolean(errors.phone)}
                            aria-describedby={showError('phone') && errors.phone ? 'phone-error' : undefined}
                          />
                        </div>
                        {showError('phone') && errors.phone ? (
                          <div id="phone-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                            {errors.phone}
                          </div>
                        ) : null}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label>
                            <FieldLabel required>Password</FieldLabel>
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value.slice(0, 72))}
                            onBlur={() => markTouched('password')}
                            placeholder="At least 8 characters"
                            aria-invalid={showError('password') && Boolean(errors.password)}
                            aria-describedby={showError('password') && errors.password ? 'password-error' : 'password-help'}
                            className={`auth-input ${fieldErrorClass(showError('password') && Boolean(errors.password))}`}
                          />
                          {showError('password') && errors.password ? (
                            <div id="password-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {errors.password}
                            </div>
                          ) : (
                            <div id="password-help" className="mt-2 text-[13px] text-[color:var(--gig-text-soft)]">
                              Use 8-72 characters with at least 1 letter and 1 number.
                            </div>
                          )}
                        </div>

                        <div>
                          <label>
                            <FieldLabel required>Confirm password</FieldLabel>
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value.slice(0, 72))}
                            onBlur={() => markTouched('confirmPassword')}
                            placeholder="Re-enter your password"
                            aria-invalid={showError('confirmPassword') && Boolean(errors.confirmPassword)}
                            aria-describedby={showError('confirmPassword') && errors.confirmPassword ? 'confirm-password-error' : undefined}
                            className={`auth-input ${fieldErrorClass(showError('confirmPassword') && Boolean(errors.confirmPassword))}`}
                          />
                          {showError('confirmPassword') && errors.confirmPassword ? (
                            <div id="confirm-password-error" className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">
                              {errors.confirmPassword}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="mb-4">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">
                        Legal agreement
                      </div>
                    </div>

                    <div>
                      <label
                        className={`flex gap-3 rounded-[18px] border px-4 py-3.5 transition-colors ${
                          showError('acceptedTerms') && errors.acceptedTerms
                            ? 'border-[rgba(166,94,94,0.28)] bg-[rgba(166,94,94,0.05)]'
                            : 'border-[color:var(--gig-border)] bg-white/70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(event) => setAcceptedTerms(event.target.checked)}
                          onBlur={() => markTouched('acceptedTerms')}
                          className="mt-1 h-4 w-4 rounded border-[color:var(--gig-border)] text-[color:var(--gig-green-deep)] focus:ring-[rgba(11,122,77,0.16)]"
                        />
                        <span className="text-[14px] leading-[1.7] text-[color:var(--gig-text)]">
                          I agree to the Terms & Conditions, Privacy Policy, and Partner Agreement.
                          <span aria-hidden="true" className="ml-1 text-[color:var(--gig-text-soft)]">*</span>
                        </span>
                      </label>
                      {showError('acceptedTerms') && errors.acceptedTerms ? (
                        <div className="mt-2 text-[13px] text-[rgba(143,78,78,0.9)]">{errors.acceptedTerms}</div>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-[14px] font-medium">
                      {(Object.keys(legalSnippets) as (keyof typeof legalSnippets)[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setOpenLegalDoc((current) => (current === key ? null : key))}
                          className="text-[color:var(--gig-green-deep)] underline underline-offset-4 transition hover:text-[#0b7a4d]"
                        >
                          {legalSnippets[key].title}
                        </button>
                      ))}
                    </div>

                    {openLegalDoc ? (
                      <div className="mt-4 rounded-[18px] border border-[rgba(11,122,77,0.12)] bg-[rgba(11,122,77,0.05)] px-4 py-4">
                        <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">
                          {legalSnippets[openLegalDoc].title}
                        </div>
                        <p className="mt-2 text-[14px] leading-7 text-[color:var(--gig-text-muted)]">
                          {legalSnippets[openLegalDoc].body}
                        </p>
                      </div>
                    ) : null}
                  </section>
                </div>

                <div className="mt-7 border-t border-[color:var(--gig-border)] pt-5">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className="btn-primary w-full justify-center transition-transform duration-[var(--gig-motion-fast)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Create partner account
                  </button>

                  <div className="mt-5 text-center text-[14px] text-[color:var(--gig-text-muted)]">
                    Already a partner?{' '}
                    <Link to="/partner/login" className="font-semibold text-[color:var(--gig-green-deep)]">
                      Sign in
                    </Link>
                  </div>
                </div>
              </section>
            </MotionReveal>
          </div>
        </div>
      </main>
    </div>
  );
}
