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

/**
 * Left of the logo on the homepage masthead.
 *
 * Three items left, one right: the right side also carries Clients and the
 * primary button, so an even 2/2 split of the text items left it visibly
 * heavier. Articles moved across to balance the masthead.
 */
export const NAV_LEFT: NavItem[] = [
  { n: '01', label: 'About', href: '/#about' },
  { n: '02', label: 'Work Together', href: '/#ways-to-work' },
  { n: '03', label: 'Articles', href: '/blog' },
];

/** Right of the logo, before Clients and the button. */
export const NAV_RIGHT: NavItem[] = [
  { n: '04', label: 'Resources', href: '/resources' },
];

/** Every text item, in reading order — for navs that do not split around a logo. */
export const NAV_ITEMS: NavItem[] = [...NAV_LEFT, ...NAV_RIGHT];

/** The quiet client login. Kept separate: it is not for first-time visitors. */
export const STUDIO = { label: 'Clients', href: 'https://app.envisioned.me/login' };

/**
 * The one call to action: the FREE diagnostic, not the paid offer.
 *
 * The commercial spine (map-diagnostic-spec §2): the machine's hours are free,
 * her hours are €1,500. The AI Readiness Map is the front door and sells the
 * paid Integration Map at its own close, so nothing is booked or bought here.
 *
 * Naming is locked by that spec (§9): the public name is "The AI Readiness Map";
 * "Integration Map" belongs only at the door of the paid offer. These buttons
 * used to say "Start with the Integration Map" and open a booking, which
 * advertised the €1,500 offer at the front door and asked for a calendar slot
 * for something that is async and free.
 */
export const PRIMARY_CTA = {
  label: 'Take the Map',
  href: 'https://map.envisioned.me',
};
