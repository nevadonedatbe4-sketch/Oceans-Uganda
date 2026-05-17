import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface DbNeighborhood {
  id: string;
  name: string;
  slug: string;
  hero_image: string | null;
  short_intro: string | null;
  sort_order: number | null;
}

interface NbItem {
  id: string;
  name: string;
  image: string;
  count: number;
  slug: string;
}

interface NbSettings {
  title: string;
  label: string;
  subtitle: string;
  padding: number;
  gap: number;
  bgColor: string;
  count: number;
  overlayOpacity: number;
  labelColor: string;
  titleColor: string;
  subtitleColor: string;
  gridLayout: 'mosaic' | 'grid3x3';
  mosaicHeight: number;
  showCta: boolean;
  ctaLabel: string;
  ctaLink: string;
  // Typography
  labelFontFamily: string;
  labelFontWeight: string;
  labelFontSize: string;
  labelLetterSpacing: string;
  labelTransform: string;
  titleFontFamily: string;
  titleFontWeight: string;
  titleFontSize: string;
  titleLetterSpacing: string;
  titleLineHeight: string;
  titleTransform: string;
  subtitleFontFamily: string;
  subtitleFontWeight: string;
  subtitleFontSize: string;
  subtitleLetterSpacing: string;
  subtitleLineHeight: string;
}

const DEFAULTS: NbSettings = {
  title: 'Kampala Prime Neighbourhoods',
  label: 'Explore',
  subtitle: 'Premium homes. Select locations. Expat representation.',
  padding: 10,
  gap: 3,
  bgColor: '#ffffff',
  count: 9,
  overlayOpacity: 55,
  labelColor: '#C9A84C',
  titleColor: '#001731',
  subtitleColor: '#6B7280',
  gridLayout: 'mosaic',
  mosaicHeight: 560,
  showCta: true,
  ctaLabel: 'View all neighbourhoods',
  ctaLink: '/neighbourhoods',
  labelFontFamily: '',
  labelFontWeight: '400',
  labelFontSize: '12',
  labelLetterSpacing: '0.3',
  labelTransform: 'uppercase',
  titleFontFamily: 'Prata',
  titleFontWeight: '400',
  titleFontSize: '36',
  titleLetterSpacing: '0',
  titleLineHeight: '1.2',
  titleTransform: 'none',
  subtitleFontFamily: '',
  subtitleFontWeight: '400',
  subtitleFontSize: '14',
  subtitleLetterSpacing: '0',
  subtitleLineHeight: '1.5',
};

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

interface NbCardProps {
  id: number;
  name: string;
  image: string;
  count: number;
  overlayOpacity: number;
  className?: string;
  style?: React.CSSProperties;
}

