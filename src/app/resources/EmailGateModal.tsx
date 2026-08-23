'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';

interface EmailGateModalProps {
  open: boolean;
  onClose: () => void;
  resourceTitle: string;
  downloadUrl: string;
}

export default function EmailGateModal({
  open,
  onClose,
  resourceTitle,
  downloadUrl,
}: EmailGateModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [aiLevel, setAiLevel] = useState('');
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setStatus('idle');
      setName('');
      setEmail('');
      setAiLevel('');
      setConsent(true);
      setErrorMsg('');
      // Small delay so the DOM is painted
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: name.trim() || undefined,
          email: email.trim().toLowerCase(),
          source: 'resources-page',
          capture_page: '/resources',
          tags: [
            'resource-download',
            'call-intel-freebie',
            ...(aiLevel ? [`ai-level-${aiLevel}`] : []),
          ],
          custom: {
            ...(aiLevel ? { ai_level: aiLevel } : {}),
            consent_email: consent,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Try again.');
      }

      setStatus('success');

      // Trigger download after a brief pause so the user sees the success state
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 600);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Get ${resourceTitle}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(30, 30, 30, 0.55)' }}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-[440px] bg-canvas border border-hair p-8 sm:p-10"
        style={{ animation: 'modalIn 200ms ease-out' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-taupe hover:text-ink transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {status === 'success' ? (
          /* ── Success state ── */
          <div className="text-center py-4">
            <div className="flex items-center justify-center mb-5">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="19" stroke="var(--olive)" strokeWidth="1.5" />
                <path
                  d="M13 20.5l4.5 4.5 9.5-9.5"
                  stroke="var(--olive)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="display text-2xl text-ink mb-3">It&rsquo;s yours.</p>
            <p className="text-[0.95rem] text-taupe leading-relaxed">
              Your download should start automatically.
              <br />
              If it doesn&rsquo;t,{' '}
              <a
                href={downloadUrl}
                download
                className="text-olive underline underline-offset-2 hover:text-olive-deep"
              >
                click here
              </a>
              .
            </p>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <p className="kicker mb-4">Free resource</p>
            <h2 className="display text-2xl sm:text-3xl text-ink mb-3">
              {resourceTitle}
            </h2>
            <p className="text-[0.95rem] text-taupe leading-relaxed mb-7">
              Drop your email and the file is yours. No sequence, no pitch deck.
              Just the tool.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="gate-name" className="sr-only">First name</label>
                <input
                  ref={inputRef}
                  id="gate-name"
                  type="text"
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === 'submitting'}
                  className="w-full border border-hair-olive bg-canvas-soft px-4 py-3.5 text-[0.95rem] text-ink placeholder:text-taupe/60 focus:outline-none focus:border-olive transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="gate-email" className="sr-only">Email address</label>
                <input
                  id="gate-email"
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'submitting'}
                  className="w-full border border-hair-olive bg-canvas-soft px-4 py-3.5 text-[0.95rem] text-ink placeholder:text-taupe/60 focus:outline-none focus:border-olive transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <p className="text-[0.8rem] text-taupe mb-2">Where are you with AI?</p>
                <div className="flex gap-2">
                  {[
                    { value: '1', label: 'Getting started' },
                    { value: '2', label: 'Using Cowork' },
                    { value: '3', label: 'In the Code' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAiLevel(aiLevel === opt.value ? '' : opt.value)}
                      className={`flex-1 px-3 py-2.5 text-[0.8rem] border transition-colors ${
                        aiLevel === opt.value
                          ? 'border-olive bg-olive/10 text-ink'
                          : 'border-hair-olive text-taupe hover:border-olive/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 accent-[var(--olive)]"
                />
                <span className="text-[0.8rem] text-taupe leading-relaxed">
                  I&rsquo;m happy to receive emails from Envisioned | Maria-In&eacute;s. Unsubscribe anytime.
                </span>
              </label>

              {status === 'error' && errorMsg && (
                <p className="text-[0.85rem] text-[var(--color-error)]">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting' || !consent}
                className="w-full bg-olive text-canvas px-6 py-3.5 text-[0.95rem] font-medium hover:bg-olive-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending...' : 'Send me the file'}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Inline keyframe — scoped to this component */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
