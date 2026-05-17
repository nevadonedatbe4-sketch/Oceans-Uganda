import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

const OPTIONS = [
  { value: 'USD' as const, label: 'USD', flag: '$' },
  { value: 'UGX' as const, label: 'UGX', flag: 'USh' },
  { value: 'EUR' as const, label: 'EUR', flag: '€' },
  { value: 'GBP' as const, label: 'GBP', flag: '£' },
];

export default function CurrencySwitcher({ variant = 'topbar' }: { variant?: 'topbar' | 'light' }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = OPTIONS.find((o) => o.value === currency) ?? OPTIONS[0];

  const isTopbar = variant === 'topbar';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer whitespace-nowrap select-none"
        style={{
          color: isTopbar ? '#ffffff' : '#001731',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '0.02em',
        }}
        aria-label={`Current currency: ${selected.label}. Click to switch.`}
      >
        <span className="font-semibold">{selected.label}</span>
        <span className="text-[10px] ml-0.5" style={{ opacity: 0.7 }}>▾</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 border"
          style={{
            background: '#ffffff',
            borderColor: '#d1d5db',
            borderRadius: '6px',
            minWidth: '96px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            overflow: 'hidden',
          }}
        >
          {OPTIONS.map((option) => {
            const isActive = option.value === currency;
            return (
              <button
                key={option.value}
                onClick={() => {
                  setCurrency(option.value);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-left cursor-pointer whitespace-nowrap transition-colors"
                style={{
                  background: isActive ? '#f5f5f5' : 'transparent',
                  color: isActive ? '#001731' : '#374151',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '13px',
                  borderBottom: '1px solid #f0f0f0',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#fafafa';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold flex-shrink-0"
                    style={{
                      background: isActive ? '#001731' : '#f0f0f0',
                      color: isActive ? '#ffffff' : '#6b7280',
                    }}
                  >
                    {option.flag}
                  </span>
                  <span>{option.label}</span>
                </span>
                {isActive && (
                  <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-xs" style={{ color: '#001731' }} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}