function NbCard({ id, name, image, count, overlayOpacity, className = '', style, sharp = false }: NbCardProps & { sharp?: boolean }) {
  return (
    <Link
      to={`/neighbourhood/${toSlug(name)}`}
      className={`relative overflow-hidden ${sharp ? 'rounded-none' : 'rounded-sm'} group cursor-pointer block ${className}`}
      style={style}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity / 100}) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.08) 100%)`,
        }}
      />
      <div className="absolute top-4 left-4">
        <p className="text-white/80 text-xs font-roboto font-medium tracking-wide">
          {count} Properties
        </p>
        <h3 className="text-white text-2xl font-prata leading-tight drop-shadow-sm mt-0.5">
          {name}
        </h3>
      </div>
      <div className="absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <i className="ri-arrow-right-up-line text-white text-xs" />
      </div>
    </Link>
  );
}

// ── V4 MOSAIC: col1 full-height | col2-4 two stacked | col5 full-height ──
function MosaicGrid({ items, gapPx, overlayOpacity, totalHeight }: { items: { id: number; name: string; image: string; count: number }[]; gapPx: number; overlayOpacity: number; totalHeight: number }) {
  const get = (idx: number) => items[idx];

  const topH = Math.round(totalHeight * 0.46);
  const botH = totalHeight - topH - gapPx;

  return (
    <div
      className="hidden md:grid"
      style={{
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gap: `${gapPx}px`,
        height: `${totalHeight}px`,
      }}
    >
      {/* Col 1 — full height */}
      {get(0) && (
        <NbCard
          {...get(0)}
          overlayOpacity={overlayOpacity}
          style={{ height: '100%' }}
        />
      )}

      {/* Col 2 — two stacked */}
      <div className="flex flex-col" style={{ gap: `${gapPx}px` }}>
        {get(1) && (
          <NbCard
            {...get(1)}
            overlayOpacity={overlayOpacity}
            style={{ height: `${topH}px` }}
          />
        )}
        {get(2) && (
          <NbCard
            {...get(2)}
            overlayOpacity={overlayOpacity}
            style={{ height: `${botH}px` }}
          />
        )}
      </div>

      {/* Col 3 — two stacked (reversed heights for variety) */}
      <div className="flex flex-col" style={{ gap: `${gapPx}px` }}>
        {get(3) && (
          <NbCard
            {...get(3)}
            overlayOpacity={overlayOpacity}
            style={{ height: `${botH}px` }}
          />
        )}
        {get(4) && (
          <NbCard
            {...get(4)}
            overlayOpacity={overlayOpacity}
            style={{ height: `${topH}px` }}
          />
        )}
      </div>

      {/* Col 4 — two stacked */}
      <div className="flex flex-col" style={{ gap: `${gapPx}px` }}>
        {get(5) && (
          <NbCard
            {...get(5)}
            overlayOpacity={overlayOpacity}
            style={{ height: `${topH}px` }}
          />
        )}
        {get(6) && (
          <NbCard
            {...get(6)}
            overlayOpacity={overlayOpacity}
            style={{ height: `${botH}px` }}
          />
        )}
      </div>

      {/* Col 5 — full height */}
      {get(7) && (
        <NbCard
          {...get(7)}
          overlayOpacity={overlayOpacity}
          style={{ height: '100%' }}
        />
      )}
    </div>
  );
}

// ── 3×3 EQUAL GRID ──
function EqualGrid({ items, gapPx, overlayOpacity }: { items: { id: number; name: string; image: string; count: number }[]; gapPx: number; overlayOpacity: number }) {
  return (
    <div
      className="hidden md:grid md:grid-cols-3"
      style={{ gap: `${gapPx}px` }}
    >
      {items.map((nb) => (
        <NbCard
          key={nb.id}
          {...nb}
          overlayOpacity={overlayOpacity}
          sharp
          style={{ height: '280px' }}
        />
      ))}
    </div>
  );
}

// ── MOBILE COMPACT CARD (mobile-only, different from desktop NbCard) ──
const MOBILE_DESCRIPTORS: Record<string, string> = {
  kololo: 'Diplomatic · Upscale · Hilltop',
  nakasero: 'CBD Adjacent · Business Hub',
  muyenga: 'Lake Views · Expat Favourite',
  bugolobi: 'Modern · Walkable · Mixed Use',
  naguru: 'Panoramic · Quiet · Residential',
  ntinda: 'Vibrant · Commercial · Accessible',
  munyonyo: 'Lakeside · Resort Feel · Exclusive',
  mbuya: 'Lakeside · Serene · Residential',
  lubowa: 'Gated · New Dev · Family',
  kyanja: 'Suburban · Growing · Affordable',
  kiwatule: 'Suburban · Accessible · Family',
  kulambiro: 'Quiet · Residential · Green',
};

function getMobileDescriptor(slug: string): string {
  const key = Object.keys(MOBILE_DESCRIPTORS).find((k) => slug.toLowerCase().includes(k));
  return key ? MOBILE_DESCRIPTORS[key] : 'Residential · Kampala';
}

function MobileNbCard({ name, image, slug, overlayOpacity, className = '', style }: { name: string; image: string; slug: string; overlayOpacity: number; className?: string; style?: React.CSSProperties }) {
  const descriptor = getMobileDescriptor(slug);
  return (
    <Link
      to={`/neighbourhood/${slug}`}
      className={`relative overflow-hidden block group cursor-pointer rounded-sm ${className}`}
      style={style}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity / 100}) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 100%)`,
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <h3 className="text-white text-xs font-prata leading-tight drop-shadow-sm">{name}</h3>
        <p className="text-white/65 text-[9px] font-roboto mt-0.5 leading-tight">{descriptor}</p>
      </div>
    </Link>
  );
}

