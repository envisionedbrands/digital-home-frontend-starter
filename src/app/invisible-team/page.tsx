import type { Metadata } from "next";
import TrainingSeries from "./TrainingSeries";

/**
 * Unlisted training hub for the Buzz onboarding series (not linked from nav
 * or the sitemap — same pattern as /open-studio/prep and /team-coppola).
 * Shared by direct link only, once Maria-Ines decides who gets it.
 */

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
] as const;

export default function InvisibleTeamPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[860px] mx-auto w-full">
        <p className="kicker mb-8">Getting started</p>

        <h1 className="display text-4xl md:text-6xl text-ink mb-8">Your invisible team.</h1>

        <p className="text-xl text-ink-soft max-w-[38em] leading-[1.75] mb-16">
          Four short lessons. Buzz on your laptop, your key, your community, and your
          first hello to an agent that already lives there. Each one unlocks once the
          one before it is finished — no skipping ahead.
        </p>

        <TrainingSeries lessons={LESSONS} />
      </div>
    </main>
  );
}
