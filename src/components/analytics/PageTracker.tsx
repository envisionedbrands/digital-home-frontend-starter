'use client';

/**
 * Mounts the analytics tracker.
 *
 * The tracker module and the /api/analytics endpoint both existed and worked
 * for months — nothing ever imported them, so analytics_events sat at 0 while
 * the site looked instrumented. This is the missing wire.
 *
 * Fires a page_view on every route change (App Router navigations don't
 * remount the layout, so a plain useEffect on mount would only ever see the
 * first page of a session).
 */
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics/tracker';

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    const full = qs ? `${pathname}?${qs}` : pathname;

    // Guard against double-fires (React strict mode, param churn).
    if (lastPath.current === full) return;
    lastPath.current = full;

    trackEvent({
      eventType: 'page_view',
      pageSlug: pathname,
      eventData: {
        referrer: typeof document !== 'undefined' ? document.referrer || null : null,
        // Cheap, useful segmentation without another library.
        viewport:
          typeof window !== 'undefined'
            ? window.innerWidth < 640
              ? 'mobile'
              : window.innerWidth < 1024
                ? 'tablet'
                : 'desktop'
            : null,
      },
    });
  }, [pathname, searchParams]);

  return null;
}
