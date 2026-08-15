'use client';

/**
 * The booking flow — pick a day, pick a time, leave your details.
 * Brand system: Meganté display, Inter body, Courier Prime kickers,
 * cool canvas + olive (DECISIONS #014).
 */
import { useEffect, useMemo, useState } from 'react';

type EventType = {
  slug: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  location_kind: string;
  price_cents: number;
  currency: string;
};

type Props = { eventType: EventType; ownerTimezone: string };

function guestTz() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

export default function BookingFlow({ eventType, ownerTimezone }: Props) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ starts_at: string; note: string | null } | null>(null);

  const tz = useMemo(guestTz, []);
  const showsOtherTz = tz !== ownerTimezone;

  useEffect(() => {
    let live = true;
    fetch(`/api/book/${eventType.slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (!live) return;
        setSlots(d.slots || []);
      })
      .catch(() => live && setSlots([]));
    return () => {
      live = false;
    };
  }, [eventType.slug]);

  const byDay = useMemo(() => {
    const map = new Map<string, string[]>();
    (slots || []).forEach((s) => {
      const key = new Date(s).toLocaleDateString('en-CA', { timeZone: tz });
      map.set(key, [...(map.get(key) || []), s]);
    });
    return map;
  }, [slots, tz]);

  const days = useMemo(() => Array.from(byDay.keys()).sort(), [byDay]);

  useEffect(() => {
    if (!day && days.length) setDay(days[0]);
  }, [days, day]);

  const fmtDay = (key: string) =>
    new Date(`${key}T12:00:00`).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

  const fmtTime = (iso: string, zone: string) =>
    new Date(iso).toLocaleTimeString('en-GB', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
    });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!chosen) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/book/${eventType.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          starts_at: chosen,
          name,
          email,
          notes,
          timezone: tz,
          recording_consent: consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setDone({ starts_at: data.starts_at, note: data.confirmation_note });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      // A 409 means the slot went — refresh so they see the truth.
      fetch(`/api/book/${eventType.slug}`)
        .then((r) => r.json())
        .then((d) => setSlots(d.slots || []));
      setChosen(null);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="border-t-2 border-[color:var(--ink)] pt-10">
        <p className="kicker text-[color:var(--olive-deep)]">Booked</p>
        <h2 className="display mt-4 text-[2rem] leading-[1.1] md:text-[2.6rem]">
          You&rsquo;re in the diary.
        </h2>
        <p className="mt-5 text-[1.05rem] leading-[1.7]">
          {fmtDay(new Date(done.starts_at).toLocaleDateString('en-CA', { timeZone: tz }))} at{' '}
          {fmtTime(done.starts_at, tz)}
          {showsOtherTz && (
            <span className="text-[color:var(--taupe)]">
              {' '}
              ({fmtTime(done.starts_at, ownerTimezone)} my time)
            </span>
          )}
          .
        </p>
        {done.note && (
          <p className="mt-4 max-w-[34em] text-[1.02rem] leading-[1.7] text-[color:var(--taupe)]">
            {done.note}
          </p>
        )}
        <p className="mt-6 max-w-[34em] text-[1.02rem] leading-[1.7]">
          A confirmation is on its way, and the link to where we&rsquo;ll meet follows closer
          to the time.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border-t-2 border-[color:var(--ink)] pt-10">
      {slots === null && <p className="text-[color:var(--taupe)]">Finding openings…</p>}

      {slots !== null && days.length === 0 && (
        <div>
          <p className="display text-[1.5rem]">Nothing open right now.</p>
          <p className="mt-3 max-w-[32em] text-[1.02rem] leading-[1.7] text-[color:var(--taupe)]">
            These are deliberately limited. Email{' '}
            <a className="underline" href="mailto:hello@mariaines.co">
              hello@mariaines.co
            </a>{' '}
            and we&rsquo;ll find a time.
          </p>
        </div>
      )}

      {days.length > 0 && (
        <>
          <p className="kicker text-[color:var(--olive-deep)]">Pick a day</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {days.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDay(d);
                  setChosen(null);
                }}
                className={`border px-4 py-2.5 text-[0.95rem] transition-colors ${
                  day === d
                    ? 'border-[color:var(--ink)] bg-[color:var(--ink)] text-[color:var(--canvas)]'
                    : 'border-[color:var(--stone-deep)] hover:border-[color:var(--ink)]'
                }`}
              >
                {fmtDay(d)}
              </button>
            ))}
          </div>

          <p className="kicker mt-10 text-[color:var(--olive-deep)]">Pick a time</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(byDay.get(day || '') || []).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setChosen(s)}
                className={`border px-5 py-2.5 text-[0.95rem] tabular-nums transition-colors ${
                  chosen === s
                    ? 'border-[color:var(--olive)] bg-[color:var(--olive)] text-[color:var(--canvas)]'
                    : 'border-[color:var(--stone-deep)] hover:border-[color:var(--olive)]'
                }`}
              >
                {fmtTime(s, tz)}
              </button>
            ))}
          </div>
          {showsOtherTz && (
            <p className="mt-3 text-[0.85rem] text-[color:var(--taupe)]">
              Times shown in your timezone ({tz}).
            </p>
          )}

          {chosen && (
            <div className="mt-12 max-w-[34em] space-y-5">
              <div>
                <label className="kicker block text-[color:var(--olive-deep)]" htmlFor="bk-name">
                  Your name
                </label>
                <input
                  id="bk-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full border border-[color:var(--stone-deep)] bg-transparent px-4 py-3 text-[1.02rem] focus:border-[color:var(--olive)] focus:outline-none"
                />
              </div>
              <div>
                <label className="kicker block text-[color:var(--olive-deep)]" htmlFor="bk-email">
                  Email
                </label>
                <input
                  id="bk-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border border-[color:var(--stone-deep)] bg-transparent px-4 py-3 text-[1.02rem] focus:border-[color:var(--olive)] focus:outline-none"
                />
              </div>
              <div>
                <label className="kicker block text-[color:var(--olive-deep)]" htmlFor="bk-notes">
                  What do you want to get out of this?
                </label>
                <textarea
                  id="bk-notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Be as specific as you can. The vague version wastes both our time."
                  className="mt-2 w-full border border-[color:var(--stone-deep)] bg-transparent px-4 py-3 text-[1.02rem] leading-[1.6] placeholder:text-[color:var(--taupe)] focus:border-[color:var(--olive)] focus:outline-none"
                />
              </div>

              <label className="flex items-start gap-3 text-[0.92rem] leading-[1.6] text-[color:var(--taupe)]">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 accent-[color:var(--olive)]"
                />
                <span>
                  I understand the call is recorded, and that I&rsquo;ll receive an
                  AI-drafted summary of it afterwards.
                </span>
              </label>

              {error && <p className="text-[0.95rem] text-[color:var(--color-error)]">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="kicker mt-2 bg-[color:var(--olive)] px-8 py-4 text-[color:var(--canvas)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? 'Holding your time…' : 'Confirm this time'}
              </button>
            </div>
          )}
        </>
      )}
    </form>
  );
}
