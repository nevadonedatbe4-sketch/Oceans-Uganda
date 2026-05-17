# Oceans Uganda — Real Estate Platform

## 1. Project Description

Oceans Uganda is a premium real estate platform for buying, renting, and leasing residential properties in Kampala, Uganda. The platform serves three audiences:
- **Visitors** — browsing listings, discovering neighborhoods, making enquiries
- **Staff / Agents** — managing listings, following up on leads, tracking deals
- **Admin** — full control over all content, settings, SEO, and team

The site is built on a 3-layer architecture:
- **Presentation** — what visitors see (homepage, listings, neighborhoods, contact)
- **Content** — all data stored in Supabase (properties, agents, leads, blog, settings)
- **Management** — `/admin` dashboard for staff to create, edit, publish, and manage everything

---

## 2. Page Structure

### Public-facing
- `/` — Homepage
- `/buy` — Properties for Sale
- `/rent` — Properties to Rent
- `/all-properties` — All Properties (buy + rent)
- `/property/:slug` — Property Detail Page
- `/neighborhoods` — All Neighborhoods
- `/neighborhood/:slug` — Neighborhood Detail Page
- `/about` — About Oceans
- `/contact` — Contact Page
- `/blog` — Blog / Insights
- `/blog/:slug` — Blog Post Detail
- `/agents` — Agent Profiles
- `/agent/:slug` — Agent Detail + Listings
- `/landlords` — Landlord Services
- `/new-developments` — New Developments
- `/valuation` — Property Valuation
- `/search` — Advanced Search
- `/listings` — Listings with Sidebar Filters

### Admin (protected)
- `/admin` — Dashboard (stats + quick links)
- `/admin/listings` — All Listings
- `/admin/listings/new` — Add New Listing
- `/admin/listings/:id` — Edit Listing
- `/admin/neighborhoods` — Neighborhoods
- `/admin/agents` — Team / Agents
- `/admin/leads` — Leads & Inquiries
- `/admin/deals` — Deals Pipeline
- `/admin/homepage` — Homepage Sections
- `/admin/testimonials` — Testimonials
- `/admin/blog` — Blog Posts
- `/admin/media` — Media Library
- `/admin/seo` — SEO Settings
- `/admin/settings` — Site Settings
- `/admin/users` — User Management
- `/admin/activities` — Activity Feed
- `/admin/inquiries` — Inquiries Inbox
- `/admin/favorites` — Saved Favorites
- `/admin/saved-searches` — Saved Searches
- `/admin/profile` — Admin Profile
- `/admin/management/*` — Deep Management Pages (see below)
- `/admin/login` — Admin Login
- `/admin/reset-password` — Password Reset

### Agent Portal (protected)
- `/agent/login` — Agent Login
- `/agent/register` — Agent Registration
- `/agent/dashboard` — Agent Dashboard
- `/agent/listings` — My Listings
- `/agent/leads` — My Leads
- `/agent/profile` — Agent Profile
- `/agent/reset-password` — Password Reset

---

## 3. Core Features

### Public Site
- [x] Browse all listings with filters (type, purpose, bedrooms, price, area)
- [x] Property detail page with full gallery, specs, agent info
- [x] Neighborhood pages with descriptions and listings
- [x] Contact / enquiry forms (linked to leads database)
- [x] Homepage sections driven from CMS
- [x] Blog / Insights section
- [x] SEO meta tags per page (from database)
- [x] Recently viewed properties strip
- [x] Property preview modal
- [x] Advanced search with sidebar filters
- [x] Agent profiles and agent listing pages
- [x] Landlord services page
- [x] Property valuation page
- [x] New developments page
- [x] **Multi-currency price display** — visitors can switch between USD / UGX / EUR / GBP

### Admin Panel
- [x] Secure admin login (Supabase Auth)
- [x] Dashboard with KPIs (listings, leads, deals)
- [x] Full CRUD for listings + image upload (Supabase Storage)
- [x] Assign agents to listings
- [x] Manage neighborhoods / areas
- [x] Manage homepage sections (visibility, order, content)
- [x] Lead inbox with stage management
- [x] Deals pipeline view
- [x] Team/agents management
- [x] Testimonials management
- [x] Blog post editor
- [x] Media library
- [x] Site settings (logo, phone, email, socials, footer)
- [x] SEO settings per page + global defaults
- [x] User management with roles
- [x] Activity feed
- [x] Deep management pages (design system, styling, typography, etc.)
- [x] Bulk actions on listings
- [x] CSV export for leads
- [x] Property form layout builder
- [x] Page builder / component settings
- [x] **Exchange rate management** — admin can set manual rates or fetch live rates for USD→UGX, USD→EUR, USD→GBP

