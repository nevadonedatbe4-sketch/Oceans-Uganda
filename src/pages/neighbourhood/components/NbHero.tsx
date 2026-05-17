import { Link, useParams } from 'react-router-dom';

interface NbHeroProps {
  name: string;
  image: string;
  totalCount: number;
  saleCount: number;
  rentCount: number;
}

export default function NbHero({ name, image, totalCount, saleCount, rentCount }: NbHeroProps) {
  const { slug = '' } = useParams<{ slug: string }>();
  return (
    <div className="relative w-full" style={{ height: '420px' }}>
      {/* Background image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover object-top"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-primary/20" />

      {/* Breadcrumb */}
      <div className="absolute top-0 left-0 right-0 pt-28 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-white/60 text-xs font-roboto">
            <Link to="/" className="hover:text-white transition-colors cursor-pointer whitespace-nowrap">Home</Link>
            <i className="ri-arrow-right-s-line" />
            <button
              onClick={() => {
                const el = document.getElementById('neighborhoods');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Neighbourhoods
            </button>
            <i className="ri-arrow-right-s-line" />
            <span className="text-white/90">{name}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-golden text-xs font-roboto tracking-[0.3em] uppercase mb-2">Neighbourhood</p>
          <h1 className="text-4xl md:text-5xl font-prata text-white mb-5">{name}</h1>

          {/* History link */}
          <Link
            to={`/neighbourhood/${slug}/history`}
            className="inline-flex items-center gap-2 mb-5 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/25 text-white text-xs font-roboto uppercase tracking-widest rounded-full hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-history-line text-golden text-sm" />
            History &amp; Character
            <i className="ri-arrow-right-line text-xs" />
          </Link>

          {/* Stat pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
              <i className="ri-building-2-line text-golden text-sm" />
              <span className="text-white text-sm font-roboto">
                <strong className="font-prata">{totalCount}</strong> Total Listings
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
              <i className="ri-price-tag-3-line text-golden text-sm" />
              <span className="text-white text-sm font-roboto">
                <strong className="font-prata">{saleCount}</strong> For Sale
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
              <i className="ri-key-2-line text-golden text-sm" />
              <span className="text-white text-sm font-roboto">
                <strong className="font-prata">{rentCount}</strong> To Let
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
