import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE } from '@/components/base/placeholders';

export interface NeighbourhoodCardData {
  id: string;
  name: string;
  slug: string;
  hero_image: string | null;
  description: string | null;
  listing_count: number;
  sale_count: number;
  rent_count: number;
}

const FALLBACK_IMGS: Record<string, string> = {
  kololo: PLACEHOLDER_IMAGE,
  nakasero: PLACEHOLDER_IMAGE,
  muyenga: PLACEHOLDER_IMAGE,
  bugolobi: PLACEHOLDER_IMAGE,
  naguru: PLACEHOLDER_IMAGE,
  ntinda: PLACEHOLDER_IMAGE,
  munyonyo: PLACEHOLDER_IMAGE,
  mbuya: PLACEHOLDER_IMAGE,
  lubowa: PLACEHOLDER_IMAGE,
};

function getFallback(slug: string): string {
  const key = Object.keys(FALLBACK_IMGS).find((k) => slug.toLowerCase().includes(k));
  return key
    ? FALLBACK_IMGS[key]
    : PLACEHOLDER_IMAGE;
}

interface Props {
  nb: NeighbourhoodCardData;
}

export default function NeighbourhoodCard({ nb }: Props) {
  const slug = nb.slug || nb.name.toLowerCase().replace(/\s+/g, '-');
  const image = nb.hero_image || getFallback(slug);

  return (
    <Link
      to={`/neighbourhood/${slug}`}
      className="group relative block overflow-hidden cursor-pointer h-full"
    >
      <div className="relative w-full h-full">
        <img
          src={image}
          alt={nb.name}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/25" />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />

        {/* Top: count + name */}
        <div className="absolute top-3.5 left-3.5 right-3.5">
          <p className="text-[11px] font-roboto text-white/75 tracking-wide leading-none mb-0.5">
            {nb.listing_count > 0
              ? `${nb.listing_count} Propert${nb.listing_count !== 1 ? 'ies' : 'y'}`
              : 'Kampala, Uganda'}
          </p>
          <h3 className="font-prata text-white text-base leading-tight group-hover:text-golden transition-colors duration-300">
            {nb.name}
          </h3>
        </div>

        {/* Bottom: MORE DETAILS */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3.5 pb-3.5">
          <span className="text-[9px] font-roboto font-bold uppercase tracking-[0.2em] text-white/80 group-hover:text-golden transition-colors duration-300 whitespace-nowrap">
            More Details
          </span>
          <div className="w-7 h-7 flex items-center justify-center border border-white/35 group-hover:border-golden group-hover:bg-golden/15 transition-all duration-300">
            <i className="ri-arrow-right-line text-white text-xs group-hover:text-golden transition-colors duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