---

## 4. Data Model Design

### listings
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| title | text | Property title |
| slug | text | URL slug |
| property_type | text | Apartment / Villa / Penthouse / etc |
| purpose | text | sale / rent / short_stay / new_dev |
| price | numeric | Listing price |
| currency | text | USD / UGX |
| price_note | text | /Month, /Year etc |
| location | text | Area name |
| neighborhood_id | uuid | FK → neighborhoods |
| address | text | Full address |
| bedrooms | int | Number of bedrooms |
| bathrooms | int | Number of bathrooms |
| parking | int | Parking spaces |
| size_sqm | numeric | Size in sqm |
| furnished | boolean | Is furnished |
| featured | boolean | Show in featured |
| status | text | available / sold / rented / hidden |
| short_description | text | Card snippet |
| full_description | text | Full listing body |
| cover_image | text | Main image URL |
| agent_id | uuid | FK → agents |
| listing_date | date | Date listed |
| seo_title | text | SEO title override |
| seo_description | text | SEO meta description |
| created_at | timestamptz | Auto |

### listing_images
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| listing_id | uuid | FK → listings |
| url | text | Image URL |
| sort_order | int | Display order |

### listing_amenities
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| listing_id | uuid | FK → listings |
| amenity | text | e.g. Pool, Gym, Security |

### neighborhoods
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Area name |
| slug | text | URL slug |
| city | text | Kampala |
| country | text | Uganda |
| hero_image | text | Hero image URL |
| short_intro | text | Short description |
| long_description | text | Full page body |
| highlights | jsonb | Array of highlights |
| lifestyle_tags | jsonb | Array of tags |
| featured | boolean | Show on homepage |
| sort_order | int | Display order |
| seo_title | text | |
| seo_description | text | |

### agents
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| full_name | text | Agent name |
| title | text | Job title |
| bio | text | About text |
| photo | text | Photo URL |
| phone | text | Phone number |
| email | text | Email |
| whatsapp | text | WhatsApp number |
| social_links | jsonb | Instagram, LinkedIn etc |
| active | boolean | Is active |
| display_order | int | Sort order |

### leads
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| lead_name | text | Contact name |
| email | text | Email |
| phone | text | Phone / WhatsApp |
| listing_id | uuid | FK → listings (nullable) |
| source_page | text | Which page they came from |
| message | text | Their enquiry |
| assigned_to | uuid | FK → agents (nullable) |
| stage | text | new/contacted/viewing/negotiating/won/lost/archived |
| follow_up_date | date | Scheduled follow-up |
| notes | text | Staff notes |
| created_at | timestamptz | Auto |

### deals
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| client_name | text | |
| listing_id | uuid | FK → listings |
| stage | text | inquiry/qualified/viewing/offer/closed_won/closed_lost |
| expected_value | numeric | |
| agent_id | uuid | FK → agents |
| next_action | text | |
| notes | text | |
| created_at | timestamptz | |

### homepage_sections
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| section_key | text | Unique key (hero, featured_listings etc) |
| title | text | Section heading |
| subtitle | text | Subheading |
| body_text | text | Body content |
| button_text | text | CTA button label |
| button_link | text | CTA button URL |
| image_url | text | Background/section image |
| visible | boolean | Show/hide toggle |
| sort_order | int | Display order |

### testimonials
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| client_name | text | |
| role_company | text | |
| testimonial_text | text | |
| photo | text | |
| rating | int | 1-5 |
| featured | boolean | |
| created_at | timestamptz | |

### blog_posts
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| title | text | |
| slug | text | |
| category | text | |
| featured_image | text | |
| excerpt | text | |
| full_body | text | |
| author_id | uuid | FK → agents |
| publish_date | date | |
| published | boolean | |
| seo_title | text | |
| seo_description | text | |

### site_settings
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| key | text | Setting key |
| value | text | Setting value |
| label | text | Human label |
| group | text | general / seo / social / contact / currency |

### media_items
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| file_name | text | |
| url | text | |
| alt_text | text | |
| tags | text[] | |
| type | text | image / video / document |
| linked_content_type | text | |
| uploaded_by | uuid | |
| created_at | timestamptz | |

