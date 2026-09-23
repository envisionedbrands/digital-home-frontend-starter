import type { Metadata } from "next";
import {
  CURRENT_CHECKOUT_URL,
  FALLBACK_CHECKOUT_URL,
  FOUNDING_SEATS_CAP,
  getFoundingSeatsLeft,
} from "@/lib/campaign/coppola-open-studio";

/**
 * The stable public address for the Coppola Open Studio campaign. Every
 * campaign asset (prep email, DM script, post) links here — never directly
 * to a Lemon Squeezy checkout URL, which is immutable once sent. This page
 * is what actually switches when the founding ten sell out.
 *
 * Deliberately not dated or numbered (Priya, 2026-09-23): this URL is meant
 * to outlive one cohort, not just one checkout link.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.envisioned.me";

export const metadata: Metadata = {
  title: "Open Studio · Envisioned",
  // TODO(Lalie): real description once the offer copy is written.
  description: "Bring a recording you never published. Leave with your video editor hired, installed, and already working on it.",
  alternates: { canonical: `${SITE_URL}/open-studio` },
};

export default async function OpenStudioPage() {
  const seats = await getFoundingSeatsLeft();
  const soldOut = seats.known && seats.seatsLeft <= 0;
  const checkoutUrl = soldOut ? FALLBACK_CHECKOUT_URL : CURRENT_CHECKOUT_URL;

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-ink">
      {/* TODO(Lalie): hero — the hire framing, "a real first job", the
          second-bill pain. Spec is in PLANS/COPPOLA_OPEN_STUDIO_OFFER_BRIEF.md */}
      <h1 className="font-serif text-4xl">Open Studio</h1>

      <p className="mt-6 text-lg">
        {/* TODO(Lalie): promise line, e.g. "Bring thirty seconds of footage.
            Leave with your video editor hired, installed, and already
            working on it." */}
      </p>

      <FoundingSeatsNotice seats={seats} />

      {/* TODO(Lalie): the session, the seven days, "started or finished" as
          the honest ceiling, machine requirements (macOS, disk space for the
          speech model) stated as limits, not buried in the product description. */}

      <a
        href={checkoutUrl}
        className="mt-10 inline-block rounded-md bg-ink px-8 py-4 text-canvas"
      >
        {soldOut ? "Reserve your seat — €497" : "Reserve your founding seat — €297"}
      </a>

      {/* TODO: prep-page link for what happens after purchase — see the
          post-purchase prep page (Buzz install video, 30-second recording,
          Drive checklist) once it exists. */}
    </main>
  );
}

/**
 * Priya's spec, 2026-09-23: a live counter on day one just advertises that
 * nobody has bought yet. Cap is always stated as a fact; the live number
 * only appears once it's doing real work (≤5 left), and flips to the
 * eleventh-person message at 0 — never "sold out", never implying the
 * session itself is unavailable.
 */
function FoundingSeatsNotice({
  seats,
}: {
  seats: Awaited<ReturnType<typeof getFoundingSeatsLeft>>;
}) {
  if (!seats.known) {
    return (
      <p className="mt-4 text-sm text-ink-soft">
        The founding price is capped at {FOUNDING_SEATS_CAP}.
      </p>
    );
  }

  if (seats.seatsLeft <= 0) {
    return (
      <p className="mt-4 text-sm text-ink-soft">
        {/* TODO(Lalie): eleventh-person copy. Must read as: same room, same
            session, same seven days, same guarantee — the only difference is
            that ten people moved first and paid less. No "sold out", no
            "unfortunately", no "next time". */}
      </p>
    );
  }

  if (seats.seatsLeft <= 5) {
    return (
      <p className="mt-4 text-sm text-ink-soft">
        {seats.seatsLeft} of {FOUNDING_SEATS_CAP} founding seats left.
      </p>
    );
  }

  return (
    <p className="mt-4 text-sm text-ink-soft">
      The founding price is capped at {FOUNDING_SEATS_CAP}.
    </p>
  );
}
