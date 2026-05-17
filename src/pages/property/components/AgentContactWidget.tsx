import { useState, useEffect, FormEvent } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { supabase } from '@/lib/supabase';

interface Agent {
  id: string;
  full_name: string;
  title: string | null;
  photo: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
}

interface AgentContactWidgetProps {
  agent: Agent | null;
  listingTitle: string;
  listingId?: string;
}

type ActiveTab = 'info' | 'tour';
type TourType = 'in_person' | 'video_chat';

const TOUR_TIMES = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

function getDaysStrip(): { date: Date; dayName: string; dayNum: number; monthName: string }[] {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return days;
}

export default function AgentContactWidget({ agent, listingTitle, listingId }: AgentContactWidgetProps) {
  const { get } = useSiteSettings();
  const contactBtnBg   = get('detail_contact_btn_bg', '#0D1B2A');
  const contactBtnText = get('detail_contact_btn_text', '#ffffff');

  const [activeTab, setActiveTab]       = useState<ActiveTab>('info');
  const [tourType, setTourType]         = useState<TourType>('in_person');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [stripOffset, setStripOffset]   = useState(0);

  /* Auto-switch to tour tab when hash is #tour (mobile CTA "Book a viewing") */
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#tour') setActiveTab('tour');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const [tourForm, setTourForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [infoForm, setInfoForm] = useState({
    name: '', phone: '', email: '',
    message: `Hello, I am interested in ${listingTitle}. Please get in touch with me.`,
  });

  const [tourSubmitting, setTourSubmitting] = useState(false);
  const [tourSubmitted, setTourSubmitted]   = useState(false);
  const [tourError, setTourError]           = useState('');

  const [infoSubmitting, setInfoSubmitting] = useState(false);
  const [infoSubmitted, setInfoSubmitted]   = useState(false);
  const [infoError, setInfoError]           = useState('');

  const [notifyConsent, setNotifyConsent] = useState(false);
  const [termsConsent, setTermsConsent]   = useState(false);

  const days = getDaysStrip();
  const visibleDays = days.slice(stripOffset, stripOffset + 4);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  const handleTourSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tourForm.name.trim() || !tourForm.email.trim()) { setTourError('Name and email are required.'); return; }
    if (!termsConsent) { setTourError('Please agree to the terms to continue.'); return; }
    setTourError('');
    setTourSubmitting(true);
    try {
      const body = new URLSearchParams({
        name: tourForm.name, phone: tourForm.phone, email: tourForm.email,
        message: tourForm.message || `Tour request for ${listingTitle}`,
        property: listingTitle, property_id: listingId ?? '',
        tour_type: tourType === 'video_chat' ? 'Video Chat' : 'In Person',
        tour_date: selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        tour_time: selectedTime,
        agent_name: agent?.full_name ?? 'Unassigned',
        agent_email: agent?.email ?? '',
        type: 'Schedule a Tour',
      });
      await fetch('https://readdy.ai/api/form/d7r49ukcmq04e0g4e37g', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      await supabase.from('leads').insert({
        lead_name: tourForm.name, email: tourForm.email || null, phone: tourForm.phone || null,
        listing_id: listingId || null, source_page: 'Property Detail — Tour Request',
        message: tourForm.message || null, stage: 'new', inquiry_type: 'tour',
        tour_date: selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        tour_time: selectedTime, tour_type: tourType === 'video_chat' ? 'Video Chat' : 'In Person',
        property_title: listingTitle, agent_name: agent?.full_name ?? null,
      });
      setTourSubmitted(true);
    } catch { setTourError('Something went wrong. Please try again.'); }
    finally { setTourSubmitting(false); }
  };

  const handleInfoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!infoForm.name.trim() || !infoForm.email.trim()) { setInfoError('Name and email are required.'); return; }
    setInfoError('');
    setInfoSubmitting(true);
    try {
      const body = new URLSearchParams({
        name: infoForm.name, phone: infoForm.phone, email: infoForm.email,
        message: infoForm.message, property: listingTitle, property_id: listingId ?? '',
        agent_name: agent?.full_name ?? 'Unassigned', agent_email: agent?.email ?? '',
        type: 'Request Info',
      });
      await fetch('https://readdy.ai/api/form/d7aldcibdfubkqslaou0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      await supabase.from('leads').insert({
        lead_name: infoForm.name, email: infoForm.email || null, phone: infoForm.phone || null,
        listing_id: listingId || null, source_page: 'Property Detail — Info Inquiry',
        message: infoForm.message || null, stage: 'new', inquiry_type: 'info',
        property_title: listingTitle, agent_name: agent?.full_name ?? null,
      });
      setInfoSubmitted(true);
    } catch { setInfoError('Something went wrong. Please try again.'); }
    finally { setInfoSubmitting(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded px-3.5 py-3 text-sm font-roboto text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 bg-white transition-colors";

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200">
        {(['info', 'tour'] as ActiveTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === 'info' ? 'Request Info' : 'Schedule a tour';
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3.5 text-sm font-roboto font-semibold transition-all cursor-pointer whitespace-nowrap border-b-2"
              style={{
                color: '#012042',
                background: isActive ? '#fff' : '#f8f8f8',
                borderBottomColor: isActive ? '#012042' : 'transparent',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Agent Mini Card ───────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        {agent?.photo ? (
          <img
            src={agent.photo}
            alt={agent.full_name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold font-roboto"
            style={{ background: '#012042' }}
          >
            {(agent?.full_name ?? 'O').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-roboto font-semibold truncate" style={{ color: '#0D1B2A' }}>
            {agent?.full_name ?? 'Oceans Uganda'}
          </p>
          <p className="text-xs font-roboto text-gray-400 truncate">
            {agent?.title ?? 'Property Consultant'}
          </p>
        </div>
        {agent?.phone && (
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center gap-1.5 text-xs font-roboto font-medium transition-colors cursor-pointer shrink-0"
            style={{ color: '#0D1B2A' }}
          >
            <i className="ri-phone-line text-sm" />
            Call Agent
          </a>
        )}
      </div>

      {/* ── TAB: REQUEST INFO ─────────────────────────────────────── */}
      {activeTab === 'info' && (
        <div className="p-5">
          {infoSubmitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 bg-green-50 rounded-full">
                <i className="ri-mail-check-line text-xl text-green-500" />
              </div>
              <p className="text-sm font-roboto font-bold mb-1" style={{ color: '#0D1B2A' }}>Message Sent!</p>
              <p className="text-xs font-roboto text-gray-500">{agent?.full_name ?? 'An agent'} will get back to you shortly.</p>
              <button
                type="button"
                onClick={() => {
                  setInfoSubmitted(false);
                  setInfoForm({ name: '', phone: '', email: '', message: `Hello, I am interested in ${listingTitle}. Please get in touch with me.` });
                }}
                className="mt-4 text-xs font-roboto font-medium underline cursor-pointer text-gray-400 hover:text-gray-700 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form data-readdy-form id="property-info-form" onSubmit={handleInfoSubmit} className="space-y-3.5">
              <input
                type="text" name="name" value={infoForm.name}
                onChange={e => setInfoForm({ ...infoForm, name: e.target.value })}
                placeholder="Your name" required className={inputCls}
              />
              <input
                type="email" name="email" value={infoForm.email}
                onChange={e => setInfoForm({ ...infoForm, email: e.target.value })}
                placeholder="Your email address" required className={inputCls}
              />
              <div className="flex gap-2">
                <select className="w-[72px] shrink-0 border border-gray-200 rounded px-2 py-3 text-sm font-roboto font-medium text-gray-700 focus:outline-none focus:border-gray-400 bg-white cursor-pointer">
                  <option value="+256">+256</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+49">+49</option>
                </select>
                <input
                  type="tel" name="phone" value={infoForm.phone}
                  onChange={e => setInfoForm({ ...infoForm, phone: e.target.value })}
                  placeholder="Phone number (optional)" className={`${inputCls} flex-1`}
                />
              </div>
              <textarea
                name="message"
                value={infoForm.message}
                onChange={e => { if (e.target.value.length <= 500) setInfoForm({ ...infoForm, message: e.target.value }); }}
                rows={4}
                maxLength={500}
                className={`${inputCls} resize-none`}
              />
              <div className="flex items-center justify-end -mt-1">
                <span className="text-[10px] text-gray-400 font-medium">{infoForm.message.length}/500</span>
              </div>

              <button
                type="submit"
                disabled={infoSubmitting}
                className="w-full py-3 text-sm font-roboto font-bold tracking-wide transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap disabled:opacity-50 rounded"
                style={{ background: '#012042', color: '#fff' }}
              >
                {infoSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : 'Send message'}
              </button>

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={notifyConsent}
                  onChange={e => setNotifyConsent(e.target.checked)}
                  className="mt-0.5 shrink-0 cursor-pointer accent-gray-700 w-3.5 h-3.5 rounded"
                />
                <span className="text-xs font-roboto text-gray-500 leading-relaxed">
                  Notify me via email when similar listings appear
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsConsent}
                  onChange={e => setTermsConsent(e.target.checked)}
                  className="mt-0.5 shrink-0 cursor-pointer accent-gray-700 w-3.5 h-3.5 rounded"
                />
                <span className="text-xs font-roboto text-gray-500 leading-relaxed">
                  I agree to <span className="underline cursor-pointer text-gray-700">Terms of Use</span> and <span className="underline cursor-pointer text-gray-700">Privacy Policy</span>, including sharing my activity and interests with the seller
                </span>
              </label>

              {infoError && (
                <p className="text-xs font-roboto font-medium bg-red-50 border border-red-200 rounded px-3 py-2 text-red-600">{infoError}</p>
              )}
            </form>
          )}
        </div>
      )}

      {/* ── TAB: SCHEDULE TOUR ────────────────────────────────────── */}
      {activeTab === 'tour' && (
        <div className="p-5 space-y-6">
          {tourSubmitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 bg-green-50 rounded-full">
                <i className="ri-calendar-check-line text-xl text-green-500" />
              </div>
              <p className="text-sm font-roboto font-bold mb-1" style={{ color: '#0D1B2A' }}>Tour Request Sent!</p>
              <p className="text-xs font-roboto text-gray-500">
                {agent?.full_name ?? 'An agent'} will confirm your {tourType === 'video_chat' ? 'video chat' : 'in-person visit'} shortly.
              </p>
              <p className="text-xs mt-1 font-medium text-gray-400">
                {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {selectedTime}
              </p>
              <button
                type="button"
                onClick={() => { setTourSubmitted(false); setTourForm({ name: '', phone: '', email: '', message: '' }); setTermsConsent(false); setNotifyConsent(false); }}
                className="mt-4 text-xs font-roboto font-medium underline cursor-pointer text-gray-400 hover:text-gray-700 transition-colors"
              >
                Schedule another tour
              </button>
            </div>
          ) : (
            <form data-readdy-form id="property-tour-form" onSubmit={handleTourSubmit} className="space-y-5">

              {/* Date strip */}
              <div>
                <p className="text-sm font-roboto font-bold text-gray-900 mb-3">Choose a date</p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStripOffset(Math.max(0, stripOffset - 4))}
                    disabled={stripOffset === 0}
                    className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 cursor-pointer shrink-0 transition-colors"
                  >
                    <i className="ri-arrow-left-s-line text-sm" />
                  </button>

                  <div className="flex-1 grid grid-cols-4 gap-1.5">
                    {visibleDays.map(({ date, dayName, dayNum, monthName }) => {
                      const isSelected = isSameDay(date, selectedDate);
                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className="flex flex-col items-center py-2.5 text-center transition-all cursor-pointer border rounded"
                          style={
                            isSelected
                              ? { background: '#012042', color: '#fff', borderColor: '#012042' }
                              : { background: '#fff', color: '#1a1a1a', borderColor: '#e5e5e5' }
                          }
                        >
                          <span className="text-[10px] font-roboto font-medium leading-none mb-1 uppercase tracking-wide" style={{ color: isSelected ? 'rgba(255,255,255,0.65)' : '#999' }}>
                            {dayName}
                          </span>
                          <span className="text-lg font-roboto font-bold leading-none">
                            {dayNum}
                          </span>
                          <span className="text-[10px] font-roboto font-medium leading-none mt-1 uppercase tracking-wide" style={{ color: isSelected ? 'rgba(255,255,255,0.65)' : '#999' }}>
                            {monthName}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStripOffset(Math.min(10, stripOffset + 4))}
                    disabled={stripOffset >= 10}
                    className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 cursor-pointer shrink-0 transition-colors"
                  >
                    <i className="ri-arrow-right-s-line text-sm" />
                  </button>
                </div>
              </div>

              {/* Tour type */}
              <div>
                <p className="text-sm font-roboto font-bold text-gray-900 mb-3">Tour Type</p>
                <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded overflow-hidden">
                  {([
                    { key: 'in_person', label: 'In Person' },
                    { key: 'video_chat', label: 'Video Chat' },
                  ] as { key: TourType; label: string }[]).map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTourType(key)}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-roboto font-semibold transition-all cursor-pointer whitespace-nowrap border-r border-gray-100 last:border-r-0"
                      style={
                        tourType === key
                          ? { background: '#012042', color: '#fff' }
                          : { background: '#fff', color: '#555' }
                      }
                    >
                      {tourType === key && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time selector */}
              <div>
                <select
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-3 text-sm font-roboto text-gray-900 focus:outline-none focus:border-gray-400 bg-white cursor-pointer"
                >
                  {TOUR_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <input
                  type="text" name="name" value={tourForm.name}
                  onChange={e => setTourForm({ ...tourForm, name: e.target.value })}
                  placeholder="Name" required className={inputCls}
                />
                <div className="flex gap-2">
                  <select className="w-[72px] shrink-0 border border-gray-200 rounded px-2 py-3 text-sm font-roboto font-medium text-gray-700 focus:outline-none focus:border-gray-400 bg-white cursor-pointer">
                    <option value="+256">+256</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+49">+49</option>
                  </select>
                  <input
                    type="tel" name="phone" value={tourForm.phone}
                    onChange={e => setTourForm({ ...tourForm, phone: e.target.value })}
                    placeholder="Phone number (optional)" className={`${inputCls} flex-1`}
                  />
                </div>
                <input
                  type="email" name="email" value={tourForm.email}
                  onChange={e => setTourForm({ ...tourForm, email: e.target.value })}
                  placeholder="Email" required className={inputCls}
                />
                <textarea
                  name="message" value={tourForm.message}
                  onChange={e => { if (e.target.value.length <= 500) setTourForm({ ...tourForm, message: e.target.value }); }}
                  placeholder="Enter your Message"
                  rows={3} maxLength={500}
                  className={`${inputCls} resize-none`}
                />
                <p className="text-[10px] text-right -mt-1 font-medium text-gray-400">{tourForm.message.length}/500</p>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsConsent}
                  onChange={e => setTermsConsent(e.target.checked)}
                  className="mt-0.5 shrink-0 cursor-pointer accent-gray-700 w-3.5 h-3.5 rounded"
                />
                <span className="text-xs font-roboto text-gray-500 leading-relaxed">
                  By submitting this form I agree to the <span className="underline cursor-pointer text-gray-700">Terms of Use</span> and <span className="underline cursor-pointer text-gray-700">Privacy Policy</span>
                </span>
              </label>

              {tourError && (
                <p className="text-xs font-roboto font-medium bg-red-50 border border-red-200 rounded px-3 py-2 text-red-600">{tourError}</p>
              )}

              <button
                type="submit"
                disabled={tourSubmitting}
                className="w-full py-3 text-sm font-roboto font-bold tracking-wide transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap disabled:opacity-50 rounded"
                style={{ background: '#012042', color: '#fff' }}
              >
                {tourSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : 'Submit a Tour Request'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
