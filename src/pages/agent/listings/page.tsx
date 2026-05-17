import { Link } from 'react-router-dom';

export default function AgentListings() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-[#D5A91C] text-[10px] font-semibold tracking-[0.22em] uppercase mb-2">
            Agent Portal
          </p>
          <h1 className="text-[#0f0f0f] font-jost text-3xl font-semibold tracking-tight">
            My Listings
          </h1>
          <p className="text-[#999] text-[12px] mt-1.5">Manage all your property listings from here.</p>
        </div>
        <Link
          to="/agent/listings/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] hover:bg-[#222] text-white text-[12px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap tracking-wide sm:mt-7"
        >
          <i className="ri-add-line text-sm" />
          Add Listing
        </Link>
      </div>

      {/* Empty state */}
      <div className="bg-white border border-[#e8e3db] rounded-lg flex flex-col items-center justify-center py-24 text-center px-8">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f5f3ef] mb-6">
          <i className="ri-building-4-line text-[#ccc] text-2xl" />
        </div>
        <p className="text-[#0f0f0f] font-semibold text-[15px] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px' }}>
          Your listings will appear here
        </p>
        <p className="text-[#aaa] text-[12px] leading-relaxed mb-6 max-w-[280px]">
          Once your account is approved, you can start adding and managing your property listings.
        </p>
        <span className="inline-flex items-center gap-2 px-4 py-2 border border-[#e8e3db] text-[#bbb] text-[11px] rounded tracking-wide">
          <i className="ri-time-line" />
          Coming in next update
        </span>
      </div>
    </div>
  );
}
