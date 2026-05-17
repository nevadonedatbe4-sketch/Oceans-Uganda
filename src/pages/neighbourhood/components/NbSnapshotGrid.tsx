interface Props {
  location: string;
  targetMarket: string | null;
  vibe: string | null;
  avgSalePrice: string | null;
  rentalUsd: string | null;
  rentalUgx: string | null;
}

export default function NbSnapshotGrid({ location, targetMarket, vibe, avgSalePrice, rentalUsd, rentalUgx }: Props) {
  const items = [
    { icon: 'ri-map-pin-2-line', label: 'Location', value: location },
    { icon: 'ri-user-heart-line', label: 'Best For', value: targetMarket || 'Expats & Professionals' },
    { icon: 'ri-sparkling-line', label: 'Vibe', value: vibe || 'Residential' },
    { icon: 'ri-price-tag-3-line', label: 'Avg. Sale Price', value: avgSalePrice || 'Contact for pricing' },
    { icon: 'ri-key-2-line', label: 'Rental (USD/mo)', value: rentalUsd || 'Contact for pricing' },
    { icon: 'ri-money-dollar-circle-line', label: 'Rental (UGX/mo)', value: rentalUgx || 'Contact for pricing' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <div key={item.label} className="bg-[#f5f5f5] rounded-xl p-4 text-center border border-stone-100">
            <div className="w-9 h-9 flex items-center justify-center bg-white rounded-full mx-auto mb-2.5 border border-stone-100">
              <i className={`${item.icon} text-golden text-base`} />
            </div>
            <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400 mb-1">{item.label}</p>
            <p className="text-primary font-roboto text-xs font-semibold leading-snug">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
