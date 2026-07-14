import { useState, useCallback, useRef } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '@/lib/supabase';

// ─── System colors config ─────────────────────────────────────────────────────
const SYSTEM_COLORS: { key: string; label: string; description: string; default: string }[] = [
  { key: 'color_primary',   label: 'Primary',       description: 'Main navy — headers, backgrounds, sidebar',       default: '#001731' },
  { key: 'color_secondary', label: 'Secondary',     description: 'Deeper navy — sub-sections, banners',             default: '#002349' },
  { key: 'color_text',      label: 'Text',          description: 'Body & paragraph text color',                     default: '#7A7A7A' },
  { key: 'color_accent',    label: 'Accent',        description: 'Teal — CTA buttons, highlighted elements',        default: '#0D5959' },
  { key: 'color_golden',    label: 'Golden Hover',  description: 'Gold — icons, active states, hover effects',      default: '#D4A614' },
  { key: 'color_topbar',    label: 'Topbar',        description: 'Near-black top bar background',                   default: '#020101' },
  { key: 'color_white',     label: 'White',         description: 'Pure white — cards, text on dark backgrounds',    default: '#FFFFFF' },
  { key: 'color_off_white', label: 'Off-White',     description: 'Soft white — page backgrounds, subtle sections',  default: '#F5F5F5' },
];

// ─── Logo fields ──────────────────────────────────────────────────────────────
const LOGO_FIELDS = [
  { key: 'logo_main',                  label: 'Main Logo',                    hint: 'Primary logo in the site header. Recommended: PNG with transparent background.' },
  { key: 'logo_retina',                label: 'Retina Logo (2×)',             hint: 'Double-resolution main logo for HiDPI screens.' },
  { key: 'logo_mobile',                label: 'Mobile Logo',                  hint: 'Smaller variant for mobile screens (below 768px).' },
  { key: 'logo_mobile_retina',         label: 'Mobile Retina Logo (2×)',      hint: 'Double-resolution mobile logo for Retina devices.' },
  { key: 'logo_transparent',           label: 'Transparent Header Logo',      hint: 'Shown when the header is transparent over the hero. Usually a white/light version.' },
  { key: 'logo_transparent_retina',    label: 'Transparent Header Retina (2×)', hint: 'Retina version of the transparent header logo.' },
  { key: 'logo_splash',                label: 'Mobile Splash Logo',           hint: 'Displayed on the mobile splash/loading screen.' },
  { key: 'logo_splash_retina',         label: 'Mobile Splash Retina (2×)',    hint: 'High-res version of the splash logo.' },
  { key: 'logo_lightbox',              label: 'Lightbox Logo',                hint: 'Small logo shown in the top-left of the property image lightbox.' },
  { key: 'logo_dashboard',             label: 'Dashboard / Admin Logo',       hint: 'Logo in the admin panel sidebar header.' },
  { key: 'favicon_url',                label: 'Favicon',                      hint: 'Browser tab icon. Must be .ico, .png, or .svg. Recommended: 32×32px.' },
  { key: 'icon_apple_iphone',          label: 'Apple iPhone Icon (180×180)',  hint: 'Touch icon for iPhone home screen shortcuts.' },
  { key: 'icon_apple_ipad',            label: 'Apple iPad Icon (152×152)',    hint: 'Touch icon for iPad home screen shortcuts.' },
];

// ─── Custom color row type ─────────────────────────────────────────────────────
interface CustomColor {
  id: string;
  label: string;
  value: string;
}

function parseCustomColors(raw: string): CustomColor[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  return [];
}

