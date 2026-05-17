interface AllPropertiesHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  neighborhoodTabs: string[];
  totalCount: number;
}

export default function AllPropertiesHeader({
  activeTab,
  onTabChange,
  neighborhoodTabs,
  totalCount,
}: AllPropertiesHeaderProps) {
  return (
    <div className="w-full bg-white">
      {/* ─── Hero text ─── */}
      <div className="text-center py-10 px-6">
        <div className="w-8 h-8 flex items-center justify-center mx-auto mb-3">
          <i className="ri-map-pin-2-fill text-primary text-2xl" />
        </div>
        <h1 className="font-prata text-primary text-3xl md:text-4xl mb-3">
          Homes in Kampala, Uganda
        </h1>
        <p className="text-stone-400 font-roboto text-sm mb-1">
          We&apos;ve recently added some new properties.
        </p>
        <p className="text-stone-400 font-roboto text-sm">
          Find the perfect home for you in Uganda. Search all available properties and find the one that suits your needs.
        </p>
        <p className="text-stone-500 font-roboto text-xs mt-3">
          <span className="text-primary font-semibold">{totalCount}</span> {totalCount === 1 ? 'property' : 'properties'} available
        </p>
      </div>

      {/* ─── Neighbourhood pill tabs ─── */}
      <div className="border-t border-gray-100 px-4 md:px-10 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-0 min-w-max">
          {neighborhoodTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-5 py-3.5 text-xs font-roboto font-semibold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-stone-400 hover:text-primary hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}