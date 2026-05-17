import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import MessageList from './components/MessageList';
import MessageThread from './components/MessageThread';

export interface RealMessage {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  tag: 'inquiry' | 'tour' | 'landlord' | 'general';
  phone?: string;
  propertyTitle?: string;
  agentName?: string;
  sourcePage?: string;
  thread: Array<{
    id: string;
    from: 'user' | 'admin';
    senderName: string;
    body: string;
    timestamp: string;
  }>;
}

function mapLeadToMessage(lead: Record<string, unknown>): RealMessage {
  const tag: RealMessage['tag'] =
    lead.inquiry_type === 'tour' ? 'tour'
    : lead.source_page === 'landlords' ? 'landlord'
    : lead.inquiry_type === 'general' ? 'general'
    : 'inquiry';

  const subject = lead.property_title
    ? `Inquiry — ${lead.property_title}`
    : lead.source_page === 'landlords'
    ? 'Landlord Enquiry'
    : 'Property Enquiry';

  const body = (lead.message as string) || 'No message provided.';

  return {
    id: lead.id as string,
    sender: (lead.lead_name as string) || 'Unknown',
    senderEmail: (lead.email as string) || '',
    subject,
    preview: body.slice(0, 120),
    timestamp: lead.created_at as string,
    unread: true,
    tag,
    phone: lead.phone as string | undefined,
    propertyTitle: lead.property_title as string | undefined,
    agentName: lead.agent_name as string | undefined,
    sourcePage: lead.source_page as string | undefined,
    thread: [
      {
        id: `${lead.id}-1`,
        from: 'user',
        senderName: (lead.lead_name as string) || 'Unknown',
        body,
        timestamp: lead.created_at as string,
      },
    ],
  };
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<RealMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RealMessage | null>(null);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select('id, lead_name, email, phone, message, inquiry_type, source_page, property_title, agent_name, created_at, tour_date, tour_time, tour_type')
      .order('created_at', { ascending: false })
      .limit(100);

    const mapped = (data ?? []).map(mapLeadToMessage);
    setMessages(mapped);
    if (mapped.length > 0 && !selected) setSelected(mapped[0]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleSelect = (msg: RealMessage) => {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m)));
    setSelected({ ...msg, unread: false });
    setMobileView('thread');
  };

  const handleMarkRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, unread: false } : null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('leads').delete().eq('id', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) {
      const remaining = messages.filter((m) => m.id !== id);
      setSelected(remaining[0] ?? null);
    }
  };

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col -m-6">
      {/* Top bar */}
      <div className="bg-[#0d1f2d] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {mobileView === 'thread' && (
            <button onClick={() => setMobileView('list')} className="md:hidden w-7 h-7 flex items-center justify-center text-white/60 hover:text-white cursor-pointer">
              <i className="ri-arrow-left-line text-base" />
            </button>
          )}
          <div className="w-7 h-7 flex items-center justify-center">
            <i className="ri-message-3-line text-[#D5A91C] text-base" />
          </div>
          <h1 className="text-white font-bold text-sm">Enquiries & Messages</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-[#D5A91C] text-[#0d1f2d] text-[10px] font-bold rounded-full">{unreadCount} new</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages((prev) => prev.map((m) => ({ ...m, unread: false })))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-white/60 hover:text-white text-xs font-medium rounded-md hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-check-double-line" />
            <span className="hidden sm:inline">Mark all read</span>
          </button>
          <button
            onClick={fetchLeads}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D5A91C] text-[#0d1f2d] text-xs font-bold rounded-md hover:bg-[#c49a10] transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-refresh-line" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main two-panel layout */}
      <div className="flex-1 flex overflow-hidden bg-white">
        <div className={`w-full md:w-[340px] lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col overflow-hidden ${mobileView === 'thread' ? 'hidden md:flex' : 'flex'}`}>
          <MessageList
            messages={messages}
            selectedId={selected?.id ?? null}
            onSelect={handleSelect}
            onDelete={handleDelete}
            search={search}
            onSearchChange={setSearch}
            filterTag={filterTag}
            onFilterTag={setFilterTag}
            loading={loading}
          />
        </div>

        <div className={`flex-1 flex flex-col overflow-hidden ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {selected ? (
            <MessageThread
              key={selected.id}
              message={selected}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#f0f4f8] flex items-center justify-center mb-4">
                <i className="ri-inbox-2-line text-2xl text-[#D5A91C]" />
              </div>
              <h3 className="text-base font-bold text-[#0d1f2d] mb-1">
                {loading ? 'Loading enquiries…' : messages.length === 0 ? 'No enquiries yet' : 'Select a message'}
              </h3>
              <p className="text-sm text-[#7a8a99] max-w-[260px]">
                {loading ? 'Fetching from database…' : messages.length === 0 ? 'Enquiries submitted through your website will appear here.' : 'Choose a conversation from the list to read and reply'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
