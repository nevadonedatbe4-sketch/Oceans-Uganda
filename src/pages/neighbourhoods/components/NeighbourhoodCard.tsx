import { Link } from 'react-router-dom';

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
  kololo: 'https://readdy.ai/api/search-image?query=Kololo%20Kampala%20Uganda%20hilltop%20luxury%20residential%20neighbourhood%20aerial%20view%20lush%20tropical%20canopy%20elegant%20villas%20golden%20hour%20warm%20light%20sweeping%20city%20panorama%20beautiful&width=700&height=500&seq=nb_hz_kololo&orientation=landscape',
  nakasero: 'https://readdy.ai/api/search-image?query=Nakasero%20Hill%20Kampala%20Uganda%20central%20business%20district%20modern%20buildings%20aerial%20view%20city%20skyline%20warm%20sunset%20amber%20glow%20urban%20panorama%20beautiful%20landscape&width=700&height=500&seq=nb_hz_nakasero&orientation=landscape',
  muyenga: 'https://readdy.ai/api/search-image?query=Muyenga%20Kampala%20Uganda%20hilltop%20Lake%20Victoria%20view%20luxury%20homes%20lush%20green%20valley%20tropical%20trees%20golden%20dusk%20light%20scenic%20residential%20area%20beautiful&width=700&height=500&seq=nb_hz_muyenga&orientation=landscape',
  bugolobi: 'https://readdy.ai/api/search-image?query=Bugolobi%20Kampala%20Uganda%20modern%20urban%20residential%20neighbourhood%20contemporary%20apartment%20blocks%20wide%20tree%20lined%20streets%20bright%20daytime%20aerial%20view%20beautiful&width=700&height=500&seq=nb_hz_bugolobi&orientation=landscape',
  naguru: 'https://readdy.ai/api/search-image?query=Naguru%20Kampala%20Uganda%20hilltop%20panoramic%20view%20rolling%20green%20hills%20dense%20tropical%20vegetation%20luxury%20villas%20rooftops%20dramatic%20sky%20residential%20beautiful%20area&width=700&height=500&seq=nb_hz_naguru&orientation=landscape',
  ntinda: 'https://readdy.ai/api/search-image?query=Ntinda%20Kampala%20Uganda%20vibrant%20suburban%20neighbourhood%20busy%20commercial%20residential%20mix%20modern%20buildings%20wide%20roads%20tropical%20trees%20overhead%20beautiful&width=700&height=500&seq=nb_hz_ntinda&orientation=landscape',
  munyonyo: 'https://readdy.ai/api/search-image?query=Munyonyo%20Kampala%20Uganda%20lakeside%20premium%20residential%20area%20Lake%20Victoria%20shoreline%20luxury%20homes%20lush%20green%20slopes%20shimmering%20water%20aerial%20beautiful&width=700&height=500&seq=nb_hz_munyonyo&orientation=landscape',
  mbuya: 'https://readdy.ai/api/search-image?query=Mbuya%20Kampala%20Uganda%20serene%20lakeside%20residential%20neighbourhood%20Lake%20Victoria%20views%20lush%20green%20tropical%20trees%20quiet%20streets%20premium%20homes%20beautiful&width=700&height=500&seq=nb_hz_mbuya&orientation=landscape',
  lubowa: 'https://readdy.ai/api/search-image?query=Lubowa%20Kampala%20Uganda%20upscale%20gated%20suburb%20new%20development%20wide%20pristine%20boulevards%20modern%20luxury%20villa%20rooftops%20manicured%20gardens%20serene%20affluent%20beautiful&width=700&height=500&seq=nb_hz_lubowa&orientation=landscape',
};

function getFallback(slug: string): string {
  const key = Object.keys(FALLBACK_IMGS).find((k) => slug.toLowerCase().includes(k));
  return key
    ? FALLBACK_IMGS[key]
    : 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20luxury%20residential%20neighbourhood%20aerial%20view%20lush%20tropical%20greenery%20premium%20gated%20community%20homes%20scenic%20wide%20roads%20golden%20hour%20light%20dramatic%20sky%20beautiful&width=700&height=500&seq=nb-hz-fallback&orientation=landscape';
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
