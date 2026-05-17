import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const HEIGHT_OPTIONS = [
  { value: '60vh', label: '60vh — Compact' },
  { value: '75vh', label: '75vh — Medium' },
  { value: '90vh', label: '90vh — Tall' },
  { value: '100vh', label: '100vh — Full Screen' },
];

const MOBILE_HEIGHT_OPTIONS = [
  { value: '50vh', label: '50vh — Compact' },
  { value: '60vh', label: '60vh — Medium' },
  { value: '75vh', label: '75vh — Tall' },
  { value: '100vh', label: '100vh — Full Screen' },
];

const BTN_STYLE_OPTIONS = [
  { value: 'outline-white', label: 'Outline White' },
  { value: 'outline-gold', label: 'Outline Gold' },
  { value: 'solid-white', label: 'Solid White' },
  { value: 'solid-gold', label: 'Solid Gold' },
  { value: 'solid-primary', label: 'Solid Primary' },
];

const FONT_FAMILY_OPTIONS = [
  { value: 'inherit', label: 'Default (Site Font)' },
  { value: "'Playfair Display', serif", label: 'Playfair Display (Serif)' },
  { value: "'Cormorant Garamond', serif", label: 'Cormorant Garamond (Elegant)' },
  { value: "'Prata', serif", label: 'Prata (Classic)' },
  { value: "'Montserrat', sans-serif", label: 'Montserrat (Modern)' },
  { value: "'Roboto', sans-serif", label: 'Roboto (Clean)' },
  { value: "'Lato', sans-serif", label: 'Lato (Friendly)' },
  { value: "'Raleway', sans-serif", label: 'Raleway (Stylish)' },
  { value: "'Oswald', sans-serif", label: 'Oswald (Bold)' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: '300', label: '300 — Light' },
  { value: '400', label: '400 — Regular' },
  { value: '500', label: '500 — Medium' },
  { value: '600', label: '600 — Semi Bold' },
  { value: '700', label: '700 — Bold' },
  { value: '800', label: '800 — Extra Bold' },
];

const TEXT_TRANSFORM_OPTIONS = [
  { value: 'none', label: 'Normal' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'capitalize', label: 'Capitalize' },
  { value: 'lowercase', label: 'lowercase' },
];

const BTN_SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const BTN_RADIUS_OPTIONS = [
  { value: 'none', label: 'Square' },
  { value: 'sm', label: 'Slightly Rounded' },
  { value: 'md', label: 'Rounded' },
  { value: 'lg', label: 'More Rounded' },
  { value: 'full', label: 'Pill' },
];

