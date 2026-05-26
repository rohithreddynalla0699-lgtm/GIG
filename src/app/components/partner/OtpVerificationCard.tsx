import { useState } from 'react';

interface OtpVerificationCardProps {
  expectedCode: string;
  canCollect: boolean;
  onCollected: () => void;
}

export default function OtpVerificationCard({ expectedCode, canCollect, onCollected }: OtpVerificationCardProps) {
  const [enteredCode, setEnteredCode] = useState('');
  const [verificationState, setVerificationState] = useState<'idle' | 'success' | 'error'>('idle');

  const verifyCode = () => {
    if (enteredCode.trim() === expectedCode) {
      setVerificationState('success');
      return;
    }
    setVerificationState('error');
  };

  return (
    <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/76 p-4">
      <div className="mb-3">
        <div className="eyebrow mb-1">Code check</div>
        <h2 className="text-[17px] font-semibold tracking-[-0.03em] text-[color:var(--gig-text)]">Verify pickup code</h2>
        <p className="mt-1 text-[13px] leading-6 text-[color:var(--gig-text-muted)]">
          Ask the customer for the 4-digit code before handover.
        </p>
      </div>

      <div className="mb-3 rounded-[16px] bg-[rgba(32,38,28,0.04)] p-4">
        <div className="meta-text mb-2">Expected code</div>
        <div className="text-[28px] font-semibold leading-none tracking-[0.18em] text-[color:var(--gig-text)]">{expectedCode}</div>
      </div>

      <div className="mb-3 flex flex-col gap-2.5 sm:flex-row">
        <input
          value={enteredCode}
          onChange={(event) => setEnteredCode(event.target.value)}
          inputMode="numeric"
          maxLength={4}
          placeholder="Enter 4-digit code"
          className="w-full rounded-[16px] border border-[color:var(--gig-border)] bg-white px-4 py-3 text-[18px] tracking-[0.24em] text-[color:var(--gig-text)] outline-none transition-colors placeholder:text-[color:var(--gig-text-soft)] focus:border-[color:var(--gig-green)]"
        />
        <button type="button" onClick={verifyCode} className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c] whitespace-nowrap">
          Verify code
        </button>
      </div>

      {verificationState === 'success' && (
        <div className="mb-3 rounded-[16px] border border-[rgba(11,122,77,0.16)] bg-[rgba(11,122,77,0.06)] px-4 py-3">
          <div className="mb-1 text-[13px] font-semibold text-[color:var(--gig-green-deep)]">Code verified</div>
          <div className="text-[13px] leading-6 text-[color:var(--gig-text-muted)]">
            The code matches. You can mark this order as collected.
          </div>
        </div>
      )}

      {verificationState === 'error' && (
        <div className="mb-3 rounded-[16px] border border-[rgba(192,90,43,0.16)] bg-[rgba(192,90,43,0.08)] px-4 py-3">
          <div className="mb-1 text-[13px] font-semibold text-[#A6572E]">Code mismatch</div>
          <div className="text-[13px] leading-6 text-[color:var(--gig-text-muted)]">
            This code does not match the order. Recheck before proceeding.
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onCollected}
          disabled={!canCollect || verificationState !== 'success'}
          className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mark collected
        </button>
      </div>
    </div>
  );
}