### user_profiles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| full_name | text | |
| role | text | super_admin / admin / editor / agent |
| avatar_url | text | |
| phone | text | |
| created_at | timestamptz | |

### pages
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| slug | text | Page slug |
| title | text | |
| meta_description | text | |
| og_title | text | |
| og_description | text | |
| og_image | text | |
| content | text | |
| published | boolean | |

### component_settings
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| component_key | text | |
| settings | jsonb | |
| updated_at | timestamptz | |

### property_form_layout
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| layout | jsonb | Form field configuration |
| updated_at | timestamptz | |

### exchange_rates
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| from_currency | text | Base currency (USD) |
| to_currency | text | Target currency (UGX / EUR / GBP) |
| rate | numeric | Exchange rate value |
| source | text | manual / auto |
| updated_at | timestamptz | Auto |

---

## 5. Backend / Integration Plan

- **Supabase Auth** — Admin login, protected routes, RLS policies
- **Supabase Database** — All data (listings, leads, agents, settings etc)
- **Supabase Storage** — Property images, agent photos, media library
- **Supabase Edge Functions** — Create Admin User (deployed)

---

## 6. Development Phase Plan

### Phase 1: Supabase Setup + Database Schema ✅ COMPLETE
- Goal: Connect Supabase, create all core tables with RLS
- Deliverable: Database ready, admin auth working
- Tables created: neighborhoods, agents, listings, listing_images, listing_amenities, leads, deals, homepage_sections, testimonials, blog_posts, site_settings, media_items, user_profiles, pages, component_settings, property_form_layout, **exchange_rates**
- RLS policies: public read on content tables, public insert on leads, authenticated full access on all
- Seed data: 8 homepage sections, 15 site settings, 4 agents, 8 neighborhoods, 4 testimonials

### Phase 2: Admin Shell + Auth ✅ COMPLETE
- Goal: Build the `/admin` layout, login page, sidebar navigation, protected routes
- Deliverable: Secure admin panel shell
- Built: Supabase AuthContext, ProtectedRoute, AdminLogin, AdminSidebar (15+ items), AdminLayout, AdminDashboard (live KPIs + charts), placeholder pages for all admin sections

### Phase 3: Admin — Listings Management ✅ COMPLETE
- Goal: Full CRUD for listings, image upload, status/featured toggles
- Deliverable: Staff can add/edit/delete/publish properties from admin
- Built: Full listing form (multi-step + tabbed), media uploader, gallery management, assign agent, bulk actions, quick edit, extend expiry, card preview modal, filters, table + grid views

### Phase 4: Admin — Leads & Inquiries CRM ✅ COMPLETE
- Goal: Lead inbox with stage management, assign to agents, notes, follow-up dates
- Deliverable: Every inquiry auto-saved to DB; staff can manage stages, add notes, export CSV
- Built: KPI cards, List view (sortable table), Kanban board view, Lead detail drawer, CSV export, filters by stage/agent/source/search

### Phase 5: Admin — Neighborhoods, Agents, Homepage Sections ✅ COMPLETE
- Goal: Manage areas, team bios, and homepage section content
- Built: Full CRUD for neighborhoods (grid view, hero image, highlights, lifestyle tags, SEO), full CRUD for agents (photo, bio, contact, social links, active toggle), inline homepage section editor (expand-to-edit, visibility toggle, image preview)

### Phase 6: Admin — Testimonials, Blog, Media Library, Site Settings ✅ COMPLETE
- Goal: Full content management for remaining modules
- Built:
  - Testimonials: card grid + star rating + featured toggle + add/edit modal
  - Blog: table list with draft/published filter + full post editor (tabbed: content + SEO/publish settings)
  - Media Library: image grid with URL-paste upload, copy-URL, filter by type, alt text, tags
  - Site Settings: grouped accordion editor (General, Contact, Social, SEO, Currency, Footer)
  - Users: invite modal, user detail drawer, role management

### Phase 6b: Admin — Deep Management Pages ✅ COMPLETE
- Goal: Granular control over every aspect of the site
- Built: 20+ management sub-pages including:
  - Design System (colors, typography, spacing, buttons, cards, carousels)
  - Styling (property cards, property details)
  - Page-specific settings (hero, homepage, listings, neighborhoods, landlords, contact, about, new developments)
  - Component settings, breadcrumbs, navigation, maps, search, **currency exchange rates**, branding, social, general
  - Property form layout builder
  - Page builder

