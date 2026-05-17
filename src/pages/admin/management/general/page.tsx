import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

const TIMEZONES = [
  { value: 'Africa/Kampala', label: 'Africa/Kampala (EAT, UTC+3)' },
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT, UTC+3)' },
  { value: 'Europe/London', label: 'Europe/London (UTC/BST)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST, UTC+4)' },
];

export default function GeneralManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('general_mgmt');

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
        icon="ri-settings-3-line"
        title="General Settings"
        description="Core site behaviour, listing defaults, and notification preferences."
      />

      {/* Site Identity */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Site Identity</h3>
        <SettingField label="Site Name" value={get('mgmt_site_name')} onChange={(v) => update('mgmt_site_name', v)} placeholder="Oceans Uganda" />
        <SettingField label="Site Tagline" value={get('mgmt_site_tagline')} onChange={(v) => update('mgmt_site_tagline', v)} placeholder="Premium Real Estate in Uganda" />
        <SettingField
          label="Timezone"
          type="select"
          value={get('mgmt_timezone', 'Africa/Kampala')}
          onChange={(v) => update('mgmt_timezone', v)}
          options={TIMEZONES}
          hint="Used for scheduled listings, inquiry timestamps, and blog publish times."
        />
        <SettingField
          label="Admin Notification Email"
          type="email"
          value={get('mgmt_admin_email')}
          onChange={(v) => update('mgmt_admin_email', v)}
          placeholder="admin@oceansug.com"
          hint="New leads and inquiries will be emailed to this address."
        />
      </div>

      {/* Listings Display */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Listings Display</h3>
        <SettingField
          label="Listings Per Page"
          type="number"
          value={get('mgmt_listings_per_page', '12')}
          onChange={(v) => update('mgmt_listings_per_page', v)}
          min={4}
          max={48}
          unit="listings"
          hint="Number of property cards shown per page on Browse/Search pages."
        />
        <SettingField
          label="Featured Listings Count on Homepage"
          type="number"
          value={get('mgmt_featured_count', '6')}
          onChange={(v) => update('mgmt_featured_count', v)}
          min={2}
          max={12}
          unit="listings"
        />
        <SettingField
          label="Show Price on Listing Cards"
          type="toggle"
          value={get('mgmt_show_price_on_listing', 'true')}
          onChange={(v) => update('mgmt_show_price_on_listing', v)}
          hint="Toggle off to display &lsquo;Contact for Price&rsquo; on all cards."
        />
        <SettingField
          label="Show Agent on Listing Cards"
          type="toggle"
          value={get('mgmt_show_agent_on_listing', 'true')}
          onChange={(v) => update('mgmt_show_agent_on_listing', v)}
        />
      </div>

      {/* Inquiry & Notifications */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Inquiries & Notifications</h3>
        <SettingField
          label="Allow Public Inquiries"
          type="toggle"
          value={get('mgmt_allow_inquiries', 'true')}
          onChange={(v) => update('mgmt_allow_inquiries', v)}
          hint="Disabling this hides all contact/inquiry forms on the public site."
        />
        <SettingField
          label="Email Notification on New Inquiry"
          type="toggle"
          value={get('mgmt_inquiry_email_notify', 'true')}
          onChange={(v) => update('mgmt_inquiry_email_notify', v)}
          hint="Send an email to the Admin Notification Email above whenever a new lead is submitted."
        />
      </div>

      {/* Form Redirects */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Form Redirects</h3>
        <p className="text-xs text-stone-400">Where users are sent after successfully submitting a form. Default is homepage (/).</p>
        <SettingField
          label="Contact Form — Redirect After Submit"
          type="text"
          value={get('form_redirect_contact', '/')}
          onChange={(v) => update('form_redirect_contact', v)}
          placeholder="/"
          hint="URL path to redirect to after contact form submission. e.g. / or /thank-you"
        />
        <SettingField
          label="Landlord Enquiry — Redirect After Submit"
          type="text"
          value={get('form_redirect_landlord', '/')}
          onChange={(v) => update('form_redirect_landlord', v)}
          placeholder="/"
          hint="URL path to redirect to after landlord enquiry submission."
        />
      </div>

      {/* Maintenance */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Maintenance Mode</h3>
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <i className="ri-alert-line text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            When enabled, the public website shows a &quot;Coming Soon&quot; page. The admin panel remains fully accessible.
          </p>
        </div>
        <SettingField
          label="Maintenance Mode"
          type="toggle"
          value={get('mgmt_maintenance_mode', 'false')}
          onChange={(v) => update('mgmt_maintenance_mode', v)}
        />
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
