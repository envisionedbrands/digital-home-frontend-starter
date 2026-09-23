import type { Metadata } from "next";

/**
 * The one prep-page URL required by PLANS/COPPOLA_OPEN_STUDIO_OFFER_BRIEF.md
 * §8: the booking confirmation and the Lemon Squeezy receipt both point here,
 * so a buyer only ever has one place to check before the session. Not linked
 * from /open-studio — reachable only by the two post-purchase messages.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.envisioned.me";

export const metadata: Metadata = {
  title: "Before your session · Open Studio",
  description: "What to do before your Coppola Open Studio session.",
  alternates: { canonical: `${SITE_URL}/open-studio/prep` },
  robots: { index: false, follow: false },
};

export default function OpenStudioPrepPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-ink">
      <h1 className="font-serif text-4xl">Before your session</h1>

      {/* TODO(Lalie): intro line — they're in, this is their homework. Tone
          per §8: every line reduces anxiety about arriving unready. */}
      <p className="mt-6 text-lg" />

      <ol className="mt-10 space-y-8">
        <li>
          <h2 className="font-serif text-2xl">1. Install Buzz</h2>
          {/* TODO: embed or link the install video once it exists (Bob/MI —
              confirmed not to exist yet as of 2026-09-23). Until then, this
              slot carries written install steps instead; §8 does not make
              the video load-bearing, only the instruction. */}
          <p className="mt-2 text-ink-soft">[ install steps or video ]</p>
        </li>
        <li>
          <h2 className="font-serif text-2xl">2. Pull the speech model</h2>
          <p className="mt-2 text-ink-soft">[ download instructions ]</p>
        </li>
        <li>
          <h2 className="font-serif text-2xl">3. Sign in to Google Drive</h2>
          <p className="mt-2 text-ink-soft">[ Drive checklist ]</p>
        </li>
        <li>
          <h2 className="font-serif text-2xl">4. Find thirty seconds of video</h2>
          <p className="mt-2 text-ink-soft">
            {/* TODO(Lalie): "test file, not your best work" per §8 spec. */}
          </p>
        </li>
        <li>
          <h2 className="font-serif text-2xl">Your machine</h2>
          {/* TODO(Simon, Gate 4): real requirements — macOS version, Apple
              Silicon vs Intel, disk space for the speech model. Blocks this
              slot and the product description (§9) equally. */}
          <p className="mt-2 text-ink-soft">[ machine requirements ]</p>
        </li>
        <li>
          <h2 className="font-serif text-2xl">What happens in the room</h2>
          <p className="mt-2 text-ink-soft">
            {/* TODO(Lalie): the clip may still be rendering when they leave —
                that's normal, per the guarantee (§5). */}
          </p>
        </li>
      </ol>
    </main>
  );
}
