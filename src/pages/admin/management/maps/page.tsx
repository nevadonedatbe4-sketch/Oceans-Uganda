import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

export default function MapsManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('maps');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const lat = get('maps_default_lat', '0.3476');
  const lng = get('maps_default_lng', '32.5825');
  const zoom = get('maps_default_zoom', '12');

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-map-pin-2-line"
        title="Maps & Location Settings"
        description="Configure Google Maps integration, default center point, and map display behavior."
      />

      {/* API Key */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Google Maps API</h3>
        <SettingField
          label="Google Maps API Key"
          type="text"
          value={get('maps_api_key')}
          onChange={(v) => update('maps_api_key', v)}
          placeholder="AIzaSy..."
          hint="Required for interactive property maps. Get your key at console.cloud.google.com — enable Maps JavaScript API and Places API."
        />
        {!get('maps_api_key') && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <i className="ri-alert-line text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              No API key set. Property location maps will fall back to a static Google Maps embed.
            </p>
          </div>
        )}
      </div>

      {/* Default Center */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Default Map Center</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField
            label="Default City"
            value={get('maps_default_city', 'Kampala')}
            onChange={(v) => update('maps_default_city', v)}
          />
          <SettingField
            label="Default Country"
            value={get('maps_default_country', 'Uganda')}
            onChange={(v) => update('maps_default_country', v)}
          />
          <SettingField
            label="Latitude"
            type="number"
            value={lat}
            onChange={(v) => update('maps_default_lat', v)}
            placeholder="0.3476"
            hint="Decimal format (e.g. 0.3476 for Kampala)."
          />
          <SettingField
            label="Longitude"
            type="number"
            value={lng}
            onChange={(v) => update('maps_default_lng', v)}
            placeholder="32.5825"
          />
        </div>
        <SettingField
          label="Default Zoom Level"
          type="select"
          value={zoom}
          onChange={(v) => update('maps_default_zoom', v)}
          options={[
            { value: '10', label: '10 — City overview' },
            { value: '11', label: '11 — Wide city' },
            { value: '12', label: '12 — City (recommended)' },
            { value: '13', label: '13 — Neighborhood' },
            { value: '14', label: '14 — Street level' },
            { value: '15', label: '15 — Close street' },
          ]}
        />
        {/* Static preview embed */}
        <div className="rounded-lg overflow-hidden border border-stone-200 h-48">
          <iframe
            title="Map Preview"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`}
          />
        </div>
        <p className="text-xs text-stone-400">Map preview updates after saving. This shows roughly where the default center is set.</p>
      </div>

      {/* Behavior */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Map Behavior</h3>
        <SettingField label="Show Map on Property Detail Pages" type="toggle" value={get('maps_show_on_listing', 'true')} onChange={(v) => update('maps_show_on_listing', v)} />
        <SettingField label="Cluster Map Pins for Dense Areas" type="toggle" value={get('maps_cluster_pins', 'true')} onChange={(v) => update('maps_cluster_pins', v)} hint="Groups nearby pins into a numbered cluster at lower zoom levels." />
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
