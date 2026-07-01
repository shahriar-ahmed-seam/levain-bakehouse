/**
 * Curated Unsplash imagery (CDN URLs with sizing params, no API key shipped).
 * Attribution is required by the Unsplash license and shown in the footer.
 */

const u = (id, w = 2600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const HERO_IMAGE = {
  src: u('photo-1509440159596-0249088772ff', 2800),
  credit: 'Wesual Click',
  creditUrl: 'https://unsplash.com/@wesual',
};

export const STORY_IMAGE = {
  src: u('photo-1555507036-ab1f4038808a', 1800),
  credit: 'Mae Mu',
  creditUrl: 'https://unsplash.com/@picoftasty',
};

export const INTERIOR_IMAGE = {
  src: u('photo-1689037676470-b72230d5236e', 1800),
  credit: 'Amy Vosters',
  creditUrl: 'https://unsplash.com/@amyvosters',
};
