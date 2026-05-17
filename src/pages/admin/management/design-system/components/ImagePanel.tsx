import SettingField from '../../components/SettingField';

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

export default function ImagePanel({ get, update }: Props) {
  const radius = get('img_border_radius', '0');
  const fit = get('img_fit', 'cover');
  const height = get('img_card_height', '260');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-image-2-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Image System</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField
            label="Image Border Radius"
            type="number"
            value={radius}
            onChange={(v) => update('img_border_radius', v)}
            unit="px"
            min={0}
            max={24}
            hint="Corner radius applied to all property images."
          />
          <SettingField
            label="Image Fit"
            type="select"
            value={fit}
            onChange={(v) => update('img_fit', v)}
            options={[
              { label: 'Cover (fill, crop)', value: 'cover' },
              { label: 'Contain (show full image)', value: 'contain' },
            ]}
            hint="How images fill their container."
          />
          <SettingField
            label="Card Image Height"
            type="number"
            value={height}
            onChange={(v) => update('img_card_height', v)}
            unit="px"
            min={120}
            max={500}
            hint="Height of the image area on property cards."
          />
          <SettingField
            label="Image Focal Point"
            type="select"
            value={get('img_focal_point', 'top')}
            onChange={(v) => update('img_focal_point', v)}
            options={[
              { label: 'Top', value: 'top' },
              { label: 'Center', value: 'center' },
              { label: 'Bottom', value: 'bottom' },
            ]}
            hint="Which part of the image to show when cropped."
          />
          <SettingField
            label="Show Image Overlay on Hover"
            type="toggle"
            value={get('img_hover_overlay', 'true')}
            onChange={(v) => update('img_hover_overlay', v)}
            hint="Subtle dark overlay when hovering over card image."
          />
          <SettingField
            label="Image Zoom on Hover"
            type="toggle"
            value={get('img_hover_zoom', 'true')}
            onChange={(v) => update('img_hover_zoom', v)}
            hint="Slight zoom effect on card image hover."
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Image Preview</h3>
        <div
          className="w-full overflow-hidden"
          style={{ height: `${height}px`, borderRadius: `${radius}px` }}
        >
          <img
            src="https://readdy.ai/api/search-image?query=modern%20luxury%20apartment%20exterior%20architecture%20Kampala%20Uganda%20tropical%20garden%20pool%20elegant%20minimal&width=800&height=500&seq=img-system-preview-1&orientation=landscape"
            alt="preview"
            className="w-full h-full transition-transform duration-700"
            style={{ objectFit: fit as 'cover' | 'contain', objectPosition: get('img_focal_point', 'top') }}
          />
        </div>
        <p className="text-xs text-stone-400 mt-2">Preview updates as you change settings above.</p>
      </div>
    </div>
  );
}
