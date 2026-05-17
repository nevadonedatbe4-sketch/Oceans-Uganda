import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

export default function RequiredFieldsPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('required_fields');

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
        icon="ri-checkbox-circle-line"
        title="Required Fields"
        description="Define which fields must be filled before a listing or inquiry can be submitted."
      />

      {/* Listing Required Fields */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Listing / Property Form</h3>
        <p className="text-xs text-stone-400 mb-4">
          These fields are enforced when a staff member creates or edits a property listing in the admin panel.
        </p>
        <SettingField label="Title is Required" type="toggle" value={get('req_listing_title', 'true')} onChange={(v) => update('req_listing_title', v)} hint="Listing cannot be published without a title." />
        <SettingField label="Price is Required" type="toggle" value={get('req_listing_price', 'true')} onChange={(v) => update('req_listing_price', v)} hint="Listing cannot be published without a UGX price." />
        <SettingField label="Description is Required" type="toggle" value={get('req_listing_description', 'true')} onChange={(v) => update('req_listing_description', v)} />
        <SettingField label="Location / Address is Required" type="toggle" value={get('req_listing_location', 'true')} onChange={(v) => update('req_listing_location', v)} />
        <SettingField label="At Least 1 Photo Required" type="toggle" value={get('req_listing_photos', 'false')} onChange={(v) => update('req_listing_photos', v)} hint="Block publishing if no photos are attached." />
        <SettingField label="Assigned Agent is Required" type="toggle" value={get('req_listing_agent', 'false')} onChange={(v) => update('req_listing_agent', v)} hint="Require an agent to be assigned before publishing." />
      </div>

      {/* Inquiry Form Required Fields */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Public Inquiry / Contact Form</h3>
        <p className="text-xs text-stone-400 mb-4">
          These fields are enforced on the public property inquiry and contact forms.
        </p>
        <SettingField label="Name Required" type="toggle" value={get('req_inquiry_name', 'true')} onChange={(v) => update('req_inquiry_name', v)} />
        <SettingField label="Email Required" type="toggle" value={get('req_inquiry_email', 'true')} onChange={(v) => update('req_inquiry_email', v)} />
        <SettingField label="Phone Required" type="toggle" value={get('req_inquiry_phone', 'false')} onChange={(v) => update('req_inquiry_phone', v)} hint="Making phone required increases friction but improves lead quality." />
        <SettingField label="Message Required" type="toggle" value={get('req_inquiry_message', 'true')} onChange={(v) => update('req_inquiry_message', v)} />
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
