'use client';

/**
 * The booking flow — summary card, month calendar, times, details.
 *
 * The month-grid picker is deliberately native (MI 2026-08-15 asked whether
 * this needed Cal.com — it doesn't; a date picker is a date picker, and
 * building it keeps the booking data, the CRM link and the brand ours).
 * Brand system: Meganté display, Inter body, Courier Prime kickers, cool
 * canvas + olive (DECISIONS #014).
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

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TZ_CHOICES = [
  'Europe/Amsterdam',
  'Europe/London',
  'Europe/Lisbon',
  'Europe/Paris',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Asia/Dubai',
  'Asia/Singapore',
  'Australia/Sydney',
];

function detectTz() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Europe/Amsterdam';
  }
}

function offsetLabel(tz: string) {
  try {
    const s = new Intl.DateTimeFormat('en-GB', { timeZone: tz, timeZoneName: 'shortOffset' })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value;
    return s || '';
  } catch {
    return '';
  }
}

/** yyyy-mm-dd for an instant, as seen in a timezone. */
function dayKeyIn(iso: string, tz: string) {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: tz });
}

export default function BookingFlow({ eventType, ownerTimezone }: Props) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [tz, setTz] = useState<string>(ownerTimezone);
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ starts_at: string; note: string | null } | null>(null);

  useEffect(() => setTz(detectTz()), []);

  useEffect(() => {
    let live = true;
    fetch(`/api/book/${eventType.slug}?days=60`)
      .then((r) => r.json())
      .then((d) => live && setSlots(d.slots || []))
      .catch(() => live && setSlots([]));
    return () => {
      live = false;
    };
  }, [eventType.slug]);

  const byDay = useMemo(() => {
    const map = new Map<string, string[]>();
    (slots || []).forEach((s) => {
      const k = dayKeyIn(s, tz);
      map.set(k, [...(map.get(k) || []), s]);
    });
    return map;
  }, [slots, tz]);

  // Open on the month holding the first real opening.
  useEffect(() => {
    if (cursor || !slots?.length) return;
    const first = dayKeyIn(slots[0], tz);
    const [y, m] = first.split('-').map(Number);
    setCursor({ y, m });
  }, [slots, tz, cursor]);

  const grid = useMemo(() => {
    if (!cursor) return [];
    const first = new Date(Date.UTC(cursor.y, cursor.m - 1, 1));
    const lead = (first.getUTCDay() + 6) % 7; // Monday-first
    const total = new Date(Date.UTC(cursor.y, cursor.m, 0)).getUTCDate();
    const cells: (string | null)[] = Array(lead).fill(null);
    for (let d = 1; d <= total; d++) {
      cells.push(
        `${cursor.y}-${String(cursor.m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      );
    }
    while (cells.length % 7) cells.push(null);
    return cells;
  }, [cursor]);

  const monthLabel = cursor
    ? new Date(Date.UTC(cursor.y, cursor.m - 1, 1)).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : '';

  const shiftMonth = (delta: number) => {
    if (!cursor) return;
    const d = new Date(Date.UTC(cursor.y, cursor.m - 1 + delta, 1));
    setCursor({ y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 });
  };

  const fmtTime = (iso: string, zone: string) =>
    new Date(iso).toLocaleTimeString('en-GB', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
    });

  const fmtDayLong = (key: string) =>
    new Date(`${key}T12:00:00Z`).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
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
      fetch(`/api/book/${eventType.slug}?days=60`)
        .then((r) => r.json())
        .then((d) => setSlots(d.slots || []));
      setChosen(null);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="border border-[color:var(--stone-deep)] p-8 md:p-10">
        <p className="kicker text-[color:var(--olive-deep)]">Booked</p>
        <h2 className="display mt-4 text-[2rem] leading-[1.1] md:text-[2.5rem]">
          You&rsquo;re in the diary.
        </h2>
        <p className="mt-5 text-[1.05rem] leading-[1.7]">
          {fmtDayLong(dayKeyIn(done.starts_at, tz))} at {fmtTime(done.starts_at, tz)}
          {tz !== ownerTimezone && (
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

  const dayTimes = day ? byDay.get(day) || [] : [];

  return (
    <form onSubmit={submit}>
      {/* Summary card */}
      <div className="border border-[color:var(--stone-deep)] p-6 md:p-7">
        <ul className="space-y-3 text-[0.98rem]">
          <li className="flex items-center gap-3">
            <span className="kicker w-24 shrink-0 text-[color:var(--taupe)]">Length</span>
            <span>{eventType.duration_minutes} min</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="kicker w-24 shrink-0 text-[color:var(--taupe)]">Date</span>
            <span>{day ? fmtDayLong(day) : <span className="text-[color:var(--taupe)]">Pick a day below</span>}</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="kicker w-24 shrink-0 text-[color:var(--taupe)]">Zone</span>
            <span>
              {tz} ({offsetLabel(tz)})
            </span>
          </li>
        </ul>
        {eventType.description && (
          <p className="mt-5 border-t border-[color:var(--hair)] pt-4 text-[0.98rem] leading-[1.65] text-[color:var(--taupe)]">
            {eventType.description}
          </p>
        )}
      </div>

      {slots === null && (
        <p className="mt-8 text-[color:var(--taupe)]">Finding openings…</p>
      )}

      {slots !== null && slots.length === 0 && (
        <div className="mt-8">
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

      {/* Month calendar */}
      {cursor && (slots?.length ?? 0) > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
              className="flex h-10 w-10 items-center justify-center border border-transparent text-[color:var(--taupe)] transition-colors hover:border-[color:var(--stone-deep)] hover:text-[color:var(--ink)]"
            >
              ‹
            </button>
            <p className="display text-[1.4rem]">{monthLabel}</p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--stone-deep)] transition-colors hover:border-[color:var(--ink)]"
            >
              ›
            </button>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((w) => (
              <div key={w} className="kicker pb-3 text-[color:var(--taupe)]">
                {w}
              </div>
            ))}

            {grid.map((key, i) => {
              if (!key) return <div key={`x${i}`} />;
              const has = (byDay.get(key) || []).length > 0;
              const selected = day === key;
              const dayNum = Number(key.slice(-2));
              return (
                <div key={key} className="flex justify-center py-1">
                  <button
                    type="button"
                    disabled={!has}
                    onClick={() => {
                      setDay(key);
                      setChosen(null);
                    }}
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full text-[0.98rem] tabular-nums transition-colors ${
                      selected
                        ? 'bg-[color:var(--ink)] text-[color:var(--canvas)]'
                        : has
                          ? 'text-[color:var(--ink)] hover:bg-[color:var(--stone)]'
                          : 'cursor-default text-[color:var(--ink)]/25'
                    }`}
                  >
                    {dayNum}
                    {has && !selected && (
                      <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[color:var(--olive)]" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Times */}
      {day && dayTimes.length > 0 && (
        <div className="mt-10">
          <p className="kicker text-[color:var(--olive-deep)]">Pick a time</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {dayTimes.map((s) => (
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
        </div>
      )}

      {/* Timezone */}
      {(slots?.length ?? 0) > 0 && (
        <div className="mt-10 border-t border-[color:var(--hair)] pt-5">
          <label className="kicker block text-[color:var(--taupe)]" htmlFor="bk-tz">
            Time zone
          </label>
          <select
            id="bk-tz"
            value={tz}
            onChange={(e) => {
              setTz(e.target.value);
              setDay(null);
              setChosen(null);
            }}
            className="mt-2 w-full max-w-[26em] border border-[color:var(--stone-deep)] bg-transparent px-4 py-3 text-[0.98rem] focus:border-[color:var(--olive)] focus:outline-none"
          >
            {Array.from(new Set([tz, ...TZ_CHOICES])).map((z) => (
              <option key={z} value={z}>
                {z} ({offsetLabel(z)})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Details */}
      {chosen && (
        <div className="mt-12 max-w-[34em] space-y-5 border-t-2 border-[color:var(--ink)] pt-8">
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
              I understand the call is recorded, and that I&rsquo;ll receive an AI-drafted
              summary of it afterwards.
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
    </form>
  );
}
