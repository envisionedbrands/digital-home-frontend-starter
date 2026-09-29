import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import styles from "./coppola.module.css";

/**
 * Unlisted demo page for Coppola (the video editor agent) — not linked from
 * nav or the sitemap, same pattern as /invisible-team and /team-coppola.
 * Shared by direct link when someone asks what Coppola can produce right now.
 *
 * Branding follows the current envisioned.me home (Fraunces display, magenta
 * accent, oxblood ink) via coppola.module.css, same override used by
 * invisible-team.module.css.
 */

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.envisioned.me";

export const metadata: Metadata = {
  title: "What Coppola can do · Envisioned",
  description: "A current sample of Coppola's video editing, straight from the pipeline.",
  alternates: { canonical: `${SITE_URL}/coppola` },
  robots: { index: false, follow: false },
};

export default function CoppolaPage() {
  return (
    <main className={`${styles.brand} min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center`}>
      <div className="max-w-[780px] mx-auto w-full">
        <p className="kicker text-[#A80F4C] mb-8">Coppola · Video editor</p>

        <h1
          className={`${fraunces.className} text-4xl md:text-6xl text-ink mb-8 leading-[1.08] tracking-[0.005em]`}
        >
          What Coppola can do right now.
        </h1>

        <p className="text-xl text-ink-soft max-w-[38em] leading-[1.75] mb-12">
          A current sample, straight out of the pipeline. No manual polish —
          this is the edit Coppola produces on its own.
        </p>

        <div className="bg-canvas-soft px-8 py-10 border border-hair">
          <video
            className="w-full border border-hair"
            controls
            preload="metadata"
            poster="/coppola/01-spin.jpg"
          >
            <source src="/coppola/01-spin.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
  );
}
