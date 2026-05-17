import { useState, useRef, useEffect } from 'react';
import type { RealMessage as MockMessage } from '../page';

const TAG_META: Record<string, { label: string; cls: string; icon: string }> = {
  inquiry: { label: 'Inquiry', cls: 'bg-sky-50 text-sky-700', icon: 'ri-mail-line' },
  tour: { label: 'Tour Request', cls: 'bg-amber-50 text-amber-700', icon: 'ri-calendar-check-line' },
  landlord: { label: 'Landlord', cls: 'bg-emerald-50 text-emerald-700', icon: 'ri-home-4-line' },
  general: { label: 'General', cls: 'bg-stone-100 text-stone-600', icon: 'ri-chat-3-line' },
};

function formatDateTime(ts: string): string {
  return new Date(ts).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

interface Props {
  message: MockMessage;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MessageThread({ message, onMarkRead, onDelete }: Props) {
  const [reply, setReply] = useState('');
  const [thread, setThread] = useState(message.thread);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const tag = TAG_META[message.tag];

  useEffect(() => {
    setThread(message.thread);
    setReply('');
    setSent(false);
  }, [message.id, message.thread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSend = () => {
    if (!reply.trim()) return;
    setSending(true);
    setTimeout(() => {
      const newMsg = {
        id: `reply-${Date.now()}`,
        from: 'admin' as const,
        senderName: 'Oceans UG',
        body: reply.trim(),
        timestamp: new Date().toISOString(),
      };
      setThread((prev) => [...prev, newMsg]);
      setReply('');
      setSending(false);
      setSent(true);
      onMarkRead(message.id);
      setTimeout(() => setSent(false), 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="px-6 py-4 border-b border-[#e8edf2] shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${tag.cls}`}>
                <i className={`${tag.icon} text-[10px]`} />
                {tag.label}
              </span>
              {message.unread && (
                <span className="px-2 py-0.5 bg-[#D5A91C] text-[#0d1f2d] text-[10px] font-bold rounded-full">
                  Unread
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-[#0d1f2d] leading-snug">{message.subject}</h2>
            <p className="text-xs text-[#7a8a99] mt-0.5">
              <span className="font-medium text-[#3a4a5a]">{message.sender}</span>
              {' '}·{' '}
              <a href={`mailto:${message.senderEmail}`} className="hover:text-[#c9a84c] transition-colors">
                {message.senderEmail}
              </a>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onMarkRead(message.id)}
              title="Mark as read"
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-[#f0f4f8] transition-colors cursor-pointer"
            >
              <i className="ri-mail-open-line text-sm" />
            </button>
            <button
              title="Archive"
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-[#f0f4f8] transition-colors cursor-pointer"
            >
              <i className="ri-archive-line text-sm" />
            </button>
            <button
              onClick={() => onDelete(message.id)}
              title="Delete"
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#7a8a99] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <i className="ri-delete-bin-line text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {thread.map((msg) => {
          const isAdmin = msg.from === 'admin';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isAdmin ? 'bg-[#D5A91C] text-[#0d1f2d]' : 'bg-[#0d1f2d] text-white'
                }`}
              >
                {isAdmin ? 'OUG' : getInitials(msg.senderName)}
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold text-[#3a4a5a] ${isAdmin ? 'order-2' : ''}`}>
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-[#b0bec5]">
                    {formatDateTime(msg.timestamp)}
                  </span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    isAdmin
                      ? 'bg-[#0d1f2d] text-white rounded-tr-sm'
                      : 'bg-[#f5f7fa] text-[#1a2a3a] rounded-tl-sm'
                  }`}
                >
                  {msg.body}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      <div className="shrink-0 border-t border-[#e8edf2] px-6 py-4">
        {sent && (
          <div className="flex items-center gap-2 mb-3 text-emerald-600 text-xs font-medium">
            <i className="ri-check-double-line" /> Reply sent successfully
          </div>
        )}
        <div className="bg-[#f9fafb] border border-[#e8edf2] rounded-xl overflow-hidden focus-within:border-[#D5A91C] focus-within:bg-white transition-colors">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={`Reply to ${message.sender}…`}
            rows={3}
            className="w-full px-4 pt-3 pb-2 text-sm text-[#0d1f2d] bg-transparent resize-none focus:outline-none placeholder-[#b0bec5] focus:border-[#D5A91C]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
            }}
          />
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded text-[#b0bec5] hover:text-[#0d1f2d] cursor-pointer transition-colors">
                <i className="ri-attachment-2 text-sm" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded text-[#b0bec5] hover:text-[#0d1f2d] cursor-pointer transition-colors">
                <i className="ri-emotion-line text-sm" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#b0bec5]">⌘↵ to send</span>
              <button
                onClick={handleSend}
                disabled={!reply.trim() || sending}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  reply.trim() && !sending
                    ? 'bg-[#0d1f2d] text-white hover:bg-[#1a3448]'
                    : 'bg-[#e8edf2] text-[#b0bec5] cursor-not-allowed'
                }`}
              >
                {sending ? (
                  <>
                    <span className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-fill text-xs" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
