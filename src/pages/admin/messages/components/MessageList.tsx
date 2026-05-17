import { useRef, useState } from 'react';
import type { RealMessage as MockMessage } from '../page';

const TAG_META: Record<string, { label: string; cls: string }> = {
  inquiry: { label: 'Inquiry', cls: 'bg-sky-50 text-sky-700' },
  tour: { label: 'Tour', cls: 'bg-amber-50 text-amber-700' },
  landlord: { label: 'Landlord', cls: 'bg-emerald-50 text-emerald-700' },
  general: { label: 'General', cls: 'bg-stone-100 text-stone-600' },
};

function formatTime(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (days === 1) return 'Yesterday';
  if (days < 7) return d.toLocaleDateString('en-GB', { weekday: 'short' });
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

const AVATAR_COLORS = [
  'bg-[#0d1f2d] text-white',
  'bg-[#D5A91C] text-[#0d1f2d]',
  'bg-[#1B4332] text-white',
  'bg-[#164e63] text-white',
  'bg-[#4c1d95] text-white',
  'bg-[#831843] text-white',
];

function avatarColor(id: string): string {
  const idx = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ── Swipeable row ────────────────────────────────────────────────────────────
interface SwipeRowProps {
  msg: MockMessage;
  isSelected: boolean;
  onSelect: (msg: MockMessage) => void;
  onDelete: (id: string) => void;
}

function SwipeRow({ msg, isSelected, onSelect, onDelete }: SwipeRowProps) {
  const tag = TAG_META[msg.tag];
  const initials = getInitials(msg.sender);
  const avCls = avatarColor(msg.id);

  const startXRef = useRef<number>(0);
  const [offset, setOffset] = useState(0);
  const [swiped, setSwiped] = useState(false);
  const THRESHOLD = 72;

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setSwiped(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = startXRef.current - e.touches[0].clientX;
    if (dx > 0) setOffset(Math.min(dx, THRESHOLD + 16));
  };

  const onTouchEnd = () => {
    if (offset >= THRESHOLD) {
      setOffset(THRESHOLD);
      setSwiped(true);
    } else {
      setOffset(0);
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(msg.id);
  };

  const resetSwipe = () => {
    setOffset(0);
    setSwiped(false);
  };

  return (
    <div className="relative overflow-hidden border-b border-[#f0f4f8] last:border-0">
      {/* Delete reveal layer */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[72px] flex items-center justify-center bg-red-500 cursor-pointer"
        onClick={handleDeleteConfirm}
      >
        <div className="flex flex-col items-center gap-0.5">
          <i className="ri-delete-bin-line text-white text-base" />
          <span className="text-white text-[9px] font-semibold">Delete</span>
        </div>
      </div>

      {/* Swipeable content */}
      <div
        className="relative bg-white transition-transform"
        style={{ transform: `translateX(-${offset}px)`, transitionDuration: offset === 0 || swiped ? '200ms' : '0ms' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => { if (swiped) { resetSwipe(); return; } onSelect(msg); }}
      >
        <div className={`px-3 py-3 transition-colors cursor-pointer relative ${isSelected ? 'bg-[#fdf8ec]' : ''}`}>
          {isSelected && (
            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#D5A91C] rounded-r-full" />
          )}
          <div className="flex items-start gap-2.5">
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${avCls}`}>
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              {/* Row 1: name + time */}
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className={`text-[13px] font-semibold truncate ${msg.unread ? 'text-[#0d1f2d]' : 'text-[#3a4a5a]'}`}>
                  {msg.sender}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {msg.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#D5A91C] shrink-0" />}
                  <span className="text-[10px] text-[#b0bec5] whitespace-nowrap">{formatTime(msg.timestamp)}</span>
                </div>
              </div>

              {/* Row 2: subject */}
              <p className={`text-[11px] truncate mb-0.5 ${msg.unread ? 'font-semibold text-[#0d1f2d]' : 'text-[#7a8a99]'}`}>
                {msg.subject}
              </p>

              {/* Row 3: preview + tag */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-[#b0bec5] truncate">{msg.preview}</p>
                <span className={`shrink-0 px-1.5 py-0.5 text-[9px] font-semibold rounded-full ${tag.cls}`}>
                  {tag.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  messages: MockMessage[];
  selectedId: string | null;
  onSelect: (msg: MockMessage) => void;
  onDelete: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  filterTag: string;
  onFilterTag: (v: string) => void;
  loading?: boolean;
}

export default function MessageList({
  messages, selectedId, onSelect, onDelete,
  search, onSearchChange, filterTag, onFilterTag, loading,
}: Props) {
  const tags = ['all', 'inquiry', 'tour', 'landlord', 'general'];

  const filtered = messages.filter((m) => {
    const matchTag = filterTag === 'all' || m.tag === filterTag;
    const matchSearch =
      !search ||
      m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="flex flex-col h-full border-r border-[#e8edf2]">
      {/* Header */}
      <div className="px-3 pt-3 pb-2.5 border-b border-[#e8edf2] shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-[#0d1f2d]">Inbox</h2>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 bg-[#D5A91C] text-[#0d1f2d] text-[9px] font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button className="w-7 h-7 flex items-center justify-center rounded-md text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-[#f0f4f8] transition-colors cursor-pointer">
            <i className="ri-edit-line text-sm" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-[#b0bec5] text-sm" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f0f4f8] border border-transparent rounded-lg text-[#0d1f2d] placeholder-[#b0bec5] focus:outline-none focus:border-[#D5A91C] focus:bg-white transition-colors"
          />
        </div>

        {/* Tag filter chips — scrollable */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 -mx-0.5 px-0.5">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onFilterTag(tag)}
              className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full cursor-pointer transition-colors whitespace-nowrap ${
                filterTag === tag
                  ? 'bg-[#0d1f2d] text-white'
                  : 'bg-[#f0f4f8] text-[#7a8a99] hover:bg-[#e8edf2]'
              }`}
            >
              {tag === 'all' ? 'All' : TAG_META[tag].label}
            </button>
          ))}
        </div>
      </div>

      {/* Swipe hint — mobile only, shown once */}
      <div className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#f8f9fb] border-b border-[#f0f4f8]">
        <i className="ri-arrow-left-right-line text-[10px] text-[#b0bec5]" />
        <span className="text-[10px] text-[#b0bec5]">Swipe left to delete</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <span className="w-12 h-12 flex items-center justify-center text-[#D5A91C] text-2xl mb-3">
              <i className="ri-inbox-line" />
            </span>
            <p className="text-sm font-medium text-[#0d1f2d]">No messages found</p>
            <p className="text-xs text-[#7a8a99] mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          filtered.map((msg) => (
            <SwipeRow
              key={msg.id}
              msg={msg}
              isSelected={msg.id === selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
