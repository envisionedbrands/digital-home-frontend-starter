import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import TrainingSeries from "./TrainingSeries";
import styles from "./invisible-team.module.css";

/**
 * Unlisted training hub for the Buzz onboarding series (not linked from nav
 * or the sitemap — same pattern as /open-studio/prep and /team-coppola).
 * Shared by direct link only, once Maria-Ines decides who gets it.
 *
 * Branding here follows the current envisioned.me home (Fraunces display,
 * magenta accent, oxblood ink), not this repo's older Megante/olive tokens
 * — invisible-team.module.css scopes the ink/taupe/canvas/hair variables to
 * the live envisioned.me light theme for this route only, so every existing
 * text-ink / text-taupe / bg-canvas-soft / border-hair class below already
 * picks up the correct colour without a rewrite.
 */

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.envisioned.me";

export const metadata: Metadata = {
  title: "Your invisible team · Envisioned",
  description:
    "A short series that gets you from download to your first conversation with the AI team already waiting in your workspace.",
  alternates: { canonical: `${SITE_URL}/invisible-team` },
  robots: { index: false, follow: false },
};

const LESSONS = [
  {
    id: "download-buzz",
    title: "Download Buzz",
    blurb: "Get Buzz onto your laptop. One job today, no detours.",
    src: "/invisible-team/01-download-buzz.mp4",
    poster: "/invisible-team/01-download-buzz.jpg",
    ctaHref: "https://buzz.xyz/",
    ctaLabel: "Download Buzz",
  },
  {
    id: "your-key-and-your-ai",
    title: "Your key and your AI",
    blurb:
      "The one part you can't skip: your private key, its backup, and the AI subscription that powers your agents.",
    src: "/invisible-team/02-your-key-and-your-ai.mp4",
    poster: "/invisible-team/02-your-key-and-your-ai.jpg",
  },
  {
    id: "your-community",
    title: "Your community",
    blurb: "Join the workspace, or start your own. That's where you and your team actually work.",
    src: "/invisible-team/03-your-community.mp4",
    poster: "/invisible-team/03-your-community.jpg",
  },
  {
    id: "say-hello",
    title: "Say hello",
    blurb: "A quick tour of the room, then your first real conversation with an agent.",
    src: "/invisible-team/04-say-hello.mp4",
    poster: "/invisible-team/04-say-hello.jpg",
  },
  {
    id: "talking-in-a-room",
    title: "Talking in a room",
    blurb:
      "Channels, the @ sign, and where replies land, plus the one setting that decides threads or top level.",
    src: "/invisible-team/05-talking-in-a-room.mp4",
    poster: "/invisible-team/05-talking-in-a-room.jpg",
  },
  {
    id: "what-buzz-actually-is",
    title: "What Buzz actually is",
    blurb:
      "Not just an AI, and not just a Slack replacement. The room, the door, and the AI you already pay for.",
    src: "/invisible-team/06-what-buzz-actually-is.mp4",
    poster: "/invisible-team/06-what-buzz-actually-is.jpg",
  },
  {
    id: "buzz-on-your-phone",
    title: "Buzz on your phone",
    blurb: "Pair your phone to your identity, no second account, no copy of your keys.",
    src: "/invisible-team/07-buzz-on-your-phone.mp4",
    poster: "/invisible-team/07-buzz-on-your-phone.jpg",
  },
] as const;

export default function InvisibleTeamPage() {
  return (
    <main className={`${styles.brand} min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center`}>
      <div className="max-w-[1180px] mx-auto w-full">
        <p className="kicker text-[#A80F4C] mb-8">Getting started</p>

        <h1
          className={`${fraunces.className} text-4xl md:text-6xl text-ink mb-8 leading-[1.08] tracking-[0.005em]`}
        >
          Your invisible team.
        </h1>

        <p className="text-xl text-ink-soft max-w-[38em] leading-[1.75] mb-16">
          Seven short lessons. Buzz on your laptop, your key, your community, your
          first hello to an agent that already lives there, how to talk in a room,
          what Buzz actually is, and Buzz on your phone. Each one unlocks once the
          one before it is finished — no skipping ahead.
        </p>

        <TrainingSeries lessons={LESSONS} titleClassName={fraunces.className} />
      </div>
    </main>
  );
}
