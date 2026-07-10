-- Adds joint-venture and land-tenure fields to listings so land parcels
-- (property_type = 'Land') can be marked as JV opportunities and surfaced
-- on the /joint-venture page and /land/:slug detail page.

alter table public.listings
  add column if not exists is_jv boolean not null default false,
  add column if not exists jv_structure text,
  add column if not exists tenure text;

comment on column public.listings.is_jv is
  'True when a land listing is open to a joint-venture partnership rather than (or in addition to) outright sale.';
comment on column public.listings.jv_structure is
  'Free-text JV deal structure, e.g. "Revenue share", "Equity split", "Lease-to-JV".';
comment on column public.listings.tenure is
  'Land title/tenure status, e.g. "Freehold", "Leasehold", "Mailo", "Kibanja / customary", "In process".';
