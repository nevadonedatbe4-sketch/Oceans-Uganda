import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Lead, AgentOption, LeadStage } from '../types';
import { STAGE_CONFIG, STAGE_ORDER } from '../types';

interface Props {
  lead: Lead | null;
  agents: AgentOption[];
  onClose: () => void;
  onUpdated: (updated: Lead) => void;
}

export default function LeadDetailDrawer({ lead, agents, onClose, onUpdated }: Props) {
  const [stage, setStage] = useState<LeadStage>('new');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (lead) {
      setStage(lead.stage);
      setAssignedTo(lead.assigned_to ?? '');
      setNotes(lead.notes ?? '');
      setFollowUpDate(lead.follow_up_date ?? '');
      setSaved(false);
    }
  }, [lead]);

  if (!lead) return null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} minutes ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} days ago`;
    return formatDate(d);
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = {
      stage,
      assigned_to: assignedTo || null,
      notes: notes || null,
      follow_up_date: followUpDate || null,
    };
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', lead.id)
      .select(`
        *,
        listing:listings(id, title, slug),
        agent:agents!leads_assigned_to_fkey(id, full_name)
      `)
      .maybeSingle();

    setSaving(false);
    if (!error && data) {
      setSaved(true);
      onUpdated(data as Lead);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const isTour = lead.inquiry_type === 'tour';
  const stageConfig = STAGE_CONFIG[stage];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[520px] bg-white shadow-xl flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-sm font-bold text-stone-600 uppercase mt-0.5">
              {lead.lead_name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-stone-800 text-base leading-tight">{lead.lead_name}</h2>
              <p className="text-xs text-stone-400 mt-0.5">Received {timeAgo(lead.created_at)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-stone-100 text-stone-400 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Inquiry type banner */}
        <div className={`px-6 py-3 flex items-center gap-3 border-b ${isTour ? 'bg-[#0D5959]/6 border-[#0D5959]/10' : 'bg-[#001731]/5 border-[#001731]/10'}`}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isTour ? 'bg-[#0D5959]/12' : 'bg-[#001731]/10'}`}>
            <i className={`${isTour ? 'ri-calendar-check-line text-[#0D5959]' : 'ri-mail-line text-[#001731]'} text-base`} />
          </div>
          <div className="flex-1">
            <p className={`text-xs font-semibold ${isTour ? 'text-[#0D5959]' : 'text-[#001731]'}`}>
              {isTour ? 'Tour Request' : 'Info Inquiry'}
            </p>
            {isTour && lead.tour_date && (
              <p className="text-xs text-stone-500 mt-0.5">
                {lead.tour_date}
                {lead.tour_time && ` at ${lead.tour_time}`}
                {lead.tour_type && ` · ${lead.tour_type}`}
              </p>
            )}
            {!isTour && lead.source_page && (
              <p className="text-xs text-stone-500 mt-0.5">via {lead.source_page}</p>
            )}
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${stageConfig.bg} ${stageConfig.color}`}>
            {stageConfig.label}
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Contact info */}
          <div className="px-6 py-4 border-b border-stone-100">
            <p className="font-jost text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-3">Contact Info</p>
            <div className="space-y-2">
              {lead.email && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <div className="w-6 h-6 flex items-center justify-center text-stone-400">
                      <i className="ri-mail-line" />
                    </div>
                    <span>{lead.email}</span>
                  </div>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-xs text-[#0D5959] font-medium hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Reply <i className="ri-external-link-line" />
                  </a>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <div className="w-6 h-6 flex items-center justify-center text-stone-400">
                      <i className="ri-phone-line" />
                    </div>
                    <span>{lead.phone}</span>
                  </div>
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-xs text-[#0D5959] font-medium hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Call <i className="ri-phone-line" />
                  </a>
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2 mt-4">
              {lead.email && (
                <a
                  href={`mailto:${lead.email}?subject=Re: ${encodeURIComponent(lead.property_title ?? lead.listing?.title ?? 'Your Inquiry')}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-stone-200 rounded-md text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap transition-colors"
                >
                  <i className="ri-mail-send-line" /> Send Email
                </a>
              )}
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-stone-200 rounded-md text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap transition-colors"
                >
                  <i className="ri-phone-line" /> Call
                </a>
              )}
              {lead.phone && (
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-stone-200 rounded-md text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap transition-colors"
                >
                  <i className="ri-whatsapp-line text-[#0D5959]" /> WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Tour details (if tour) */}
          {isTour && (lead.tour_date || lead.tour_time || lead.tour_type) && (
            <div className="px-6 py-4 border-b border-stone-100">
              <p className="font-jost text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-3">Tour Details</p>
              <div className="grid grid-cols-3 gap-3">
                {lead.tour_date && (
                  <div className="bg-[#f5f5f5] rounded-lg p-3 text-center">
                    <i className="ri-calendar-line text-stone-400 text-base mb-1 block" />
                    <p className="text-xs font-medium text-stone-700">{lead.tour_date}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Date</p>
                  </div>
                )}
                {lead.tour_time && (
                  <div className="bg-[#f5f5f5] rounded-lg p-3 text-center">
                    <i className="ri-time-line text-stone-400 text-base mb-1 block" />
                    <p className="text-xs font-medium text-stone-700">{lead.tour_time}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Time</p>
                  </div>
                )}
                {lead.tour_type && (
                  <div className="bg-[#f5f5f5] rounded-lg p-3 text-center">
                    <i className={`${lead.tour_type === 'Video Chat' ? 'ri-video-chat-line' : 'ri-walk-line'} text-stone-400 text-base mb-1 block`} />
                    <p className="text-xs font-medium text-stone-700">{lead.tour_type}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Format</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          {lead.message && (
            <div className="px-6 py-4 border-b border-stone-100">
              <p className="font-jost text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Message</p>
              <div className="bg-[#f5f5f5] rounded-lg px-4 py-3">
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{lead.message}</p>
              </div>
            </div>
          )}

          {/* Linked property */}
          {(lead.listing || lead.property_title) && (
            <div className="px-6 py-4 border-b border-stone-100">
              <p className="font-jost text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Property</p>
              <div className="flex items-center gap-2.5 bg-[#f5f5f5] rounded-lg px-3 py-2.5">
                <div className="w-7 h-7 flex items-center justify-center bg-stone-200 rounded shrink-0">
                  <i className="ri-building-2-line text-stone-500 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-700">
                    {lead.listing?.title ?? lead.property_title}
                  </p>
                  {lead.listing?.slug && (
                    <a
                      href={`/property/${lead.listing.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#0D5959] hover:underline cursor-pointer"
                    >
                      View listing <i className="ri-external-link-line" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CRM Actions */}
          <div className="px-6 py-4 space-y-4">
            <p className="font-jost text-[10px] font-semibold uppercase tracking-wider text-stone-400">CRM Actions</p>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Lead Stage</label>
              <div className="flex flex-wrap gap-2">
                {STAGE_ORDER.map((s: LeadStage) => {
                  const sc = STAGE_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                        stage === s
                          ? `${sc.bg} ${sc.color} border-current`
                          : 'border-stone-200 text-stone-500 hover:border-stone-300'
                      }`}
                    >
                      <i className={`${sc.icon} mr-1`} />
                      {sc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assign agent */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D5959]/20 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.full_name}</option>
                ))}
              </select>
            </div>

            {/* Follow-up date */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D5959]/20"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Staff Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes, call outcomes, client preferences…"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D5959]/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 bg-white">
          {saved && (
            <p className="text-xs text-[#0D5959] flex items-center gap-1 mb-3">
              <i className="ri-check-line" /> Changes saved successfully
            </p>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-stone-200 text-stone-600 rounded-md py-2.5 text-sm font-medium hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-[#0D5959] text-white rounded-md py-2.5 text-sm font-semibold hover:bg-[#084a4a] disabled:opacity-60 cursor-pointer whitespace-nowrap"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
