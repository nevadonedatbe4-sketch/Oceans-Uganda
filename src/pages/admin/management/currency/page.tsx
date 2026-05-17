import { useState, useCallback } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '@/lib/supabase';

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$', flag: '$' },
  { code: 'UGX', label: 'Ugandan Shilling', symbol: 'UGX', flag: 'USh' },
  { code: 'EUR', label: 'Euro', symbol: '€', flag: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£', flag: '£' },
];

function formatAmount(amount: number, currency: string, sep: string, decimals: number): string {
  if (currency === 'UGX') {
    return `UGX ${Math.round(amount).toLocaleString('en-UG').replace(/,/g, sep)}`;
  }
  const parts = amount.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  const numStr = decimals > 0 ? parts.join('.') : parts[0];
  if (currency === 'USD') return `$${numStr}`;
  if (currency === 'EUR') return `€${numStr}`;
  if (currency === 'GBP') return `£${numStr}`;
  return numStr;
}

export default function CurrencyManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading, reload } = useManagementSettings('currency');
  const [fetchingRate, setFetchingRate] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [activeCurrency, setActiveCurrency] = useState('UGX');

  const rateMode = get('currency_rate_mode', 'auto');
  const manualRate = parseFloat(get(`currency_manual_rate_${activeCurrency.toLowerCase()}`, '3850')) || 3850;
  const autoRate = parseFloat(get(`currency_auto_rate_${activeCurrency.toLowerCase()}`, '')) || 0;
  const effectiveRate = rateMode === 'manual' ? manualRate : (autoRate || manualRate);

  // Preview: USD primary
  const SAMPLE_USD = 180000;
  const convertedAmount = Math.round(SAMPLE_USD * effectiveRate);
  const sep = get('currency_thousand_sep', ',');
  const decimals = parseInt(get('currency_usd_decimals', '0'), 10);
  const showStarting = get('currency_show_starting_from', 'false') === 'true';

  const fetchLiveRate = useCallback(async () => {
    setFetchingRate(true);
    setFetchError('');
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data.result === 'success' && data.rates?.[activeCurrency]) {
        const rate = data.rates[activeCurrency];
        const timestamp = new Date().toISOString();
        const keyRate = `currency_auto_rate_${activeCurrency.toLowerCase()}`;
        const keyTs = `currency_auto_rate_${activeCurrency.toLowerCase()}_timestamp`;
        await Promise.all([
          supabase.from('site_settings').upsert({ key: keyRate, value: String(rate), setting_group: 'currency' }, { onConflict: 'key' }),
          supabase.from('site_settings').upsert({ key: keyTs, value: timestamp, setting_group: 'currency' }, { onConflict: 'key' }),
        ]);
        await reload();
      } else {
        setFetchError('API returned an unexpected response. Try Manual Override instead.');
      }
    } catch {
      setFetchError('Failed to fetch live rate. Check your connection and try again.');
    }
    setFetchingRate(false);
  }, [reload, activeCurrency]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-currency-line"
        title="Price & Currency"
        badge="Core"
        description="USD is the primary display currency. UGX shown as the local reference price for Ugandan buyers."
      />

      {/* Live Preview */}
      <div className="bg-[#1B4332] rounded-xl p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
          Live Display Preview — Sample Property: USD 180,000
        </p>
        <div className="space-y-1">
          {showStarting && <p className="text-xs text-white/50">Starting from</p>}
          <p className="text-2xl font-bold text-white">
            {formatAmount(SAMPLE_USD, 'USD', sep, decimals)}
          </p>
          {CURRENCIES.filter(c => c.code !== 'USD').map(c => {
            const rKey = `currency_rate_${c.code.toLowerCase()}`;
            const rate = parseFloat(get(rKey, '')) || 0;
            const conv = rate ? Math.round(SAMPLE_USD * rate) : 0;
            return (
              <p key={c.code} className="text-sm text-white/60">
                ≈ {formatAmount(conv, c.code, sep, 0)}
              </p>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-4 text-xs text-white/30">
          <span>Base: USD</span>
          <span>·</span>
          <span>Currencies: USD, UGX, EUR, GBP</span>
        </div>
      </div>

      {/* Exchange Rates Tabs */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Exchange Rates (from USD)</h3>

        {/* Currency tabs */}
        <div className="flex items-center gap-1">
          {CURRENCIES.filter(c => c.code !== 'USD').map(c => (
            <button
              key={c.code}
              onClick={() => setActiveCurrency(c.code)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeCurrency === c.code
                  ? 'bg-[#1B4332] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {c.code} ({c.flag})
            </button>
          ))}
        </div>

        <SettingField
          label="Rate Mode"
          type="radio"
          value={rateMode}
          onChange={(v) => update('currency_rate_mode', v)}
          options={[
            { value: 'auto', label: 'Auto — fetch live rate from Open Exchange Rates API' },
            { value: 'manual', label: 'Manual Override — use a fixed rate you set yourself' },
          ]}
        />

        {rateMode === 'auto' && (
          <div className="border border-stone-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-700">Current Live Rate — {activeCurrency}</p>
                {autoRate > 0 ? (
                  <p className="text-xl font-bold text-[#1B4332] mt-0.5">1 USD = {autoRate.toLocaleString()} {activeCurrency}</p>
                ) : (
                  <p className="text-sm text-stone-400 mt-1">No rate fetched yet — click Refresh to pull the latest.</p>
                )}
                {get(`currency_auto_rate_${activeCurrency.toLowerCase()}_timestamp`) && (
                  <p className="text-xs text-stone-400 mt-1">
                    Last updated: {new Date(get(`currency_auto_rate_${activeCurrency.toLowerCase()}_timestamp`)).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={fetchLiveRate}
                disabled={fetchingRate}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white text-sm rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 shrink-0"
              >
                {fetchingRate
                  ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Fetching…</>
                  : <><i className="ri-refresh-line" />Refresh Rate</>}
              </button>
            </div>
            {fetchError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <i className="ri-error-warning-line text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{fetchError}</p>
              </div>
            )}
            <p className="text-xs text-stone-400">
              If API is unavailable, the system falls back to the last saved exchange rate. If no saved rate exists, the display reverts to USD only.
            </p>
          </div>
        )}

        {rateMode === 'manual' && (
          <div className="border border-stone-200 rounded-lg p-4 space-y-3">
            <SettingField
              label={`Manual Exchange Rate (1 USD = X ${activeCurrency})`}
              type="number"
              value={get(`currency_manual_rate_${activeCurrency.toLowerCase()}`, '3850')}
              onChange={(v) => update(`currency_manual_rate_${activeCurrency.toLowerCase()}`, v)}
              placeholder="3850"
              hint={`Enter how many ${activeCurrency} equal 1 USD.`}
              min={0.01}
              step={0.01}
            />
            <div className="flex items-center gap-2 text-sm text-stone-500 bg-[#f5f5f5] rounded-lg px-3 py-2">
              <i className="ri-calculator-line text-stone-400" />
              USD 180,000 × {manualRate.toLocaleString()} = {formatAmount(180000 * manualRate, activeCurrency, sep, 0)}
            </div>
          </div>
        )}
      </div>

      {/* Price Entry Logic */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Price Entry Logic</h3>
        <div className="rounded-lg border border-[#1B4332]/20 bg-[#1B4332]/5 p-4 space-y-2">
          <p className="text-sm font-medium text-[#1B4332]">How prices work across the site</p>
          <ul className="text-sm text-[#1B4332]/70 space-y-1.5">
            <li className="flex items-start gap-2"><i className="ri-checkbox-circle-line mt-0.5 shrink-0" /> Admin enters property prices in <strong>USD</strong> as the base currency</li>
            <li className="flex items-start gap-2"><i className="ri-checkbox-circle-line mt-0.5 shrink-0" /> The frontend dynamically converts prices to the user&apos;s selected currency using current exchange rates</li>
            <li className="flex items-start gap-2"><i className="ri-checkbox-circle-line mt-0.5 shrink-0" /> Available display currencies: <strong>USD, UGX, EUR, GBP</strong></li>
            <li className="flex items-start gap-2"><i className="ri-checkbox-circle-line mt-0.5 shrink-0" /> Users can switch currencies anytime via the top bar switcher — prices update instantly site-wide</li>
            <li className="flex items-start gap-2"><i className="ri-checkbox-circle-line mt-0.5 shrink-0" /> All conversion happens on the frontend — stored prices in the database never change</li>
          </ul>
        </div>
      </div>

      {/* Display Format */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Display Format</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField
            label="Thousand Separator"
            type="select"
            value={sep}
            onChange={(v) => update('currency_thousand_sep', v)}
            options={[
              { value: ',', label: 'Comma  —  1,000,000' },
              { value: '.', label: 'Period  —  1.000.000' },
              { value: ' ', label: 'Space  —  1 000 000' },
            ]}
          />
          <SettingField
            label="USD Decimal Places"
            type="select"
            value={get('currency_usd_decimals', '0')}
            onChange={(v) => update('currency_usd_decimals', v)}
            options={[
              { value: '0', label: '0 — $180,000' },
              { value: '2', label: '2 — $180,000.00' },
            ]}
          />
        </div>
        <div className="border-t border-stone-100 pt-4 space-y-0">
          <SettingField label="Show Currency Symbol" type="toggle" value={get('currency_show_symbol', 'true')} onChange={(v) => update('currency_show_symbol', v)} />
          <SettingField label="Show Currency Code" type="toggle" value={get('currency_show_code', 'false')} onChange={(v) => update('currency_show_code', v)} />
          <SettingField label="Show &lsquo;Starting From&rsquo; Label" type="toggle" value={get('currency_show_starting_from', 'false')} onChange={(v) => update('currency_show_starting_from', v)} />
        </div>
      </div>

      {/* Fallback Rules */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Fallback Rules</h3>
        <div className="space-y-2">
          {[
            'If API fails → use last saved exchange rate automatically',
            'If no saved rate exists → display prices in USD only',
            'Manual override always takes priority over API when mode is set to Manual',
          ].map((rule) => (
            <div key={rule} className="flex items-start gap-2.5 text-sm text-stone-600">
              <i className="ri-shield-check-line text-[#1B4332] mt-0.5 shrink-0" />
              {rule}
            </div>
          ))}
        </div>
      </div>

      {/* Where applied */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Applied Across</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          {['Property Cards', 'Listing Detail Pages', 'Featured Listings', 'Search Results', 'Agent Profiles', 'Neighbourhood Listings', 'Inquiry Summaries', 'Admin Listings Table'].map((loc) => (
            <div key={loc} className="flex items-center gap-2 py-1.5">
              <i className="ri-checkbox-circle-fill text-[#1B4332] text-sm" />
              <span className="text-sm text-stone-600">{loc}</span>
            </div>
          ))}
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
