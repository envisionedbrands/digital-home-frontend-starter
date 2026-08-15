import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEventType, getOwnerTimezone } from '@/lib/booking/query';
import BookingFlow from './BookingFlow';

/**
 * /book/:slug — the public booking page. Native (no GHL, no Cal.com).
 *
 * Private-link event types (is_public = false) are reachable by anyone with
 * the URL but are noindex'd and never listed — that's how the catch-all stays
 * scarce without being secret.
 */

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const et = await getEventType(slug);
  if (!et) return { title: 'Not found' };
  return {
    title: `${et.name} — Envisioned`,
    description: et.description || undefined,
    robots: et.is_public ? undefined : { index: false, follow: false },
  };
}

function priceLabel(cents: number, currency: string) {
  if (!cents) return null;
  return `${currency} ${(cents / 100).toLocaleString('en-GB')}`;
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const eventType = await getEventType(slug);
  if (!eventType) notFound();

  const ownerTimezone = await getOwnerTimezone();
  const price = priceLabel(eventType.price_cents, eventType.currency);
  const isAsync = eventType.location_kind === 'async';

  return (
    <main className="min-h-screen bg-[color:var(--canvas)] px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1100px] gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <header className="lg:pr-10">
          <p className="kicker text-[color:var(--olive-deep)]">
            {isAsync ? 'Delivery window' : 'Book a time'}
          </p>
          <h1 className="display mt-5 text-[2.4rem] leading-[1.06] md:text-[3.1rem]">
            {eventType.name}
          </h1>

          {eventType.description && (
            <p className="mt-6 max-w-[32em] text-[1.08rem] leading-[1.75]">
              {eventType.description}
            </p>
          )}

          <dl className="mt-10 border-t border-[color:var(--hair)] text-[0.95rem]">
            <div className="flex justify-between border-b border-[color:var(--hair)] py-3">
              <dt className="text-[color:var(--taupe)]">Length</dt>
              <dd>{eventType.duration_minutes} minutes</dd>
            </div>
            <div className="flex justify-between border-b border-[color:var(--hair)] py-3">
              <dt className="text-[color:var(--taupe)]">Where</dt>
              <dd>{isAsync ? 'No call — I work on it' : 'Video call'}</dd>
            </div>
            {price && (
              <div className="flex justify-between border-b border-[color:var(--hair)] py-3">
                <dt className="text-[color:var(--taupe)]">Investment</dt>
                <dd>{price}</dd>
              </div>
            )}
          </dl>

          {isAsync && (
            <p className="mt-8 max-w-[30em] text-[0.98rem] leading-[1.7] text-[color:var(--taupe)]">
              You&rsquo;re booking the block of time I spend inside your business — not a
              meeting. Nothing to attend. The work lands by the end of it.
            </p>
          )}
        </header>

        <BookingFlow
          eventType={{
            slug: eventType.slug,
            name: eventType.name,
            description: eventType.description,
            duration_minutes: eventType.duration_minutes,
            location_kind: eventType.location_kind,
            price_cents: eventType.price_cents,
            currency: eventType.currency,
          }}
          ownerTimezone={ownerTimezone}
        />
      </div>
    </main>
  );
}
