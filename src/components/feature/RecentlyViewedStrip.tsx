import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export default function RecentlyViewedStrip() {
  const { items, clearAll } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="w-full bg-[#f8f6f2] border-t border-gray-100 py-10 px-5 md:px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-roboto text-golden uppercase tracking-widest mb-1">Your History</p>
          <h2 className="font-prata text-primary text-xl md:text-2xl">Recently Viewed</h2>
        </div>
        <button
          onClick={clearAll}
          className="text-xs font-roboto text-text-gray hover:text-primary transition-colors cursor-pointer whitespace-nowrap underline underline-offset-2"
        >
          Clear all
        </button>
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/property/${item.slug}`}
            className="flex-shrink-0 w-56 bg-white border border-gray-100 overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 rounded-sm"
            style={{ boxShadow: '0 2px 10px rgba(0,23,49,0.07)' }}
          >
            {/* Image */}
            <div className="relative w-full h-36 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              {/* Clock badge */}
              <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/40 rounded-full">
                <i className="ri-time-line text-white text-xs" />
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-[10px] font-roboto text-text-gray mb-0.5 flex items-center gap-1 truncate">
                <i className="ri-map-pin-line text-golden text-xs" />
                {item.location}
              </p>
              <h4 className="text-xs font-roboto font-semibold text-primary line-clamp-2 group-hover:text-[#0D5959] transition-colors leading-snug mb-1.5">
                {item.title}
              </h4>
              <p className="font-prata text-primary text-sm font-semibold">{item.price}</p>
              {item.beds !== null && (
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-text-gray font-roboto">
                  <span className="flex items-center gap-0.5 whitespace-nowrap">
                    <i className="ri-hotel-bed-line text-golden" /> {item.beds} bd
                  </span>
                  {item.baths !== null && (
                    <span className="flex items-center gap-0.5 whitespace-nowrap">
                      <img
                        src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/eb69730b-498d-4003-a1ed-d99751a53d5c_218-2188448_bathtub-shower-comments-bathroom-icon-png.png?v=0a25a96732facd626d36b15d1ce0735c"
                        alt="Bath"
                        className="w-3.5 h-3.5 object-contain"
                      />
                      {' '}{item.baths} ba
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