// ─── Color Swatch ─────────────────────────────────────────────────────────────
function ColorSwatch({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-stone-100 last:border-0">
      {/* Color picker */}
      <div className="relative shrink-0">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        />
        <div
          className="w-12 h-12 rounded-xl border-2 border-stone-200 shadow-sm cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: value || '#000000' }}
        />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-800">{label}</p>
        <p className="text-xs text-stone-400 mt-0.5">{description}</p>
      </div>
      {/* Hex input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        maxLength={9}
        className="w-28 border border-stone-200 rounded-md px-3 py-1.5 text-sm font-mono text-stone-800 uppercase focus:outline-none focus:border-[#001731] focus:ring-1 focus:ring-[#001731]/20 bg-[#f5f5f5]"
      />
    </div>
  );
}

// ─── Custom Color Row ─────────────────────────────────────────────────────────
function CustomColorRow({
  color,
  onLabelChange,
  onValueChange,
  onDelete,
}: {
  color: CustomColor;
  onLabelChange: (v: string) => void;
  onValueChange: (v: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0 group">
      {/* Color picker */}
      <div className="relative shrink-0">
        <input
          type="color"
          value={color.value || '#000000'}
          onChange={(e) => onValueChange(e.target.value)}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        />
        <div
          className="w-10 h-10 rounded-lg border-2 border-stone-200 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: color.value || '#000000' }}
        />
      </div>
      {/* Label */}
      <input
        type="text"
        value={color.label}
        onChange={(e) => onLabelChange(e.target.value)}
        placeholder="Color name..."
        className="flex-1 border border-stone-200 rounded-md px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:border-[#001731] focus:ring-1 focus:ring-[#001731]/20 bg-white"
      />
      {/* Hex input */}
      <input
        type="text"
        value={color.value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="#000000"
        maxLength={9}
        className="w-28 border border-stone-200 rounded-md px-3 py-1.5 text-sm font-mono text-stone-800 uppercase focus:outline-none focus:border-[#001731] focus:ring-1 focus:ring-[#001731]/20 bg-[#f5f5f5]"
      />
      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="w-8 h-8 flex items-center justify-center rounded-md text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
        title="Remove color"
      >
        <i className="ri-delete-bin-line text-sm" />
      </button>
    </div>
  );
}

// ─── Logo File Uploader ────────────────────────────────────────────────────────
function LogoFileUploader({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setUploadErr('Max 5 MB'); return; }
    setUploadErr(null);
    setUploading(true);
    const ext = file.name.split('.').pop();
    const slug = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const path = `logos/${slug}_${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('property-images').upload(path, file, { upsert: true });
    if (upErr) { setUploadErr(upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from('property-images').getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="py-3 border-b border-stone-100 last:border-0">
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div
          className="shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-stone-200 bg-[#f5f5f5] flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#001731]/30 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-contain p-1" />
          ) : uploading ? (
            <div className="w-5 h-5 border-2 border-[#001731] border-t-transparent rounded-full animate-spin" />
          ) : (
            <i className="ri-image-add-line text-stone-300 text-xl" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-700 mb-0.5">{label}</p>
          <p className="text-xs text-stone-400 mb-2 leading-relaxed">{hint}</p>

          {/* URL input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste URL or upload from PC below"
              className="flex-1 text-xs border border-stone-200 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#001731] focus:ring-1 focus:ring-[#001731]/15 text-stone-700 font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="w-7 h-7 flex items-center justify-center rounded text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                title="Clear"
              >
                <i className="ri-close-line text-sm" />
              </button>
            )}
          </div>

          {/* Upload from PC */}
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-[#001731] hover:text-white text-stone-600 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <i className="ri-upload-2-line" /> Upload from PC
                </>
              )}
            </button>
            {uploadErr && <p className="text-xs text-red-500">{uploadErr}</p>}
          </div>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,.ico,.svg"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BrandingManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('branding');

  // Local custom colors state (parsed from JSON string in settings)
  const [customColors, setCustomColors] = useState<CustomColor[]>(() =>
    parseCustomColors(get('custom_colors', '[]'))
  );
  const [addingNew, setAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('#C0A86A');

  // Sync custom colors to settings whenever they change
  const syncCustomColors = useCallback(
    (colors: CustomColor[]) => {
      setCustomColors(colors);
      update('custom_colors', JSON.stringify(colors));
    },
    [update]
  );

  const handleAddColor = () => {
    if (!newLabel.trim()) return;
    const newColor: CustomColor = {
      id: `custom_${Date.now()}`,
      label: newLabel.trim(),
      value: newValue,
    };
    syncCustomColors([...customColors, newColor]);
    setNewLabel('');
    setNewValue('#C0A86A');
    setAddingNew(false);
  };

  const handleDeleteCustom = (id: string) => {
    syncCustomColors(customColors.filter((c) => c.id !== id));
  };

  const handleCustomLabelChange = (id: string, label: string) => {
    syncCustomColors(customColors.map((c) => (c.id === id ? { ...c, label } : c)));
  };

  const handleCustomValueChange = (id: string, value: string) => {
    syncCustomColors(customColors.map((c) => (c.id === id ? { ...c, value } : c)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#001731] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Full palette preview
  const allColors = [
    ...SYSTEM_COLORS.map((s) => ({ label: s.label, value: get(s.key, s.default) })),
    ...customColors.map((c) => ({ label: c.label, value: c.value })),
  ];

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-palette-line"
        title="Logos, Branding & Colors"
        description="Manage logos, brand color palette, and add custom color tokens used across the site."
      />

      {/* ── System Colors ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-stone-800">System Colors</h3>
            <p className="text-xs text-stone-400 mt-0.5">Core brand palette applied across the entire site</p>
          </div>
          <span className="text-xs bg-[#001731]/8 text-[#001731] px-2 py-1 rounded-full font-medium">
            {SYSTEM_COLORS.length} colors
          </span>
        </div>
        {SYSTEM_COLORS.map((sc) => (
          <ColorSwatch
            key={sc.key}
            label={sc.label}
            description={sc.description}
            value={get(sc.key, sc.default)}
            onChange={(v) => update(sc.key, v)}
          />
        ))}
      </div>

      {/* ── Custom Colors ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Custom Colors</h3>
            <p className="text-xs text-stone-400 mt-0.5">Additional brand tokens — hover states, section accents, etc.</p>
          </div>
          <button
            type="button"
            onClick={() => setAddingNew(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#001731] text-white text-xs font-medium rounded-md hover:bg-[#002349] transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            Add Color
          </button>
        </div>

        {customColors.length === 0 && !addingNew && (
          <div className="text-center py-8 text-stone-400">
            <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
              <i className="ri-palette-line text-2xl" />
            </div>
            <p className="text-sm">No custom colors yet</p>
            <p className="text-xs mt-1">Click "Add Color" to create brand tokens</p>
          </div>
        )}

        {customColors.map((c) => (
          <CustomColorRow
            key={c.id}
            color={c}
            onLabelChange={(v) => handleCustomLabelChange(c.id, v)}
            onValueChange={(v) => handleCustomValueChange(c.id, v)}
            onDelete={() => handleDeleteCustom(c.id)}
          />
        ))}

        {/* Add new inline form */}
        {addingNew && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">New Color</p>
            <div className="flex items-center gap-3">
              {/* Color picker */}
              <div className="relative shrink-0">
                <input
                  type="color"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <div
                  className="w-10 h-10 rounded-lg border-2 border-stone-200 cursor-pointer"
                  style={{ backgroundColor: newValue }}
                />
              </div>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Color name (e.g. Button Hover)"
                className="flex-1 border border-stone-200 rounded-md px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:border-[#001731] focus:ring-1 focus:ring-[#001731]/20 bg-white"
                onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
                autoFocus
              />
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="#C0A86A"
                maxLength={9}
                className="w-28 border border-stone-200 rounded-md px-3 py-1.5 text-sm font-mono text-stone-800 uppercase focus:outline-none focus:border-[#001731] bg-[#f5f5f5]"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 bg-[#001731] text-white text-xs font-medium rounded-md hover:bg-[#002349] transition-colors cursor-pointer whitespace-nowrap"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setAddingNew(false); setNewLabel(''); }}
                className="px-3 py-1.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-md hover:bg-stone-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Full Palette Preview ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-800 mb-4">Full Palette Preview</h3>
        <div className="flex flex-wrap gap-3">
          {allColors.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="w-14 h-14 rounded-xl border border-stone-100"
                style={{ backgroundColor: c.value }}
              />
              <span className="text-xs text-stone-500 font-medium">{c.label}</span>
              <span className="text-xs text-stone-400 font-mono uppercase">{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Logo Dimensions ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-800">Logo Dimensions</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Standard Logo Height" type="number" value={get('logo_height_standard', '40')} onChange={(v) => update('logo_height_standard', v)} unit="px" hint="Desktop header logo height." />
          <SettingField label="Standard Logo Width"  type="number" value={get('logo_width_standard', '160')} onChange={(v) => update('logo_width_standard', v)} unit="px" />
          <SettingField label="Mobile Logo Height"   type="number" value={get('logo_height_mobile', '32')} onChange={(v) => update('logo_height_mobile', v)} unit="px" />
          <SettingField label="Mobile Logo Width"    type="number" value={get('logo_width_mobile', '120')} onChange={(v) => update('logo_width_mobile', v)} unit="px" />
        </div>
      </div>

      {/* ── Logo & Icon Files ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Logo & Icon Files</h3>
            <p className="text-xs text-stone-400 mt-0.5">Upload logos directly from your PC or paste a URL</p>
          </div>
          <span className="text-xs bg-[#001731]/8 text-[#001731] px-2 py-1 rounded-full font-medium">
            {LOGO_FIELDS.length} files
          </span>
        </div>
        <div className="flex items-start gap-3 bg-[#D4A614]/8 border border-[#D4A614]/20 rounded-lg px-4 py-3 mb-4">
          <i className="ri-upload-cloud-2-line text-[#D4A614] mt-0.5 shrink-0" />
          <p className="text-xs text-stone-600">
            Click any logo slot or drag an image file onto it to <strong>upload directly from your PC</strong>. 
            You can also paste a public URL. Uploaded files are stored in your media library automatically.
          </p>
        </div>
        {LOGO_FIELDS.map((field) => (
          <LogoFileUploader
            key={field.key}
            label={field.label}
            hint={field.hint}
            value={get(field.key)}
            onChange={(v) => update(field.key, v)}
          />
        ))}
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
