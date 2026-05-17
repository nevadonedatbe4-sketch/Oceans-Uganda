import { useState, useCallback } from 'react';

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

interface CardField {
  id: string;
  label: string;
  icon: string;
  defaultVisible: boolean;
}

const DEFAULT_FIELDS: CardField[] = [
  { id: 'status', label: 'Status (For Sale / For Rent)', icon: 'ri-price-tag-3-line', defaultVisible: true },
  { id: 'featured', label: 'Featured Label', icon: 'ri-star-line', defaultVisible: true },
  { id: 'title', label: 'Property Title', icon: 'ri-heading text-sm', defaultVisible: true },
  { id: 'address', label: 'Address / Location', icon: 'ri-map-pin-line', defaultVisible: true },
  { id: 'meta', label: 'Meta (Beds, Baths, Parking)', icon: 'ri-hotel-bed-line', defaultVisible: true },
  { id: 'prop_type', label: 'Property Type', icon: 'ri-building-2-line', defaultVisible: true },
  { id: 'area_postfix', label: 'Area / Size', icon: 'ri-ruler-line', defaultVisible: false },
  { id: 'price', label: 'Price', icon: 'ri-money-dollar-circle-line', defaultVisible: true },
  { id: 'sub_price', label: 'Sub Price (PCM etc.)', icon: 'ri-coins-line', defaultVisible: true },
  { id: 'date', label: 'Listed Date', icon: 'ri-time-line', defaultVisible: true },
  { id: 'agent', label: 'Agent Name', icon: 'ri-user-line', defaultVisible: false },
  { id: 'cta', label: 'CTA Button', icon: 'ri-cursor-line', defaultVisible: false },
];

function parseOrder(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* ignore */ }
  return DEFAULT_FIELDS.map((f) => f.id);
}

function parseVisible(raw: string): Record<string, boolean> {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch { /* ignore */ }
  const defaults: Record<string, boolean> = {};
  DEFAULT_FIELDS.forEach((f) => { defaults[f.id] = f.defaultVisible; });
  return defaults;
}

export default function CardContentPanel({ get, update }: Props) {
  const [order, setOrder] = useState<string[]>(() => parseOrder(get('card_field_order', '')));
  const [visible, setVisible] = useState<Record<string, boolean>>(() => parseVisible(get('card_field_visible', '')));
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const persist = useCallback((newOrder: string[], newVisible: Record<string, boolean>) => {
    update('card_field_order', JSON.stringify(newOrder));
    update('card_field_visible', JSON.stringify(newVisible));
  }, [update]);

  const toggleVisible = (id: string) => {
    const next = { ...visible, [id]: !visible[id] };
    setVisible(next);
    persist(order, next);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...order];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setOrder(next);
    persist(next, visible);
  };

  const moveDown = (idx: number) => {
    if (idx === order.length - 1) return;
    const next = [...order];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setOrder(next);
    persist(next, visible);
  };

  const handleDragStart = (id: string) => setDragging(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOver(id);
  };
  const handleDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const next = [...order];
    const fromIdx = next.indexOf(dragging);
    const toIdx = next.indexOf(targetId);
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, dragging);
    setOrder(next);
    persist(next, visible);
    setDragging(null);
    setDragOver(null);
  };

  const fieldMap = Object.fromEntries(DEFAULT_FIELDS.map((f) => [f.id, f]));
  const orderedFields = order.map((id) => fieldMap[id]).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-list-ordered text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Card Content Manager</h3>
        </div>
        <p className="text-xs text-stone-400">Drag rows to reorder fields on the property card. Toggle visibility with the eye icon. Changes save automatically.</p>

        <div className="space-y-1.5 mt-2">
          {orderedFields.map((field, idx) => (
            <div
              key={field.id}
              draggable
              onDragStart={() => handleDragStart(field.id)}
              onDragOver={(e) => handleDragOver(e, field.id)}
              onDrop={() => handleDrop(field.id)}
              onDragEnd={() => { setDragging(null); setDragOver(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                dragging === field.id ? 'opacity-40' : ''
              } ${
                dragOver === field.id && dragging !== field.id ? 'border-[#1B4332] bg-[#1B4332]/5' : 'border-stone-100 bg-[#f5f5f5] hover:bg-stone-100'
              }`}
            >
              {/* Drag handle */}
              <span className="w-4 h-4 flex items-center justify-center text-stone-300 shrink-0">
                <i className="ri-draggable text-base" />
              </span>

              {/* Position badge */}
              <span className="w-5 h-5 flex items-center justify-center bg-stone-200 text-stone-500 text-[10px] font-bold rounded shrink-0">
                {idx + 1}
              </span>

              {/* Icon */}
              <span className="w-4 h-4 flex items-center justify-center shrink-0">
                <i className={`${field.icon} text-sm text-stone-400`} />
              </span>

              {/* Label */}
              <span className={`flex-1 text-sm ${visible[field.id] ? 'text-stone-700' : 'text-stone-300 line-through'}`}>
                {field.label}
              </span>

              {/* Move buttons */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="w-6 h-6 flex items-center justify-center rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-up-s-line text-sm" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === orderedFields.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-down-s-line text-sm" />
                </button>
              </div>

              {/* Visibility toggle */}
              <button
                onClick={() => toggleVisible(field.id)}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer shrink-0 ${
                  visible[field.id] ? 'text-[#1B4332] bg-[#1B4332]/10 hover:bg-[#1B4332]/20' : 'text-stone-300 bg-stone-100 hover:bg-stone-200'
                }`}
              >
                <i className={`${visible[field.id] ? 'ri-eye-line' : 'ri-eye-off-line'} text-sm`} />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
          <i className="ri-information-line text-stone-400 text-sm" />
          <p className="text-xs text-stone-400">Drag to reorder. Eye icon toggles visibility. No fixed layout — fields render in the order shown above.</p>
        </div>
      </div>

      {/* Mini card preview based on order */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Card Field Order Preview</h3>
        <div className="max-w-[220px] border border-stone-100 rounded-lg overflow-hidden">
          <div className="w-full h-28 bg-stone-100">
            <img
              src="https://readdy.ai/api/search-image?query=modern%20luxury%20apartment%20interior%20living%20room%20elegant%20minimal%20design%20bright%20natural%20light%20Kampala&width=440&height=224&seq=card-content-preview-1&orientation=landscape"
              alt="preview"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="p-3 space-y-1">
            {orderedFields.filter((f) => visible[f.id]).map((field) => (
              <div key={field.id} className="flex items-center gap-1.5">
                <span className="w-3 h-3 flex items-center justify-center shrink-0">
                  <i className={`${field.icon} text-[10px] text-stone-300`} />
                </span>
                <span className="text-[10px] text-stone-400">{field.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
