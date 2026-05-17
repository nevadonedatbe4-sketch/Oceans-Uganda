import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

const FONT_FAMILIES = [
  { value: '', label: 'Site Default' },
  { value: 'Prata', label: 'Prata (Serif)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Serif)' },
  { value: 'Montserrat', label: 'Montserrat (Sans-serif)' },
  { value: 'Roboto', label: 'Roboto (Sans-serif)' },
  { value: 'Lato', label: 'Lato (Sans-serif)' },
  { value: 'Raleway', label: 'Raleway (Sans-serif)' },
  { value: 'Inter', label: 'Inter (Sans-serif)' },
];

const FONT_WEIGHTS = [
  { value: '300', label: '300 — Light' },
  { value: '400', label: '400 — Regular' },
  { value: '500', label: '500 — Medium' },
  { value: '600', label: '600 — SemiBold' },
  { value: '700', label: '700 — Bold' },
  { value: '800', label: '800 — ExtraBold' },
];

const TEXT_TRANSFORMS = [
  { value: 'none', label: 'Normal' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'capitalize', label: 'Capitalize' },
  { value: 'lowercase', label: 'lowercase' },
];

export default function ContactManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('contact');

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
        icon="ri-contacts-book-2-line"
        title="Contact & Company Info"
        description="All contact details shown on the public site — contact page, footer, inquiry forms, and agent cards."
      />

      {/* PAGE IMAGES */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
        <div className="flex items-center gap-2">
          <i className="ri-image-2-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Page Images</h3>
        </div>
        <p className="text-xs text-stone-400 -mt-2">Upload images that appear on the public Contact page. Click "Upload from Device" to pick a file from your PC or mobile.</p>

        <SettingField
          label="Contact Page Hero Background"
          type="image_upload"
          value={get('contact_hero_image', '')}
          onChange={(v) => update('contact_hero_image', v)}
          hint="Full-width background image behind the 'Get In Touch' hero. Recommended: landscape, at least 1920×650px."
        />

        <div className="border-t border-stone-100" />

        <SettingField
          label="Contact Sidebar / Office Photo"
          type="image_upload"
          value={get('contact_office_image', '')}
          onChange={(v) => update('contact_office_image', v)}
          hint="Optional photo shown in the contact sidebar or office section. Recommended: portrait or square."
        />
      </div>

      {/* Company Identity */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Company Identity</h3>
        <SettingField
          label="Company Name"
          value={get('company_name', 'Oceans Uganda')}
          onChange={(v) => update('company_name', v)}
          placeholder="Oceans Uganda"
          hint="Used in footer copyright, page titles, and email signatures."
        />
        <SettingField
          label="Office Address"
          type="textarea"
          value={get('office_address')}
          onChange={(v) => update('office_address', v)}
          placeholder="Plot 15, Acacia Avenue, Kololo, Kampala, Uganda"
          hint="Displayed in the header/hero contact strip and on the Contact page."
        />
        <SettingField
          label="Footer Address"
          type="textarea"
          value={get('footer_address')}
          onChange={(v) => update('footer_address', v)}
          placeholder="Plot 15, Acacia Avenue, Kololo, Kampala, Uganda"
          hint="Can differ from office address — often shorter for footer use."
        />
      </div>

      {/* Phone & WhatsApp */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Phone Numbers</h3>
        <SettingField
          label="Primary Phone"
          type="tel"
          value={get('phone')}
          onChange={(v) => update('phone', v)}
          placeholder="+256 (0) 700 123 456"
          hint="Displayed in the header, footer, and contact page."
        />
        <SettingField
          label="Secondary Phone"
          type="tel"
          value={get('phone_secondary')}
          onChange={(v) => update('phone_secondary', v)}
          placeholder="+256 (0) 701 000 000"
          hint="Optional — shown alongside primary on contact page."
        />
        <SettingField
          label="WhatsApp Number"
          type="tel"
          value={get('whatsapp')}
          onChange={(v) => update('whatsapp', v)}
          placeholder="+256700123456"
          hint="Used for the WhatsApp chat button. Numbers only — no spaces or dashes."
        />
      </div>

      {/* Email */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Email Addresses</h3>
        <SettingField
          label="Primary / General Email"
          type="email"
          value={get('email')}
          onChange={(v) => update('email', v)}
          placeholder="info@oceansuganda.com"
          hint="Shown in footer, contact page, and inquiry forms."
        />
        <SettingField
          label="Sales / Bookings Email"
          type="email"
          value={get('sales_email')}
          onChange={(v) => update('sales_email', v)}
          placeholder="sales@oceansuganda.com"
          hint="Used for property inquiry notifications and booking confirmations."
        />
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Working Hours</h3>
        <p className="text-xs text-stone-400">Displayed on the Contact page and in footer where applicable.</p>
        <SettingField
          label="Weekday Hours"
          value={get('working_hours_weekday', 'Monday – Friday: 8:00 AM – 6:00 PM')}
          onChange={(v) => update('working_hours_weekday', v)}
          placeholder="Monday – Friday: 8:00 AM – 6:00 PM"
        />
        <SettingField
          label="Saturday Hours"
          value={get('working_hours_saturday', 'Saturday: 9:00 AM – 4:00 PM')}
          onChange={(v) => update('working_hours_saturday', v)}
          placeholder="Saturday: 9:00 AM – 4:00 PM"
        />
        <SettingField
          label="Sunday / Holiday Hours"
          value={get('working_hours_sunday', 'Sunday: Closed')}
          onChange={(v) => update('working_hours_sunday', v)}
          placeholder="Sunday: Closed"
        />
      </div>

      {/* Maps */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Map</h3>
        <SettingField
          label="Google Maps Link"
          type="url"
          value={get('google_maps_link')}
          onChange={(v) => update('google_maps_link', v)}
          placeholder="https://maps.google.com/..."
          hint="Full Google Maps URL — used for &lsquo;Get Directions&rsquo; link."
        />
        <SettingField
          label="Google Maps Embed URL (iframe src)"
          type="url"
          value={get('google_maps_embed')}
          onChange={(v) => update('google_maps_embed', v)}
          placeholder="https://www.google.com/maps/embed?pb=..."
          hint='Paste the embed URL from Google Maps → Share → Embed a map → copy the src="" value.'
        />
        {get('google_maps_embed') && (
          <div className="rounded-lg overflow-hidden border border-stone-200 h-48">
            <iframe
              title="Office Map"
              src={get('google_maps_embed')}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>

      {/* TYPOGRAPHY */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-6">
        <div className="flex items-center gap-2">
          <i className="ri-font-size text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Typography</h3>
        </div>
        <p className="text-xs text-stone-400 -mt-2">Control fonts for the Contact section heading, subtitle, and body text on the homepage contact block.</p>

        {/* Section Heading */}
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Section Heading ("Contact Us")</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField label="Font Family" type="select" value={get('contact_heading_font_family', 'Prata')} onChange={(v) => update('contact_heading_font_family', v)} options={FONT_FAMILIES} />
            <SettingField label="Font Weight" type="select" value={get('contact_heading_font_weight', '400')} onChange={(v) => update('contact_heading_font_weight', v)} options={FONT_WEIGHTS} />
            <SettingField label="Font Size" type="number" value={get('contact_heading_font_size', '24')} onChange={(v) => update('contact_heading_font_size', v)} unit="px" min={16} max={72} />
            <SettingField label="Letter Spacing" type="number" value={get('contact_heading_letter_spacing', '0')} onChange={(v) => update('contact_heading_letter_spacing', v)} unit="em" />
            <SettingField label="Line Height" type="number" value={get('contact_heading_line_height', '1.2')} onChange={(v) => update('contact_heading_line_height', v)} placeholder="1.2" />
            <SettingField label="Text Transform" type="select" value={get('contact_heading_transform', 'none')} onChange={(v) => update('contact_heading_transform', v)} options={TEXT_TRANSFORMS} />
          </div>
        </div>

        <div className="border-t border-stone-100" />

        {/* Subtitle */}
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Subtitle / Tagline</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField label="Font Family" type="select" value={get('contact_subtitle_font_family', '')} onChange={(v) => update('contact_subtitle_font_family', v)} options={FONT_FAMILIES} />
            <SettingField label="Font Weight" type="select" value={get('contact_subtitle_font_weight', '400')} onChange={(v) => update('contact_subtitle_font_weight', v)} options={FONT_WEIGHTS} />
            <SettingField label="Font Size" type="number" value={get('contact_subtitle_font_size', '14')} onChange={(v) => update('contact_subtitle_font_size', v)} unit="px" min={10} max={32} />
            <SettingField label="Letter Spacing" type="number" value={get('contact_subtitle_letter_spacing', '0')} onChange={(v) => update('contact_subtitle_letter_spacing', v)} unit="em" />
          </div>
        </div>

        <div className="border-t border-stone-100" />

        {/* Body / Info Text */}
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Contact Info Text</p>
          <div className="grid grid-cols-2 gap-3">
            <SettingField label="Font Family" type="select" value={get('contact_body_font_family', '')} onChange={(v) => update('contact_body_font_family', v)} options={FONT_FAMILIES} />
            <SettingField label="Font Weight" type="select" value={get('contact_body_font_weight', '400')} onChange={(v) => update('contact_body_font_weight', v)} options={FONT_WEIGHTS} />
            <SettingField label="Font Size" type="number" value={get('contact_body_font_size', '14')} onChange={(v) => update('contact_body_font_size', v)} unit="px" min={10} max={24} />
            <SettingField label="Letter Spacing" type="number" value={get('contact_body_letter_spacing', '0')} onChange={(v) => update('contact_body_letter_spacing', v)} unit="em" />
            <SettingField label="Line Height" type="number" value={get('contact_body_line_height', '1.6')} onChange={(v) => update('contact_body_line_height', v)} placeholder="1.6" />
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-lg bg-[#f5f5f5] border border-stone-100 p-4 space-y-2">
          <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-2">Live Preview</p>
          <h2
            style={{
              fontFamily: get('contact_heading_font_family', 'Prata') || undefined,
              fontWeight: get('contact_heading_font_weight', '400'),
              fontSize: `${get('contact_heading_font_size', '24')}px`,
              letterSpacing: `${get('contact_heading_letter_spacing', '0')}em`,
              lineHeight: get('contact_heading_line_height', '1.2'),
              textTransform: (get('contact_heading_transform', 'none') as 'none' | 'uppercase' | 'capitalize' | 'lowercase'),
              color: '#001731',
            }}
          >
            Contact Us
          </h2>
          <p
            style={{
              fontFamily: get('contact_subtitle_font_family', '') || undefined,
              fontWeight: get('contact_subtitle_font_weight', '400'),
              fontSize: `${get('contact_subtitle_font_size', '14')}px`,
              letterSpacing: `${get('contact_subtitle_letter_spacing', '0')}em`,
              color: '#6B7280',
              whiteSpace: 'nowrap',
            }}
          >
            Buying, Renting or Leasing Prime Residential?
          </p>
          <p
            style={{
              fontFamily: get('contact_body_font_family', '') || undefined,
              fontWeight: get('contact_body_font_weight', '400'),
              fontSize: `${get('contact_body_font_size', '14')}px`,
              letterSpacing: `${get('contact_body_letter_spacing', '0')}em`,
              lineHeight: get('contact_body_line_height', '1.6'),
              color: '#374151',
            }}
          >
            {get('phone', '+256 (0) 741 573131')} · {get('email', 'info@oceansuganda.com')}
          </p>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Contact Card Preview</h3>
        <div className="bg-[#f5f5f5] rounded-lg p-4 space-y-3">
          {get('company_name') && <p className="text-sm font-semibold text-stone-800">{get('company_name')}</p>}
          {get('phone') && (
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/10 rounded"><i className="ri-phone-line text-[#1B4332] text-sm" /></span>
              <span className="text-sm text-stone-700">{get('phone')}{get('phone_secondary') ? ` · ${get('phone_secondary')}` : ''}</span>
            </div>
          )}
          {get('whatsapp') && (
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 flex items-center justify-center bg-[#25D366]/10 rounded"><i className="ri-whatsapp-line text-[#25D366] text-sm" /></span>
              <span className="text-sm text-stone-700">{get('whatsapp')}</span>
            </div>
          )}
          {get('email') && (
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/10 rounded"><i className="ri-mail-line text-[#1B4332] text-sm" /></span>
              <span className="text-sm text-stone-700">{get('email')}</span>
            </div>
          )}
          {get('office_address') && (
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/10 rounded shrink-0"><i className="ri-map-pin-line text-[#1B4332] text-sm" /></span>
              <span className="text-sm text-stone-700">{get('office_address')}</span>
            </div>
          )}
          {get('working_hours_weekday') && (
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/10 rounded shrink-0"><i className="ri-time-line text-[#1B4332] text-sm" /></span>
              <div className="text-sm text-stone-700 space-y-0.5">
                <p>{get('working_hours_weekday')}</p>
                {get('working_hours_saturday') && <p>{get('working_hours_saturday')}</p>}
                {get('working_hours_sunday') && <p>{get('working_hours_sunday')}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
