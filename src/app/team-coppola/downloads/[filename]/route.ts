/**
 * GET /team/downloads/[filename]?license_key=...
 *
 * Coppola hire card. Requires a valid, non-disabled Lemon Squeezy license
 * key for product 1241346 — see src/lib/team/entitlement.ts.
 */

import { NextRequest } from "next/server";
import { checkTeamEntitlement, denyResponse } from "@/lib/team/entitlement";
import { TEAM_DOWNLOADS, coppolaAgentCardFor } from "@/lib/team/content";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const entitlement = await checkTeamEntitlement(request);
  if (!entitlement.allowed) return denyResponse(entitlement);

  const { filename } = await params;
  if (!(filename in TEAM_DOWNLOADS)) return new Response("Not found", { status: 404 });

  const file =
    filename === "coppola.agent.json"
      ? coppolaAgentCardFor(entitlement.licenseKey)
      : TEAM_DOWNLOADS[filename];

  return new Response(file.bytes(), {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, private",
    },
  });
}