// ── MOBILE MOSAIC GRID: 2-col masonry with 10 items ──
function MobileMosaicGrid({ items, gapPx, overlayOpacity }: { items: { id: number; name: string; image: string; count: number; slug: string }[]; gapPx: number; overlayOpacity: number }) {
  const tileHeight = 118;
  const tallHeight = tileHeight * 2 + gapPx;

  // masonry pattern: tall, short, short, tall, short, short, tall, short, short, short
  const spans = [2, 1, 1, 2, 1, 1, 2, 1, 1, 1];

  return (
    <div
      className="grid grid-cols-2 md:hidden"
      style={{
        gap: `${gapPx}px`,
        gridAutoFlow: 'dense',
      }}
    >
      {items.slice(0, 10).map((nb, i) => {
        const isTall = spans[i] === 2;
        return (
          <MobileNbCard
            key={nb.id}
            name={nb.name}
            image={nb.image}
            slug={nb.slug || nb.name.toLowerCase().replace(/\s+/g, '-')}
            overlayOpacity={overlayOpacity}
            className={isTall ? 'row-span-2' : ''}
            style={{ height: isTall ? `${tallHeight}px` : `${tileHeight}px` }}
          />
        );
      })}
    </div>
  );
}

// Neighborhoods section — live from Supabase
export default function NeighborhoodsSection() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'editor';
  const [cfg, setCfg] = useState<NbSettings>(DEFAULTS);
  const [show, setShow] = useState(true);
  const [dbNeighborhoods, setDbNeighborhoods] = useState<NbItem[]>([]);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .eq('setting_group', 'neighborhoods_settings')
      .then(({ data }) => {
        if (!data) return;
        const m: Record<string, string> = {};
        data.forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
        setShow(m.nb_show_section !== 'false');
        setCfg({
          title: m.nb_section_title ?? DEFAULTS.title,
          label: m.nb_section_label ?? DEFAULTS.label,
          subtitle: m.nb_section_subtitle ?? DEFAULTS.subtitle,
          padding: Number(m.nb_section_padding ?? DEFAULTS.padding),
          gap: Number(m.nb_card_gap ?? DEFAULTS.gap),
          bgColor: m.nb_bg_color ?? DEFAULTS.bgColor,
          count: Number(m.nb_show_count ?? DEFAULTS.count),
          overlayOpacity: Number(m.nb_overlay_opacity ?? DEFAULTS.overlayOpacity),
          labelColor: m.nb_label_color ?? DEFAULTS.labelColor,
          titleColor: m.nb_title_color ?? DEFAULTS.titleColor,
          subtitleColor: m.nb_subtitle_color ?? DEFAULTS.subtitleColor,
          gridLayout: (m.nb_grid_layout as NbSettings['gridLayout']) ?? DEFAULTS.gridLayout,
          mosaicHeight: Number(m.nb_mosaic_height ?? DEFAULTS.mosaicHeight),
          showCta: m.nb_show_cta !== 'false',
          ctaLabel: m.nb_cta_label ?? DEFAULTS.ctaLabel,
          ctaLink: m.nb_cta_link ?? DEFAULTS.ctaLink,
          labelFontFamily: m.nb_label_font_family ?? DEFAULTS.labelFontFamily,
          labelFontWeight: m.nb_label_font_weight ?? DEFAULTS.labelFontWeight,
          labelFontSize: m.nb_label_font_size ?? DEFAULTS.labelFontSize,
          labelLetterSpacing: m.nb_label_letter_spacing ?? DEFAULTS.labelLetterSpacing,
          labelTransform: m.nb_label_transform ?? DEFAULTS.labelTransform,
          titleFontFamily: m.nb_title_font_family ?? DEFAULTS.titleFontFamily,
          titleFontWeight: m.nb_title_font_weight ?? DEFAULTS.titleFontWeight,
          titleFontSize: m.nb_title_font_size ?? DEFAULTS.titleFontSize,
          titleLetterSpacing: m.nb_title_letter_spacing ?? DEFAULTS.titleLetterSpacing,
          titleLineHeight: m.nb_title_line_height ?? DEFAULTS.titleLineHeight,
          titleTransform: m.nb_title_transform ?? DEFAULTS.titleTransform,
          subtitleFontFamily: m.nb_subtitle_font_family ?? DEFAULTS.subtitleFontFamily,
          subtitleFontWeight: m.nb_subtitle_font_weight ?? DEFAULTS.subtitleFontWeight,
          subtitleFontSize: m.nb_subtitle_font_size ?? DEFAULTS.subtitleFontSize,
          subtitleLetterSpacing: m.nb_subtitle_letter_spacing ?? DEFAULTS.subtitleLetterSpacing,
          subtitleLineHeight: m.nb_subtitle_line_height ?? DEFAULTS.subtitleLineHeight,
        });
      });
  }, []);

  // Fetch neighborhoods + listing counts from Supabase
  useEffect(() => {
    async function fetchNeighborhoods() {
      const { data: nbData } = await supabase
        .from('neighborhoods')
        .select('id, name, slug, hero_image, short_intro, sort_order')
        .order('sort_order', { ascending: true });

      if (!nbData || nbData.length === 0) {
        setDbNeighborhoods([]);
        return;
      }

      // Fetch listing counts per neighborhood
      const { data: listingCounts } = await supabase
        .from('listings')
        .select('neighborhood_id');

      const countMap: Record<string, number> = {};
      (listingCounts ?? []).forEach((l: { neighborhood_id: string | null }) => {
        if (l.neighborhood_id) {
          countMap[l.neighborhood_id] = (countMap[l.neighborhood_id] || 0) + 1;
        }
      });

      const FALLBACK_IMGS: Record<string, string> = {
        'kololo': 'https://readdy.ai/api/search-image?query=Kololo%20Kampala%20Uganda%20dramatic%20aerial%20skyline%20panorama%20hilltop%20neighbourhood%20elevated%20city%20view%20dense%20tropical%20canopy%20luxury%20rooftops%20emerging%20above%20lush%20green%20trees%20golden%20hour%20light%20sweeping%20urban%20landscape%20photography&width=600&height=800&seq=nb_kololo_sky&orientation=portrait',
        'nakasero': 'https://readdy.ai/api/search-image?query=Nakasero%20Hill%20Kampala%20Uganda%20city%20skyline%20aerial%20view%20central%20business%20district%20modern%20office%20towers%20mixed%20high%20rise%20buildings%20dense%20urban%20core%20sunset%20warm%20amber%20glow%20panoramic%20cityscape&width=600&height=400&seq=nb_nakasero_sky&orientation=landscape',
        'muyenga': 'https://readdy.ai/api/search-image?query=Muyenga%20Kampala%20Uganda%20scenic%20hilltop%20skyline%20panorama%20Lake%20Victoria%20shimmering%20water%20visible%20in%20background%20lush%20green%20valley%20luxury%20rooftops%20tropical%20trees%20golden%20dusk%20light%20dramatic%20wide%20angle&width=600&height=800&seq=nb_muyenga_sky&orientation=portrait',
        'bugolobi': 'https://readdy.ai/api/search-image?query=Bugolobi%20Kampala%20Uganda%20modern%20urban%20skyline%20aerial%20view%20contemporary%20apartment%20blocks%20mixed%20residential%20commercial%20buildings%20wide%20organized%20streets%20tropical%20tree%20lined%20avenues%20bright%20daytime&width=600&height=400&seq=nb_bugolobi_sky&orientation=landscape',
        'naguru': 'https://readdy.ai/api/search-image?query=Naguru%20Kampala%20Uganda%20hilltop%20panoramic%20skyline%20aerial%20sweeping%20view%20over%20Kampala%20city%20rolling%20green%20hills%20dense%20tropical%20vegetation%20luxury%20villas%20rooftops%20peaking%20through%20canopy%20dramatic%20sky&width=600&height=800&seq=nb_naguru_sky&orientation=portrait',
        'ntinda': 'https://readdy.ai/api/search-image?query=Ntinda%20Kampala%20Uganda%20vibrant%20suburban%20skyline%20aerial%20view%20busy%20commercial%20residential%20neighbourhood%20mix%20of%20modern%20and%20traditional%20buildings%20wide%20roads%20tropical%20trees%20overhead%20drone%20photography&width=600&height=400&seq=nb_ntinda_sky&orientation=landscape',
        'munyonyo': 'https://readdy.ai/api/search-image?query=Munyonyo%20Kampala%20Uganda%20lakeside%20skyline%20aerial%20view%20Lake%20Victoria%20shoreline%20premium%20residential%20area%20lush%20green%20slopes%20luxury%20homes%20descending%20toward%20shimmering%20lake%20water%20dramatic%20aerial%20landscape&width=600&height=800&seq=nb_munyonyo_sky&orientation=portrait',
        'mbuya': 'https://readdy.ai/api/search-image?query=Mbuya%20Kampala%20Uganda%20lakeside%20skyline%20aerial%20view%20Lake%20Victoria%20shoreline%20premium%20residential%20area%20lush%20green%20slopes%20luxury%20homes%20descending%20toward%20shimmering%20lake%20water%20dramatic%20aerial%20landscape&width=600&height=400&seq=nb_mbuya_sky&orientation=landscape',
        'lubowa': 'https://readdy.ai/api/search-image?query=Lubowa%20Kampala%20Uganda%20upscale%20gated%20suburb%20aerial%20skyline%20view%20new%20development%20wide%20pristine%20boulevards%20modern%20luxury%20villa%20rooftops%20manicured%20gardens%20lush%20tropical%20greenery%20serene%20affluent%20community&width=600&height=800&seq=nb_lubowa_sky&orientation=portrait',
      };

      const items: NbItem[] = (nbData as DbNeighborhood[]).map((nb) => {
        const slugKey = nb.slug?.toLowerCase() || nb.name.toLowerCase();
        const fallbackImg = FALLBACK_IMGS[slugKey] || FALLBACK_IMGS[Object.keys(FALLBACK_IMGS).find(k => slugKey.includes(k)) || ''] || 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20luxury%20residential%20neighbourhood%20aerial%20tropical%20greenery%20premium%20homes%20scenic%20wide%20roads%20sunny%20day&width=600&height=400&seq=nb-generic&orientation=landscape';
        return {
          id: nb.id,
          name: nb.name,
          slug: nb.slug || nb.name.toLowerCase().replace(/\s+/g, '-'),
          image: nb.hero_image || fallbackImg,
          count: countMap[nb.id] || 0,
        };
      });

      setDbNeighborhoods(items);
    }
    fetchNeighborhoods();
  }, []);

  if (!show) return null;

  const items = dbNeighborhoods.slice(0, Math.min(cfg.count, dbNeighborhoods.length));
  const gapPx = cfg.gap * 4;

  // Use DB neighborhoods for all grids — same NbCard component but with db data
  const nbItems = items.map((n) => ({
    id: Number(n.id.slice(0, 8).replace(/-/g, '').slice(0, 8)) || Math.random(),
    name: n.name,
    image: n.image,
    count: n.count,
    slug: n.slug,
  }));

  // Desktop mosaic uses the first 8 items; mobile shows ALL items in its own compact grid
  const DESKTOP_MOSAIC_COUNT = cfg.gridLayout === 'mosaic' ? 8 : nbItems.length;

  return (
    <section
      id="neighborhoods"
      style={{
        backgroundColor: cfg.bgColor,
        paddingTop: `${cfg.padding * 4}px`,
        paddingBottom: `${cfg.padding * 4}px`,
      }}
      className="relative px-3 md:px-6"
    >
      {/* Admin Edit Shortcut */}
      {isAdmin && (
        <Link
          to="/admin/management/neighborhoods"
          className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white transition-all duration-200 whitespace-nowrap cursor-pointer border border-stone-200"
        >
          <i className="ri-edit-2-line text-sm" />
          Edit Neighbourhoods
        </Link>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <p
            className="mb-1 md:mb-2.5 font-roboto text-xs md:text-sm font-semibold uppercase tracking-[0.35em] md:tracking-[0.4em] whitespace-nowrap"
            style={{ color: cfg.labelColor }}
          >
            {cfg.label}
          </p>
          <h2
            className="mb-1 md:mb-2.5"
            style={{
              color: cfg.titleColor,
              fontFamily: cfg.titleFontFamily || undefined,
              fontWeight: cfg.titleFontWeight || '400',
              fontSize: cfg.titleFontSize ? `clamp(1.75rem, ${Number(cfg.titleFontSize) * 0.04}vw + 1rem, ${cfg.titleFontSize}px)` : undefined,
              letterSpacing: cfg.titleLetterSpacing ? `${cfg.titleLetterSpacing}em` : undefined,
              lineHeight: cfg.titleLineHeight || '1.2',
              textTransform: (cfg.titleTransform || 'none') as 'none' | 'uppercase' | 'capitalize' | 'lowercase',
            }}
          >
            {cfg.title}
          </h2>
          <p
            className="text-xs md:text-sm uppercase tracking-[0.25em] md:tracking-[0.3em] font-roboto font-medium"
            style={{
              color: cfg.labelColor,
              fontFamily: cfg.subtitleFontFamily || undefined,
              fontWeight: cfg.subtitleFontWeight || '400',
              letterSpacing: cfg.subtitleLetterSpacing ? `${cfg.subtitleLetterSpacing}em` : undefined,
              lineHeight: cfg.subtitleLineHeight || '1.5',
            }}
          >
            {cfg.subtitle}
          </p>
        </div>

        {nbItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 bg-gray-100 animate-pulse rounded" />)}
          </div>
        ) : (
          <>
            {/* ── DESKTOP: existing grids (unchanged) ── */}
            {cfg.gridLayout === 'mosaic'
              ? <MosaicGrid items={nbItems} gapPx={gapPx} overlayOpacity={cfg.overlayOpacity} totalHeight={cfg.mosaicHeight} />
              : <EqualGrid items={nbItems} gapPx={gapPx} overlayOpacity={cfg.overlayOpacity} />
            }

            {/* ── MOBILE: mosaic grid — hidden on md+ — shows 10 neighbourhoods ── */}
            <div className="md:hidden">
              {nbItems.length > 0 && (
                <MobileMosaicGrid
                  items={nbItems}
                  gapPx={Math.max(gapPx, 6)}
                  overlayOpacity={cfg.overlayOpacity}
                />
              )}
              {/* View All button — mobile only */}
              <div className="flex justify-center mt-5">
                <Link
                  to="/neighbourhoods"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-roboto font-medium tracking-wider uppercase cursor-pointer whitespace-nowrap hover:bg-primary/90 transition-colors"
                >
                  Explore All Neighbourhoods
                  <i className="ri-arrow-right-line text-xs" />
                </Link>
              </div>
            </div>
          </>
        )}

        {/* CTA Button — desktop only */}
        {cfg.showCta && (
          <div className="hidden md:flex justify-center mt-8">
            <Link
              to={cfg.ctaLink || '/neighbourhoods'}
              className="inline-flex items-center gap-2.5 px-7 py-3 border border-stone-300 text-sm font-roboto font-medium text-stone-700 hover:border-stone-800 hover:text-stone-900 hover:bg-[#f5f5f5] transition-all duration-200 whitespace-nowrap group"
            >
              {cfg.ctaLabel || 'View all neighbourhoods'}
              <span className="w-5 h-5 flex items-center justify-center bg-stone-100 group-hover:bg-stone-200 transition-colors">
                <i className="ri-arrow-right-line text-xs" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
