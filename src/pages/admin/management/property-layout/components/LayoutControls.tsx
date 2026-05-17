import type {
  BannerSettings, ColumnSettings, GallerySettings, MobileSettings,
  NavigationSettings, AgentMessageSettings,
} from '@/hooks/usePropertyLayout';

function SelectField({
  label, hint, value, onChange, options,
}: {
  label: string; hint?: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-stone-700 block">{label}</label>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B4332] transition-colors bg-white cursor-pointer"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function NumberField({ label, hint, value, onChange, unit, min, max }: {
  label: string; hint?: string; value: number; onChange: (v: number) => void;
  unit?: string; min?: number; max?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-stone-700 block">{label}</label>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={e => onChange(parseInt(e.target.value, 10) || 0)}
          className="w-24 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
        />
        {unit && <span className="text-sm text-stone-400">{unit}</span>}
      </div>
    </div>
  );
}

function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-semibold text-stone-700">{label}</p>
        {hint && <p className="text-xs text-stone-400 mt-0.5">{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer mt-0.5 ${value ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
      >
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function ColumnSelect({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-stone-700">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap
              ${value === n ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}
          >
            {n} Col{n > 1 ? 's' : ''}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  banner: BannerSettings;
  columns: ColumnSettings;
  gallery: GallerySettings;
  mobile: MobileSettings;
  navigation: NavigationSettings;
  agentMessage: AgentMessageSettings;
  onBanner: (s: BannerSettings) => void;
  onColumns: (s: ColumnSettings) => void;
  onGallery: (s: GallerySettings) => void;
  onMobile: (s: MobileSettings) => void;
  onNavigation: (s: NavigationSettings) => void;
  onAgentMessage: (s: AgentMessageSettings) => void;
}

export default function LayoutControls({
  banner, columns, gallery, mobile, navigation, agentMessage,
  onBanner, onColumns, onGallery, onMobile, onNavigation, onAgentMessage,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Property Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <i className="ri-image-2-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wide">Property Banner</h3>
        </div>
        <SelectField
          label="Banner Version"
          hint="Controls the visual layout of the property header/banner area"
          value={banner.banner_version}
          onChange={v => onBanner({ ...banner, banner_version: v })}
          options={[
            { value: 'version1', label: 'Banner Version 1' },
            { value: 'version2', label: 'Banner Version 2' },
            { value: 'version3', label: 'Banner Version 3' },
            { value: 'none', label: 'No Banner' },
          ]}
        />
        <SelectField
          label="Property Banner Active Tab"
          hint="Default tab shown when the property banner loads"
          value={banner.active_tab}
          onChange={v => onBanner({ ...banner, active_tab: v })}
          options={[
            { value: 'gallery', label: 'Image / Gallery' },
            { value: 'map_view', label: 'Map View' },
            { value: 'street_view', label: 'Street View' },
            { value: 'video', label: 'Video' },
            { value: 'virtual_tour', label: '360° Virtual Tour' },
          ]}
        />
      </div>

      {/* Content Layout */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <i className="ri-layout-3-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wide">Content Layout</h3>
        </div>
        <SelectField
          label="Property Content Layout"
          hint="Controls how the main content area is laid out on the page"
          value={banner.content_layout}
          onChange={v => onBanner({ ...banner, content_layout: v })}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'boxed', label: 'Boxed' },
            { value: 'full_width', label: 'Full Width' },
            { value: 'sidebar_right', label: 'Sidebar Right' },
            { value: 'sidebar_left', label: 'Sidebar Left' },
          ]}
        />
        <Toggle
          label="Full Width Property Content"
          hint="Make the property page full width without the sidebar"
          value={banner.full_width}
          onChange={v => onBanner({ ...banner, full_width: v })}
        />
      </div>

      {/* Gallery Settings */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <i className="ri-gallery-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wide">Section Gallery Settings</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Visible Images"
            hint="Number of images shown in the gallery section"
            value={gallery.visible_images}
            onChange={v => onGallery({ ...gallery, visible_images: v })}
            unit="images"
            min={1}
            max={50}
          />
          <NumberField
            label="Images in a Row"
            hint="Number of columns in the gallery grid"
            value={gallery.images_per_row}
            onChange={v => onGallery({ ...gallery, images_per_row: v })}
            unit="columns"
            min={1}
            max={6}
          />
        </div>
      </div>

      {/* Section Column Controls */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <i className="ri-layout-column-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wide">Section Column Controls</h3>
        </div>
        <div className="space-y-4">
          <ColumnSelect
            label="Details Section Columns"
            value={columns.details}
            onChange={v => onColumns({ ...columns, details: v })}
          />
          <ColumnSelect
            label="Address Section Columns"
            value={columns.address}
            onChange={v => onColumns({ ...columns, address: v })}
          />
          <ColumnSelect
            label="Features Section Columns"
            value={columns.features}
            onChange={v => onColumns({ ...columns, features: v })}
          />
        </div>
      </div>

      {/* Mobile Settings */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <i className="ri-smartphone-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wide">Mobile Settings</h3>
        </div>
        <SelectField
          label="Property Tools Position on Mobile"
          hint="Controls where the share/favourite icons appear on mobile"
          value={mobile.tools_position}
          onChange={v => onMobile({ ...mobile, tools_position: v })}
          options={[
            { value: 'under_banner', label: 'Under Banner' },
            { value: 'under_title', label: 'Under Property Title' },
          ]}
        />
      </div>

      {/* Navigation & Advanced */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <i className="ri-settings-3-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wide">Advanced Controls</h3>
        </div>
        <Toggle
          label="Sticky Property Detail Navigation Bar"
          hint="Display an auto-generated sticky nav linking to each enabled section. Only works with Default layout."
          value={navigation.sticky_nav}
          onChange={v => onNavigation({ ...navigation, sticky_nav: v })}
        />
        <Toggle
          label="Enable Map in Address Section"
          hint="Show an embedded map inside the Address section on the property page"
          value={navigation.enable_map_in_address}
          onChange={v => onNavigation({ ...navigation, enable_map_in_address: v })}
        />
        <div className="pt-2 border-t border-stone-100">
          <Toggle
            label="Receive a Copy of Agent Messages"
            hint="When enabled, a copy of all messages sent to agents is also sent to the admin email and stored in the enquiries table"
            value={agentMessage.receive_copy}
            onChange={v => onAgentMessage({ ...agentMessage, receive_copy: v })}
          />
        </div>
      </div>
    </div>
  );
}
