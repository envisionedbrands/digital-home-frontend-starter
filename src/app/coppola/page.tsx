import type { Metadata } from "next";
import { COPPOLA_MENU_MARKUP } from "./markup";

/**
 * Unlisted "Video Editing Menu" page — not linked from nav or the sitemap,
 * same pattern as /invisible-team and /team-coppola. Shared by direct link
 * when someone asks what Coppola can currently do to a video.
 *
 * Markup and stylesheet are a verbatim, scripted extraction of the artifact
 * Maria-Ines approved and handed off on 2026-09-29 (see markup.ts) — styled
 * standalone (Georgia/Inter/Courier Prime, oxblood accent), not the site's
 * shared design tokens, to preserve the approved look exactly.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.envisioned.me";

export const metadata: Metadata = {
  title: "The Video Editing Menu · Envisioned",
  description:
    "Everything you can ask your video editor for, shown on a real clip — built in today, coming in the next update, made to order, and what's not possible.",
  alternates: { canonical: `${SITE_URL}/coppola` },
  robots: { index: false, follow: false },
};

export default function CoppolaPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&family=Courier+Prime:wght@400;700&display=swap"
      />
      <link rel="stylesheet" href="/coppola/style.css" />
      <div dangerouslySetInnerHTML={{ __html: COPPOLA_MENU_MARKUP }} />
    </>
  );
}
