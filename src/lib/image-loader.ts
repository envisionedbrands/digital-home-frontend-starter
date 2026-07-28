export default function cloudflareLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Cloudflare Image Resizing (/cdn-cgi/image/...) requires a paid zone
  // feature that isn't enabled here — requests to it 404 and images break.
  // Serve sources directly; Supabase storage URLs are already public CDN.
  return src;
}
