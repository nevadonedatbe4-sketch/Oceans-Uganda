import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type CurrencyCode = 'USD' | 'UGX' | 'EUR' | 'GBP';

export interface ExchangeRate {
  from_currency: string;
  to_currency: string;
  rate: number;
}

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  rates: Record<string, number>;
  ratesLoading: boolean;
  formatPrice: (priceValue: number | null, storedCurrency?: string, options?: { note?: string | null; frequency?: string | null; purpose?: string }) => string;
  formatAdminPrice: (priceValue: number | null, storedCurrency?: string) => string;
}

const CURRENCY_KEY = 'oceans_currency';
const ALLOWED_CURRENCIES: CurrencyCode[] = ['USD', 'UGX', 'EUR', 'GBP'];

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  setCurrency: () => {},
  rates: {},
  ratesLoading: true,
  formatPrice: () => 'Price on request',
  formatAdminPrice: () => '—',
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [ratesLoading, setRatesLoading] = useState(true);

  // Load saved currency from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY) as CurrencyCode | null;
      if (saved && ALLOWED_CURRENCIES.includes(saved)) {
        setCurrencyState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch exchange rates from Supabase
  useEffect(() => {
    async function loadRates() {
      setRatesLoading(true);
      const { data } = await supabase
        .from('exchange_rates')
        .select('from_currency, to_currency, rate')
        .eq('from_currency', 'USD');

      const map: Record<string, number> = {};
      (data || []).forEach((r: ExchangeRate) => {
        map[r.to_currency] = r.rate;
      });
      setRates(map);
      setRatesLoading(false);
    }
    loadRates();
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    if (ALLOWED_CURRENCIES.includes(c)) {
      setCurrencyState(c);
      try {
        localStorage.setItem(CURRENCY_KEY, c);
      } catch {
        // ignore
      }
    }
  }, []);

  // Normalize stored price to USD, then convert to display currency
  const convert = useCallback(
    (priceValue: number | null, storedCurrency?: string): number | null => {
      if (!priceValue) return null;

      // Step 1: Normalize stored price to USD
      let usdPrice = priceValue;
      const sc = (storedCurrency || 'USD').toUpperCase();
      if (sc !== 'USD') {
        const rateToUsd = rates[sc];
        if (rateToUsd) usdPrice = priceValue / rateToUsd;
      }

      // Step 2: Convert USD to display currency
      if (currency === 'USD') return usdPrice;
      const rate = rates[currency];
      if (!rate) return usdPrice;
      return usdPrice * rate;
    },
    [currency, rates]
  );

  const formatPrice = useCallback(
    (priceValue: number | null, storedCurrency?: string, options?: { note?: string | null; frequency?: string | null; purpose?: string }): string => {
      if (!priceValue) return 'Price on request';

      const converted = convert(priceValue, storedCurrency);
      if (!converted) return 'Price on request';

      let formatted: string;

      if (currency === 'USD') {
        formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(converted);
      } else if (currency === 'UGX') {
        const numFormatted = new Intl.NumberFormat('en-UG', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(converted);
        formatted = `UGX ${numFormatted}`;
      } else if (currency === 'EUR') {
        formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(converted);
      } else if (currency === 'GBP') {
        formatted = new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(converted);
      } else {
        formatted = `$${converted.toLocaleString()}`;
      }

      const rawFreq = options?.frequency;
      const freqLabel = rawFreq === 'monthly' ? 'month'
                        : rawFreq === 'weekly' ? 'week'
                        : rawFreq === 'daily' ? 'day'
                        : rawFreq === 'yearly' ? 'year'
                        : rawFreq && rawFreq !== 'total' ? rawFreq
                        : '';
      const freq = freqLabel ? ` / ${freqLabel}` : '';
      const isRent = options?.purpose === 'rent';

      if (isRent && !freq) {
        return `${formatted} pcm`;
      }

      return `${formatted}${freq}`;
    },
    [currency, convert]
  );

  const formatAdminPrice = useCallback(
    (priceValue: number | null, storedCurrency?: string): string => {
      if (!priceValue) return '—';
      const sc = (storedCurrency || 'USD').toUpperCase();
      if (sc === 'USD') {
        return `$${priceValue.toLocaleString()}`;
      }
      const rate = rates[sc];
      const converted = rate ? priceValue / rate : priceValue;
      return `$${Math.round(converted).toLocaleString()} (stored: ${sc} ${priceValue.toLocaleString()})`;
    },
    [rates]
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, rates, ratesLoading, formatPrice, formatAdminPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}