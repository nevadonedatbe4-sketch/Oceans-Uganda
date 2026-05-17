interface NbFilterBarProps {
  purposeFilter: 'all' | 'sale' | 'rent';
  setPurposeFilter: (v: 'all' | 'sale' | 'rent') => void;
  bedsFilter: string;
  setBedsFilter: (v: string) => void;
  priceFilter: string;
  setPriceFilter: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  total: number;
}

const bedsOptions = ['Any Beds', '1+', '2+', '3+', '4+', '5+'];
const priceOptions = ['Any Price', 'Under $100K', '$100K–300K', '$300K–500K', 'Over $500K'];

export default function NbFilterBar({
  purposeFilter, setPurposeFilter,
  bedsFilter, setBedsFilter,
  priceFilter, setPriceFilter,
  search, setSearch,
  total,
}: NbFilterBarProps) {
  return (
    <div className="bg-white border-b border-stone-100 sticky top-[88px] z-30">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Purpose tabs */}
          <div className="flex items-center bg-stone-100 rounded-full p-1">
            {(['all', 'sale', 'rent'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPurposeFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-roboto font-medium transition-all cursor-pointer whitespace-nowrap ${
                  purposeFilter === tab
                    ? 'bg-primary text-white'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'sale' ? 'For Sale' : 'To Let'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings..."
              className="w-full border border-stone-200 rounded-md pl-9 pr-4 py-2 text-sm font-roboto text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={bedsFilter}
            onChange={(e) => setBedsFilter(e.target.value)}
            className="border border-stone-200 rounded-md px-3 py-2 text-sm font-roboto text-stone-600 focus:outline-none focus:border-primary cursor-pointer whitespace-nowrap bg-white"
          >
            {bedsOptions.map((o) => <option key={o}>{o}</option>)}
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="border border-stone-200 rounded-md px-3 py-2 text-sm font-roboto text-stone-600 focus:outline-none focus:border-primary cursor-pointer whitespace-nowrap bg-white"
          >
            {priceOptions.map((o) => <option key={o}>{o}</option>)}
          </select>

          <span className="ml-auto text-sm font-roboto text-stone-400 whitespace-nowrap">
            <strong className="text-primary font-prata">{total}</strong> listing{total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
