/**
 * GET /team/releases/[version]/[filename]?license_key=...
 *
 * Pinned Coppola release: manifest, installer, training archive. Requires a
 * valid, non-disabled Lemon Squeezy license key for product 1241346 — see
 * src/lib/team/entitlement.ts.
 */

import { NextRequest } from "next/server";
import { checkTeamEntitlement, denyResponse } from "@/lib/team/entitlement";
import { TEAM_RELEASES } from "@/lib/team/content";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ version: string; filename: string }> }
) {
  const entitlement = await checkTeamEntitlement(request);
  if (!entitlement.allowed) return denyResponse(entitlement);

  const { version, filename } = await params;
  const file = TEAM_RELEASES[version]?.[filename];
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(file.bytes(), {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, private",
    },
  });
}
