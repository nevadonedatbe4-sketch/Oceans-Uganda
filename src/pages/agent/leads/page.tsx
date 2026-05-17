export default function AgentLeads() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#D5A91C] text-[10px] font-semibold tracking-[0.22em] uppercase mb-2">
          Agent Portal
        </p>
        <h1 className="text-[#0f0f0f] font-jost text-3xl font-semibold tracking-tight">
          My Leads
        </h1>
        <p className="text-[#999] text-[12px] mt-1.5">Track enquiries and manage your prospect pipeline.</p>
      </div>

      {/* Empty state */}
      <div className="bg-white border border-[#e8e3db] rounded-lg flex flex-col items-center justify-center py-24 text-center px-8">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f5f3ef] mb-6">
          <i className="ri-user-received-2-line text-[#ccc] text-2xl" />
        </div>
        <p className="text-[#0f0f0f] font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px' }}>
          Leads from your listings
        </p>
        <p className="text-[#aaa] text-[12px] leading-relaxed mt-2 max-w-[280px]">
          When buyers or renters enquire about your properties, their contact details and requests will appear here.
        </p>
      </div>
    </div>
  );
}
