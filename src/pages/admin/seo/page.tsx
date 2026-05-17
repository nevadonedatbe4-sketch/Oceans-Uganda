import AdminComingSoon from '@/pages/admin/components/AdminComingSoon';

export default function AdminSEO() {
  return (
    <AdminComingSoon
      title="SEO Settings"
      icon="ri-search-eye-line"
      phase="Phase 8"
      description="Manage global and per-page SEO — meta titles, descriptions, OG images, and structured data to maximise Google visibility."
      features={[
        'Global default SEO title and description',
        'Per-page title and meta description',
        'OG image and social share previews',
        'Canonical URL management',
        'Google Maps and geo tags',
        'Schema.org structured data for properties',
      ]}
    />
  );
}
