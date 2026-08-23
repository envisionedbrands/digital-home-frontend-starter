/**
 * GET /resources/download/[filename]
 *
 * Serves resource files with Content-Disposition: attachment so the
 * browser downloads them instead of displaying as text.
 *
 * File content is bundled at build time via webpack raw imports
 * (see src/lib/resources/content.ts) because Cloudflare Workers
 * cannot self-fetch static assets from the ASSETS binding.
 */

import { RESOURCE_FILES } from "@/lib/resources/content";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const content = RESOURCE_FILES[filename];

  if (!content) {
    return new Response("File not found", { status: 404 });
  }

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
