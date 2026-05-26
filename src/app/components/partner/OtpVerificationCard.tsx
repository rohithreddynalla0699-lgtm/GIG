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
    <div className="rounded-[24px] bg-[rgba(32,38,28,0.04)] p-5 md:p-6">
      <div className="mb-4">
        <div className="eyebrow mb-2">Pickup verification</div>
        <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">Confirm the code before handover.</h2>
        <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
          Ask the customer for the 4-digit code shown in the app before completing the pickup.
        </p>
      </div>

      <div className="mb-4 rounded-[24px] bg-[rgba(32,38,28,0.04)] p-5">
        <div className="meta-text mb-2">Expected code</div>
        <div className="text-[34px] font-semibold leading-none tracking-[0.18em] text-[color:var(--gig-text)]">{expectedCode}</div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={enteredCode}
          onChange={(event) => setEnteredCode(event.target.value)}
          inputMode="numeric"
          maxLength={4}
          placeholder="Enter 4-digit code"
          className="w-full rounded-[18px] border border-[color:var(--gig-border)] bg-white px-5 py-[14px] text-[20px] tracking-[0.24em] text-[color:var(--gig-text)] outline-none transition-colors placeholder:text-[color:var(--gig-text-soft)] focus:border-[color:var(--gig-green)]"
        />
        <button type="button" onClick={verifyCode} className="btn-primary justify-center whitespace-nowrap">
          Verify code
        </button>
      </div>

      {verificationState === 'success' && (
        <div className="mb-4 rounded-[20px] border border-[rgba(11,122,77,0.16)] bg-[rgba(11,122,77,0.06)] p-4">
          <div className="mb-1 text-[14px] font-semibold text-[color:var(--gig-green-deep)]">Code verified</div>
          <div className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
            The code matches this order. You can now mark the pickup as collected.
          </div>
        </div>
      )}

      {verificationState === 'error' && (
        <div className="mb-4 rounded-[20px] border border-[rgba(192,90,43,0.16)] bg-[rgba(192,90,43,0.08)] p-4">
          <div className="mb-1 text-[14px] font-semibold text-[#A6572E]">Code mismatch</div>
          <div className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
            This code does not match the order. Recheck the customer and app screen before proceeding.
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onCollected}
          disabled={!canCollect || verificationState !== 'success'}
          className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mark collected
        </button>
      </div>
    </div>
  );
}