export default function HeroManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('hero_settings');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[760px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-image-2-line"
        title="Hero Section"
        description="Full control over the homepage hero — background, overlay, text, typography, buttons, logo, layout and visibility."
      />

      <div className="flex items-start gap-3 bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-lg px-4 py-3">
        <i className="ri-information-line text-[#1B4332] mt-0.5 shrink-0" />
        <p className="text-sm text-[#1B4332]/80">
          All changes here reflect instantly on the homepage after saving. Nothing in the hero is hardcoded.
        </p>
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Visibility</h3>
        <SettingField
          label="Show Hero Section"
          type="toggle"
          value={get('hero_visible', 'true')}
          onChange={(v) => update('hero_visible', v)}
          hint="Toggle the entire hero section on or off."
        />
        <SettingField
          label="Show Search Bar"
          type="toggle"
          value={get('hero_show_search', 'true')}
          onChange={(v) => update('hero_show_search', v)}
          hint="Show or hide the property search bar inside the hero."
        />
        <SettingField
          label="Show Logo"
          type="toggle"
          value={get('hero_show_logo', 'true')}
          onChange={(v) => update('hero_show_logo', v)}
          hint="Show or hide the logo inside the hero section."
        />
        <SettingField
          label="Show Social Icons"
          type="toggle"
          value={get('hero_show_socials', 'true')}
          onChange={(v) => update('hero_show_socials', v)}
          hint="Show or hide social media icons in the hero."
        />
      </div>

      {/* Background */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Background</h3>
        <SettingField
          label="Background Image"
          type="image_upload"
          value={get('hero_bg_image', '')}
          onChange={(v) => update('hero_bg_image', v)}
          hint="Upload from your device (PC or mobile) or paste a URL. Recommended: landscape, at least 1920×1080px."
        />
        <SettingField
          label="Overlay Opacity"
          type="number"
          value={get('hero_overlay_opacity', '55')}
          onChange={(v) => update('hero_overlay_opacity', v)}
          unit="%"
          min={0}
          max={90}
          hint="Dark overlay on top of the background image. 0 = no overlay, 90 = very dark."
        />
        <SettingField
          label="Overlay Color"
          type="color"
          value={get('hero_overlay_color', '#000000')}
          onChange={(v) => update('hero_overlay_color', v)}
          hint="Color of the overlay. Usually black."
        />
      </div>

      {/* Layout */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Layout &amp; Sizing</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField
            label="Desktop Height"
            type="select"
            value={get('hero_height_desktop', '100vh')}
            onChange={(v) => update('hero_height_desktop', v)}
            options={HEIGHT_OPTIONS}
          />
          <SettingField
            label="Mobile Height"
            type="select"
            value={get('hero_height_mobile', '100vh')}
            onChange={(v) => update('hero_height_mobile', v)}
            options={MOBILE_HEIGHT_OPTIONS}
          />
          <SettingField
            label="Content Alignment"
            type="select"
            value={get('hero_alignment', 'center')}
            onChange={(v) => update('hero_alignment', v)}
            options={ALIGNMENT_OPTIONS}
          />
          <SettingField
            label="Vertical Padding"
            type="number"
            value={get('hero_padding_y', '96')}
            onChange={(v) => update('hero_padding_y', v)}
            unit="px"
            min={24}
            max={200}
            hint="Top and bottom padding inside the hero."
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Text Content</h3>
        <SettingField
          label="Title"
          type="text"
          value={get('hero_title', '')}
          onChange={(v) => update('hero_title', v)}
          placeholder="Find Your Perfect Home in Kampala"
        />
        <SettingField
          label="Subtitle"
          type="text"
          value={get('hero_subtitle', '')}
          onChange={(v) => update('hero_subtitle', v)}
          placeholder="Estate & Letting Agents"
        />
        <SettingField
          label="Body Text"
          type="textarea"
          value={get('hero_body_text', '')}
          onChange={(v) => update('hero_body_text', v)}
          placeholder="Discover the finest residential properties across Kampala's most sought-after neighborhoods."
        />
        <div className="grid grid-cols-2 gap-4">
          <SettingField
            label="Title Color"
            type="color"
            value={get('hero_title_color', '#ffffff')}
            onChange={(v) => update('hero_title_color', v)}
          />
          <SettingField
            label="Subtitle Color"
            type="color"
            value={get('hero_subtitle_color', '#ffffff')}
            onChange={(v) => update('hero_subtitle_color', v)}
          />
          <SettingField
            label="Body Text Color"
            type="color"
            value={get('hero_body_color', '#ffffff')}
            onChange={(v) => update('hero_body_color', v)}
          />
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Typography</h3>

        {/* Title Typography */}
        <div className="border border-stone-100 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Title</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField
              label="Font Family"
              type="select"
              value={get('hero_title_font_family', "'Prata', serif")}
              onChange={(v) => update('hero_title_font_family', v)}
              options={FONT_FAMILY_OPTIONS}
            />
            <SettingField
              label="Font Weight"
              type="select"
              value={get('hero_title_font_weight', '400')}
              onChange={(v) => update('hero_title_font_weight', v)}
              options={FONT_WEIGHT_OPTIONS}
            />
            <SettingField
              label="Font Size (desktop)"
              type="number"
              value={get('hero_title_font_size', '42')}
              onChange={(v) => update('hero_title_font_size', v)}
              unit="px"
              min={16}
              max={120}
            />
            <SettingField
              label="Letter Spacing"
              type="number"
              value={get('hero_title_letter_spacing', '0')}
              onChange={(v) => update('hero_title_letter_spacing', v)}
              unit="px"
              min={-2}
              max={20}
            />
            <SettingField
              label="Text Transform"
              type="select"
              value={get('hero_title_text_transform', 'none')}
              onChange={(v) => update('hero_title_text_transform', v)}
              options={TEXT_TRANSFORM_OPTIONS}
            />
            <SettingField
              label="Line Height"
              type="number"
              value={get('hero_title_line_height', '1.2')}
              onChange={(v) => update('hero_title_line_height', v)}
              unit="×"
              min={0.8}
              max={3}
            />
          </div>
        </div>

        {/* Subtitle Typography */}
        <div className="border border-stone-100 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Subtitle</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField
              label="Font Family"
              type="select"
              value={get('hero_subtitle_font_family', "'Roboto', sans-serif")}
              onChange={(v) => update('hero_subtitle_font_family', v)}
              options={FONT_FAMILY_OPTIONS}
            />
            <SettingField
              label="Font Weight"
              type="select"
              value={get('hero_subtitle_font_weight', '500')}
              onChange={(v) => update('hero_subtitle_font_weight', v)}
              options={FONT_WEIGHT_OPTIONS}
            />
            <SettingField
              label="Font Size"
              type="number"
              value={get('hero_subtitle_font_size', '13')}
              onChange={(v) => update('hero_subtitle_font_size', v)}
              unit="px"
              min={10}
              max={48}
            />
            <SettingField
              label="Letter Spacing"
              type="number"
              value={get('hero_subtitle_letter_spacing', '6.3')}
              onChange={(v) => update('hero_subtitle_letter_spacing', v)}
              unit="px"
              min={0}
              max={20}
            />
            <SettingField
              label="Text Transform"
              type="select"
              value={get('hero_subtitle_text_transform', 'uppercase')}
              onChange={(v) => update('hero_subtitle_text_transform', v)}
              options={TEXT_TRANSFORM_OPTIONS}
            />
          </div>
        </div>

        {/* Body Typography */}
        <div className="border border-stone-100 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Body Text</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField
              label="Font Family"
              type="select"
              value={get('hero_body_font_family', 'inherit')}
              onChange={(v) => update('hero_body_font_family', v)}
              options={FONT_FAMILY_OPTIONS}
            />
            <SettingField
              label="Font Weight"
              type="select"
              value={get('hero_body_font_weight', '400')}
              onChange={(v) => update('hero_body_font_weight', v)}
              options={FONT_WEIGHT_OPTIONS}
            />
            <SettingField
              label="Font Size"
              type="number"
              value={get('hero_body_font_size', '14')}
              onChange={(v) => update('hero_body_font_size', v)}
              unit="px"
              min={10}
              max={32}
            />
            <SettingField
              label="Line Height"
              type="number"
              value={get('hero_body_line_height', '1.7')}
              onChange={(v) => update('hero_body_line_height', v)}
              unit="×"
              min={1}
              max={3}
            />
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">CTA Buttons</h3>

        <div className="border border-stone-100 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Button 1 (RENT)</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField label="Label" type="text" value={get('hero_btn1_label', 'RENT')} onChange={(v) => update('hero_btn1_label', v)} />
            <SettingField label="Link" type="text" value={get('hero_btn1_link', '/rent')} onChange={(v) => update('hero_btn1_link', v)} />
            <SettingField label="Style" type="select" value={get('hero_btn1_style', 'outline-white')} onChange={(v) => update('hero_btn1_style', v)} options={BTN_STYLE_OPTIONS} />
            <SettingField label="Show Button" type="toggle" value={get('hero_btn1_visible', 'true')} onChange={(v) => update('hero_btn1_visible', v)} />
          </div>
        </div>

        <div className="border border-stone-100 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Button 2 (BUY)</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField label="Label" type="text" value={get('hero_btn2_label', 'BUY')} onChange={(v) => update('hero_btn2_label', v)} />
            <SettingField label="Link" type="text" value={get('hero_btn2_link', '/buy')} onChange={(v) => update('hero_btn2_link', v)} />
            <SettingField label="Style" type="select" value={get('hero_btn2_style', 'outline-white')} onChange={(v) => update('hero_btn2_style', v)} options={BTN_STYLE_OPTIONS} />
            <SettingField label="Show Button" type="toggle" value={get('hero_btn2_visible', 'true')} onChange={(v) => update('hero_btn2_visible', v)} />
          </div>
        </div>

        <div className="border border-stone-100 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Button 3 (EVALUATION)</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField label="Label" type="text" value={get('hero_btn3_label', 'EVALUATION')} onChange={(v) => update('hero_btn3_label', v)} />
            <SettingField label="Link" type="text" value={get('hero_btn3_link', '/valuation')} onChange={(v) => update('hero_btn3_link', v)} />
            <SettingField label="Style" type="select" value={get('hero_btn3_style', 'outline-white')} onChange={(v) => update('hero_btn3_style', v)} options={BTN_STYLE_OPTIONS} />
            <SettingField label="Show Button" type="toggle" value={get('hero_btn3_visible', 'true')} onChange={(v) => update('hero_btn3_visible', v)} />
          </div>
        </div>

        {/* Button Appearance */}
        <div className="border border-stone-100 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Button Appearance</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField
              label="Button Size"
              type="select"
              value={get('hero_btn_size', 'md')}
              onChange={(v) => update('hero_btn_size', v)}
              options={BTN_SIZE_OPTIONS}
              hint="Controls padding and overall button size."
            />
            <SettingField
              label="Border Radius"
              type="select"
              value={get('hero_btn_radius', 'none')}
              onChange={(v) => update('hero_btn_radius', v)}
              options={BTN_RADIUS_OPTIONS}
            />
            <SettingField
              label="Font Family"
              type="select"
              value={get('hero_btn_font_family', "'Roboto', sans-serif")}
              onChange={(v) => update('hero_btn_font_family', v)}
              options={FONT_FAMILY_OPTIONS}
            />
            <SettingField
              label="Font Weight"
              type="select"
              value={get('hero_btn_font_weight', '500')}
              onChange={(v) => update('hero_btn_font_weight', v)}
              options={FONT_WEIGHT_OPTIONS}
            />
            <SettingField
              label="Font Size"
              type="number"
              value={get('hero_btn_font_size', '13')}
              onChange={(v) => update('hero_btn_font_size', v)}
              unit="px"
              min={10}
              max={24}
            />
            <SettingField
              label="Letter Spacing"
              type="number"
              value={get('hero_btn_letter_spacing', '6.3')}
              onChange={(v) => update('hero_btn_letter_spacing', v)}
              unit="px"
              min={0}
              max={20}
            />
            <SettingField
              label="Text Transform"
              type="select"
              value={get('hero_btn_text_transform', 'uppercase')}
              onChange={(v) => update('hero_btn_text_transform', v)}
              options={TEXT_TRANSFORM_OPTIONS}
            />
            <SettingField
              label="Button Text Color"
              type="color"
              value={get('hero_btn_text_color', '#ffffff')}
              onChange={(v) => update('hero_btn_text_color', v)}
            />
            <SettingField
              label="Hover Text Color"
              type="color"
              value={get('hero_btn_hover_text', '#001731')}
              onChange={(v) => update('hero_btn_hover_text', v)}
            />
          </div>
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
