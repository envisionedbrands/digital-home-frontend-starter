/**
 * Coppola hire card + pinned release registry.
 *
 * These files are bundled here (not placed under public/) so the only way to
 * reach their bytes is through the entitlement-gated route handlers in
 * src/app/team/downloads and src/app/team/releases — never as a directly
 * fetchable static asset.
 */

import coppolaAgentCard from "./protected/downloads/coppola.agent.json";
import releaseManifest from "./protected/releases/coppola-2026-09-23.1/manifest.json";
import { INSTALLER_SCRIPT, TRAINING_ARCHIVE_BASE64 } from "./protected-generated";

export type TeamFile = {
  contentType: string;
  bytes(): ArrayBuffer;
};

function textFile(content: string, contentType: string): TeamFile {
  return { contentType, bytes: () => new TextEncoder().encode(content).buffer as ArrayBuffer };
}

function base64File(base64: string, contentType: string): TeamFile {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return { contentType, bytes: () => bytes.buffer as ArrayBuffer };
}

export const TEAM_DOWNLOADS: Record<string, TeamFile> = {
  "coppola.agent.json": textFile(
    JSON.stringify(coppolaAgentCard, null, 2),
    "application/json; charset=utf-8"
  ),
};

/**
 * The hire card's system prompt has the archive/installer URLs baked in
 * (see the "Pinned release data" block). Coppola — the agent this card
 * creates — needs to fetch those later, potentially long after this
 * download, with no browser session to carry the customer's key. So we
 * stamp their own validated license key onto both URLs at card-download
 * time: the card is then self-contained and keeps working on its own.
 */
export function coppolaAgentCardFor(licenseKey: string): TeamFile {
  const suffix = `?license_key=${encodeURIComponent(licenseKey)}`;
  const raw = JSON.stringify(coppolaAgentCard, null, 2)
    .split(releaseManifest.archive_url)
    .join(releaseManifest.archive_url + suffix)
    .split(releaseManifest.installer_url)
    .join(releaseManifest.installer_url + suffix);
  return textFile(raw, "application/json; charset=utf-8");
}

export const TEAM_RELEASES: Record<string, Record<string, TeamFile>> = {
  "coppola-2026-09-23.1": {
    "manifest.json": textFile(
      JSON.stringify(releaseManifest, null, 2),
      "application/json; charset=utf-8"
    ),
    "install_release.py": textFile(INSTALLER_SCRIPT, "text/x-python; charset=utf-8"),
    "coppola-training.zip": base64File(TRAINING_ARCHIVE_BASE64, "application/zip"),
  },
};
