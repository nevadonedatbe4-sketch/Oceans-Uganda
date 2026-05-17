import AdminComingSoon from '@/pages/admin/components/AdminComingSoon';

export default function AdminDeals() {
  return (
    <AdminComingSoon
      title="Deals Pipeline"
      icon="ri-shake-hands-line"
      phase="Phase 4"
      description="Visual sales pipeline to track every deal from inquiry through to closed — know your team's progress at a glance."
      features={[
        'Kanban board view of all active deals',
        'Drag deals between pipeline stages',
        'Link deals to listings and agents',
        'Track expected deal value',
        'Add notes and next actions',
        'Timeline per deal',
      ]}
    />
  );
}
