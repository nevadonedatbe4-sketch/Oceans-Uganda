// Local, neutral stand-ins used wherever a real photo is missing.
// These are flat colour panels (no external image service involved).

const svg = (fill: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="none"><rect width="800" height="600" fill="${fill}"/></svg>`,
  )}`;

/** Light neutral panel — cards, thumbnails, portraits. */
export const PLACEHOLDER_IMAGE = svg('#e9e6df');

/** Dark brand-navy panel — hero / full-bleed backgrounds that sit under a dark overlay. */
export const PLACEHOLDER_HERO = svg('#0d1f2d');
