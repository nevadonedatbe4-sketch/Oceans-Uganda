// Rebuilds the listing sections of public/sitemap.xml from published listings.
//
//   npm run sitemap
//
// Everything above the "Land listings" / "Property listings" markers (core pages,
// neighbourhoods, …) is kept as-is. Land plots are listed under /land/:slug, every
// other property type under /property/:slug. If the database can't be reached the
// existing file is left untouched.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://oceans.co.ug').replace(/\/$/, '');
const LAND_MARKER = '  <!-- Land listings -->';
const PROPERTY_MARKER = '  <!-- Property listings -->';
const PAGE_SIZE = 1000;

function loadEnv() {
  const env = { ...process.env };
  const file = path.join(ROOT, '.env');
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && env[m[1]] === undefined) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

async function fetchPublishedListings(url, key) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const res = await fetch(
      `${url}/rest/v1/listings?select=slug,property_type,updated_at,listing_date&status=eq.published&order=listing_date.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + PAGE_SIZE - 1}` } },
    );
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < PAGE_SIZE) return rows;
  }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function entries(rows, basePath, priority) {
  return rows
    .map((r) => {
      const lastmod = String(r.updated_at || r.listing_date || new Date().toISOString()).slice(0, 10);
      return [
        '  <url>',
        `    <loc>${SITE_URL}${basePath}/${esc(encodeURIComponent(r.slug))}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>weekly</changefreq>',
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');
}

async function main() {
  const env = loadEnv();
  const url = env.VITE_PUBLIC_SUPABASE_URL;
  const key = env.VITE_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('sitemap: Supabase env vars missing — leaving sitemap.xml unchanged.');
    return;
  }

  let rows;
  try {
    rows = (await fetchPublishedListings(url, key)).filter((r) => r.slug);
  } catch (err) {
    console.warn(`sitemap: could not load listings (${err.message}) — leaving sitemap.xml unchanged.`);
    return;
  }

  const current = readFileSync(SITEMAP, 'utf8');
  const cut = [current.indexOf(LAND_MARKER), current.indexOf(PROPERTY_MARKER)].filter((i) => i >= 0);
  if (!cut.length) {
    console.warn('sitemap: listing markers not found in sitemap.xml — leaving it unchanged.');
    return;
  }
  const head = current.slice(0, Math.min(...cut)).trimEnd();

  const land = rows.filter((r) => r.property_type === 'Land');
  const other = rows.filter((r) => r.property_type !== 'Land');

  const out = [
    head,
    '',
    LAND_MARKER,
    entries(land, '/land', '0.7'),
    '',
    PROPERTY_MARKER,
    entries(other, '/property', '0.6'),
    '',
    '</urlset>',
    '',
  ].join('\n');

  writeFileSync(SITEMAP, out);
  console.log(`sitemap: wrote ${land.length} land + ${other.length} property listings to public/sitemap.xml`);
}

main();
