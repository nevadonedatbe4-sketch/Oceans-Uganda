interface GuideData {
  highlights: string[];
  lifestyle: string;
  bestFor: string[];
  avgPriceSale?: string;
  avgPriceRent?: string;
}

const GUIDES: Record<string, GuideData> = {
  kololo: {
    highlights: ['Home to most foreign embassies', 'Highest elevation in Kampala', 'Excellent security & infrastructure', 'Close to Kampala Golf Club'],
    lifestyle: 'Kololo is Kampala\'s most prestigious address — a leafy, elevated enclave favoured by diplomats, senior executives, and Uganda\'s elite. Wide, tree-lined avenues, manicured gardens, and a calm atmosphere set it apart from the bustle below.',
    bestFor: ['Diplomats', 'Executives', 'Luxury Buyers', 'Long-term Expats'],
    avgPriceSale: '$500K – $3M+',
    avgPriceRent: '$3,000 – $8,000/mo',
  },
  muyenga: {
    highlights: ['Panoramic Lake Victoria views', 'Strong expat community', 'Great restaurants & cafés', 'Quiet hilltop setting'],
    lifestyle: 'Muyenga is the expat heartland of Kampala. Perched on a hill with sweeping views of Lake Victoria, it offers a relaxed, village-like atmosphere while remaining just 15 minutes from the city centre.',
    bestFor: ['Expats', 'Families', 'Renters', 'Lake View Seekers'],
    avgPriceSale: '$200K – $800K',
    avgPriceRent: '$1,500 – $4,000/mo',
  },
  nakasero: {
    highlights: ['Central location', 'Walking distance to CBD', 'Best hotels & restaurants', 'High-rise apartment options'],
    lifestyle: 'Nakasero sits at the commercial and social heart of Kampala. It\'s the address of choice for professionals who want to walk to work, enjoy rooftop dining, and be at the centre of everything.',
    bestFor: ['Professionals', 'Short-term Renters', 'Investors', 'City Lovers'],
    avgPriceSale: '$150K – $1M',
    avgPriceRent: '$1,200 – $5,000/mo',
  },
  bugolobi: {
    highlights: ['Most walkable neighbourhood', 'Excellent dining scene', 'Modern apartment stock', 'Close to Nakasero'],
    lifestyle: 'Bugolobi has transformed into one of Kampala\'s most desirable urban neighbourhoods. Modern apartment complexes, great coffee shops, and a vibrant social scene make it a top pick for young professionals.',
    bestFor: ['Young Professionals', 'Couples', 'Short-term Renters', 'Foodies'],
    avgPriceSale: '$100K – $500K',
    avgPriceRent: '$800 – $2,500/mo',
  },
  naguru: {
    highlights: ['Panoramic city views', 'Quiet residential streets', 'Large plot sizes', 'Family-friendly'],
    lifestyle: 'Naguru offers the best of both worlds — sweeping views over Kampala and a peaceful, residential atmosphere. Large plots, spacious homes, and a strong sense of community make it ideal for families.',
    bestFor: ['Families', 'Long-term Residents', 'Garden Lovers', 'Quiet Seekers'],
    avgPriceSale: '$150K – $600K',
    avgPriceRent: '$1,000 – $3,000/mo',
  },
  munyonyo: {
    highlights: ['Lake Victoria waterfront', 'Munyonyo Commonwealth Resort', 'Exclusive gated estates', 'Resort-style living'],
    lifestyle: 'Munyonyo is where Kampala\'s most exclusive waterfront properties are found. Home to the famous Munyonyo Commonwealth Resort, this neighbourhood offers a resort-like lifestyle with direct lake access.',
    bestFor: ['Luxury Buyers', 'Investors', 'Lake Lovers', 'Privacy Seekers'],
    avgPriceSale: '$500K – $3M+',
    avgPriceRent: '$2,500 – $7,000/mo',
  },
};

const DEFAULT_GUIDE: GuideData = {
  highlights: ['Established residential area', 'Good road access', 'Growing property market', 'Community amenities'],
  lifestyle: 'A well-established Kampala neighbourhood offering a mix of residential properties, good infrastructure, and easy access to the city\'s amenities.',
  bestFor: ['Families', 'Professionals', 'Investors'],
};

function getGuide(slug: string): GuideData {
  const key = Object.keys(GUIDES).find((k) => slug.toLowerCase().includes(k));
  return key ? GUIDES[key] : DEFAULT_GUIDE;
}

interface NbGuideSectionProps {
  slug: string;
  name: string;
}

export default function NbGuideSection({ slug, name }: NbGuideSectionProps) {
  const guide = getGuide(slug);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 border-b border-stone-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left: lifestyle text */}
        <div className="lg:col-span-2">
          <p className="text-[11px] font-roboto font-bold uppercase tracking-widest text-golden mb-2">Area Guide</p>
          <h2 className="font-prata text-primary text-xl md:text-2xl mb-4">Living in {name}</h2>
          <p className="text-stone-500 font-roboto text-sm leading-relaxed mb-6">{guide.lifestyle}</p>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {guide.highlights.map((h) => (
              <div key={h} className="flex items-start gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="ri-checkbox-circle-fill text-golden text-base" />
                </div>
                <span className="text-stone-600 font-roboto text-sm">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: quick facts */}
        <div className="space-y-4">
          {/* Best for */}
          <div className="bg-[#f5f5f5] rounded-xl p-5 border border-stone-100">
            <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400 mb-3">Best For</p>
            <div className="flex flex-wrap gap-2">
              {guide.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/8 text-primary text-xs font-roboto rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Price guide */}
          {(guide.avgPriceSale || guide.avgPriceRent) && (
            <div className="bg-[#f5f5f5] rounded-xl p-5 border border-stone-100">
              <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400 mb-3">Price Guide</p>
              <div className="space-y-2.5">
                {guide.avgPriceSale && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-roboto text-stone-500">
                      <i className="ri-price-tag-3-line text-golden text-sm" />
                      For Sale
                    </div>
                    <span className="text-primary font-roboto text-xs font-semibold">{guide.avgPriceSale}</span>
                  </div>
                )}
                {guide.avgPriceRent && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-roboto text-stone-500">
                      <i className="ri-key-2-line text-golden text-sm" />
                      To Let
                    </div>
                    <span className="text-primary font-roboto text-xs font-semibold">{guide.avgPriceRent}</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-stone-400 font-roboto mt-3">Indicative ranges only. Contact us for current valuations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
