/**
 * The site's navigation, in ONE place.
 *
 * The homepage carries a bespoke centred masthead and every other page uses
 * NavBar, and the two had drifted badly: different items, different labels, an
 * external link, a dead /notes route and the old workers.dev Studio URL. Both
 * now read from here, so they cannot disagree again.
 *
 * Hrefs are absolute (/#about rather than #about) so the same item works from
 * any page, not just the homepage.
 */

export type NavItem = { n: string; label: string; href: string };

/** Left of the logo on the homepage masthead. */
export const NAV_LEFT: NavItem[] = [
  { n: '01', label: 'About', href: '/#about' },
  { n: '02', label: 'Work Together', href: '/#ways-to-work' },
];

/** Right of the logo, before the button. */
export const NAV_RIGHT: NavItem[] = [
  { n: '03', label: 'Articles', href: '/blog' },
  { n: '04', label: 'Resources', href: '/resources' },
];

/** Every text item, in reading order — for navs that do not split around a logo. */
export const NAV_ITEMS: NavItem[] = [...NAV_LEFT, ...NAV_RIGHT];

/** The quiet operator link. Kept separate: it is not for visitors. */
export const STUDIO = { label: 'Studio', href: 'https://app.envisioned.me/login' };

/**
 * The one call to action. It books a real slot rather than opening an email —
 * a mailto asks the visitor to compose something and wait; the booking page
 * shows only times she is actually free and confirms on the spot.
 */
export const PRIMARY_CTA = {
  label: 'Book a call',
  href: '/book/envisioned-match',
};