### Phase 7: Frontend — Connect to Database ✅ COMPLETE
- Goal: Replace all hardcoded mock data with live Supabase data
- Deliverable: Fully dynamic public site driven by admin panel
- Connected: HeroSection, PropertiesSection, NeighborhoodsSection, ContactSection, Buy/Rent/All Properties pages, Property Detail page, Navbar + Footer, Blog, Testimonials, Agents
- **Removed all mock data** — `src/mocks/` directory deleted, all pages pull exclusively from Supabase

### Phase 8: Agent Portal ✅ COMPLETE
- Goal: Dedicated portal for agents to manage their own listings and leads
- Built: Agent login/register, dashboard, my listings, my leads, profile with photo upload, password change

### Phase 9: Polish + SEO + UX Improvements ✅ COMPLETE
- Goal: Per-page SEO from DB, performance tuning, final QA
- Deliverable: Production-ready platform
- Done:
  - Box shadows added to all contact cards for better visual hierarchy
  - All mock data removed — zero fake data anywhere
  - Recently viewed properties strip
  - Property preview modal
  - Global contact strip
  - Mobile search sheet
  - Advanced search with sidebar filters
  - Pagination on listing grids
  - SEO meta tags per page via PageSEO component
  2- Sitemap and robots.txt
  - 404 page
  - Agent profile pages with listings
  - Landlord services page
  - Property valuation page
  - New developments page
  - Contact page with sidebar + full layout modes
  - Inner contact section reusable component

### Phase 10: Multi-Currency System ✅ COMPLETE
- Goal: Allow visitors to switch displayed currency on all property prices
- Deliverable: USD/UGX/EUR/GBP currency switcher visible in top bar, instant price updates across all pages
- Built:
  - `exchange_rates` table in Supabase with rates for USD→UGX, USD→EUR, USD→GBP
  - `CurrencyContext` React context — stores selected currency in localStorage, fetches rates from DB
  - `CurrencySwitcher` component in top bar + mobile menu — bold, visible, compact dropdown
  - `formatPrice` function in context handles all 4 currency formats:
    - USD: `$1,500`
    - UGX: `UGX 5,850,000`
    - EUR: `€1,380`
    - GBP: `£1,180`
  - All price displays updated: PropertyCard, PropertyRowCard, PropertyBody, PropertyDetail page, SimilarProperties, SearchResults, Buy/Rent/All-Properties/Neighborhood pages, Agent listing cards, Property preview modal
  - Admin currency management page updated with multi-currency tabs for setting rates per currency
  - Admin listings table shows both USD base price and original stored currency
- Rules enforced:
  - Only USD, UGX, EUR, GBP allowed (no other currencies)
  - USD is always the default
  - Stored property prices never change when switching currency
  - Frontend conversion only

### Phase 11: CRM Logic Flow + Lifecycle 🔄 COMPLETE
- Goal: Implement proper CRM lifecycle separating data entry, status control, and publishing
- Deliverable: Clean CRM backbone that won't create backend chaos
- Done:
  - [x] **CRM Status States**: Draft → Pending Review → Published → Rejected → Sold → Rented → Archived → On Hold
  - [x] **Auto-save on every step change** with debounced Supabase persistence
  - [x] **New Add Property flow**: Creates blank `draft` record in DB immediately, not after form completion
  - [x] **Draft ID persistence**: Session flag prevents refresh from treating a new draft as edit mode
  - [x] **Status SEPARATION enforced**: Status control only appears in Edit mode (QuickControlsBar, Settings step)
  - [x] **Final Submit logic**: Add flow always goes to `pending_review` — never directly publishes
  - [x] **All public queries updated**: Every page now queries `status = 'published'` instead of old `published=true AND status='available'`
  - [x] **Admin listings table**: Stats now show Published / Draft / Pending counts instead of Available/Featured/Hidden
  - [x] **Property Actions Menu**: Status actions updated to CRM states (Publish, Archive, On Hold, Sold, Rented, Send to Review, Reject)
  - [x] **Quick Edit Modal**: Status picker now uses CRM status set
  - [x] **TypeScript types**: `STATUSES` constant updated, `statusColor()` covers all CRM states

### Phase 12: Launch Ready 🔄 IN PROGRESS
- Goal: Final testing, performance, deployment
- Remaining:
  - [ ] Edge function for lead email notifications
  - [ ] Image optimization / lazy loading review
  - [ ] Mobile responsiveness final pass
  - [ ] Admin onboarding / setup wizard polish
  - [ ] Analytics integration

---

## 7. Admin Panel Detailed Spec

### Sidebar Navigation (in order)
Dashboard · Listings · Neighborhoods · Agents · Leads · Deals · Homepage · Testimonials · Blog / Insights · Media Library · Navigation · Forms · SEO · Settings · Users / Roles

### Dashboard KPIs
- Total active listings, new leads this week, recent inquiries
- Featured properties count, leads by stage chart, top neighborhoods

### Listings Admin
- Add / Edit / Duplicate / Archive listings
- Mark featured, publish/unpublish, upload gallery
- Assign agent, filter by area / type / status
- Bulk actions (delete, change status, assign agent)
- Quick edit modal, extend expiry, card preview

### Neighborhoods Admin
- Add/edit areas, upload hero image, reorder featured areas
- Gallery uploader, lifestyle tags, highlights editor

### Homepage Admin
- Edit all section text live, replace banners, reorder/hide sections

### Leads Admin
- Auto-capture from all contact forms
- Assign staff, update stage, add notes, track follow-up, export CSV
- Kanban board view + list view

### Deals Admin
- Pipeline view with stage columns
- Deal value tracking, agent assignment

### Media Library
- Upload images, organize by folder/tag, reuse existing media
- Copy media URL, replace images without breaking layout
- Fields: file name, alt text, tags, linked content type, uploaded by, date

### Settings Admin
- Logo upload, brand colors, contact details, footer, social media, map defaults, currency settings
- Deep management pages for every site aspect

### Users Admin
- Invite users, assign roles, manage permissions
- Profile photos, password resets

---

## 8. Publishing Logic (all editable items)
- Draft / Published status
- Publish date + unpublish option
- Preview before publishing
- Applies to: Listings, Blog Posts, Homepage Sections, Pages

---

## 9. User Roles
| Role | Access |
|------|--------|
| Super Admin | Full access to everything |
| Admin | Listings, leads, homepage, media, settings |
| Editor | Content, blog, listings, neighborhoods — no critical settings |
| Sales / Agent | View listings, own leads only, add notes, update stages |

---

## 10. Dynamic Search Filters (from database)
Filters fed from DB: location, property type, bedrooms, bathrooms, price range, furnished, purpose, featured, availability
- Property types, neighborhoods, statuses, purposes — all DB-driven, never hardcoded

---

## 11. Currency System
- **Base currency**: USD (all prices stored in DB as USD)
- **Display currencies**: USD, UGX, EUR, GBP
- **Exchange rates**: Stored in `exchange_rates` table, fetched from public API or set manually per currency
- **Frontend conversion**: All prices converted dynamically based on selected currency — never changes stored data
- **Currency switcher**: Bold, visible in top bar right corner. Also visible in mobile menu
- **Default**: USD
- **Admin management**: Per-currency rate tabs in admin Settings → Currency page

---

## 12. Media Handling (Supabase Storage buckets)
- `listing-galleries` — property photos
- `neighborhood-images` — area hero images
- `homepage-banners` — hero/CTA backgrounds
- `agent-photos` — team headshots
- `blog-images` — article featured images
- `testimonial-photos` — client photos
- All uploads connected to Media Library in admin

---

## 13. URL & SEO Structure
Clean slugs: `/property/[slug]` · `/neighborhood/[slug]` · `/agent/[slug]` · `/blog/[slug]`
Per-page editable SEO: title, meta description, OG title, OG description, OG image

---

## 14. Forms & Lead Capture
| Form | Saves to DB | Admin visible |
|------|-------------|---------------|
| General Contact | ✅ | ✅ |
| Property Inquiry | ✅ | ✅ |
| Request Viewing | ✅ | ✅ |
| Valuation Request | ✅ | ✅ |
| Landlord Inquiry | ✅ | ✅ |
| Investor Inquiry | ✅ | ✅ |
Each lead: saved to DB, admin status updates, staff notes

---

## 15. Recent Changes Log

### April 2026
- **Mock data fully removed** — `src/mocks/` deleted, all pages use live Supabase data
- **Contact card shadows enhanced** — all 5 contact form cards now have visible shadow
- **All frontend pages verified** — zero hardcoded data arrays, zero mock imports
- **Project fully on real data** — every listing, neighborhood, agent, testimonial, blog post pulls from Supabase
- **Multi-currency system launched** — USD/UGX/EUR/GBP switcher in top bar, instant conversion across all pages, admin exchange rate management

---

## 16. Rule Going Forward
**No content is ever hardcoded. All pages fetch from Supabase.**