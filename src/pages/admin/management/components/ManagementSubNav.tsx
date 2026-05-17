import { Link, useLocation } from 'react-router-dom';

interface NavGroup {
  label: string;
  items: { path: string; label: string; icon: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Design System',
    items: [
      { path: '/admin/management/design-system', label: 'Global Design System', icon: 'ri-palette-line' },
      { path: '/admin/management/component-settings', label: 'Component Settings', icon: 'ri-puzzle-2-line' },
      { path: '/admin/management/page-builder', label: 'Page Builder', icon: 'ri-layout-masonry-line' },
      { path: '/admin/management/navigation-settings', label: 'Navigation Settings', icon: 'ri-navigation-line' },
    ],
  },
  {
    label: 'Frontend Control',
    items: [
      { path: '/admin/management/design-system', label: 'Design System Hub', icon: 'ri-palette-line' },
      { path: '/admin/management/design-system', label: 'Colour Palette', icon: 'ri-drop-fill' },
      { path: '/admin/management/design-system', label: 'Typography System', icon: 'ri-text' },
      { path: '/admin/management/design-system', label: 'Spacing & Sizes', icon: 'ri-layout-4-line' },
      { path: '/admin/management/design-system', label: 'Card Box System', icon: 'ri-layout-grid-2-line' },
      { path: '/admin/management/design-system', label: 'Button System', icon: 'ri-cursor-line' },
      { path: '/admin/management/design-system', label: 'Card v7 (Content/Style/Advanced)', icon: 'ri-layout-masonry-line' },
      { path: '/admin/management/design-system', label: 'Carousel + Dots System', icon: 'ri-slideshow-3-line' },
      { path: '/admin/management/design-system', label: 'Global Page Control', icon: 'ri-pages-line' },
      { path: '/admin/management/design-system', label: 'Responsive Control', icon: 'ri-device-line' },
    ],
  },
  {
    label: 'Site Identity',
    items: [
      { path: '/admin/management/general', label: 'General', icon: 'ri-settings-3-line' },
      { path: '/admin/management/branding', label: 'Logos & Branding', icon: 'ri-image-edit-line' },
      { path: '/admin/management/typography', label: 'Typography', icon: 'ri-text' },
    ],
  },
  {
    label: 'Listings & Search',
    items: [
      { path: '/admin/management/currency', label: 'Price & Currency', icon: 'ri-currency-line' },
      { path: '/admin/management/property', label: 'Property Settings', icon: 'ri-building-2-line' },
      { path: '/admin/management/property-details', label: 'Property Details', icon: 'ri-article-line' },
      { path: '/admin/management/listings-pages', label: 'Listings Pages', icon: 'ri-layout-grid-line' },
      { path: '/admin/management/search', label: 'Search & Filters', icon: 'ri-search-2-line' },
      { path: '/admin/management/required', label: 'Required Fields', icon: 'ri-checkbox-circle-line' },
      { path: '/admin/management/property-form-layout', label: 'Form Layout Manager', icon: 'ri-layout-masonry-line' },
      { path: '/admin/management/property-layout', label: 'Property Detail Layout', icon: 'ri-table-alt-line' },
    ],
  },
  {
    label: 'Content & Pages',
    items: [
      { path: '/admin/management/homepage', label: 'Homepage Controls', icon: 'ri-layout-top-line' },
      { path: '/admin/management/hero', label: 'Hero Section', icon: 'ri-image-2-line' },
      { path: '/admin/management/neighborhoods', label: 'Neighbourhoods (Homepage)', icon: 'ri-map-pin-2-line' },
      { path: '/admin/management/breadcrumbs', label: 'Breadcrumbs', icon: 'ri-arrow-right-s-line' },
      { path: '/admin/management/dashboard-menu', label: 'Dashboard Menu', icon: 'ri-layout-left-2-line' },
    ],
  },
  {
    label: 'Page Management',
    items: [
      { path: '/admin/management/landlords-page', label: 'Landlords Page', icon: 'ri-home-heart-line' },
      { path: '/admin/management/landlords', label: 'Landlords — Images & Text', icon: 'ri-image-edit-line' },
      { path: '/admin/management/new-developments', label: 'New Developments Page', icon: 'ri-building-3-line' },
      { path: '/admin/management/about', label: 'About Us Page', icon: 'ri-information-line' },
      { path: '/admin/management/contact-page', label: 'Contact Page', icon: 'ri-mail-send-line' },
      { path: '/admin/management/neighbourhoods-page', label: 'Neighbourhoods Page', icon: 'ri-map-2-line' },
    ],
  },
  {
    label: 'Company Info',
    items: [
      { path: '/admin/management/contact', label: 'Contact & Company', icon: 'ri-contacts-book-2-line' },
      { path: '/admin/management/social', label: 'Social Media Links', icon: 'ri-share-box-line' },
      { path: '/admin/management/maps', label: 'Maps & Location', icon: 'ri-map-pin-2-line' },
    ],
  },
  {
    label: 'Styling',
    items: [
      { path: '/admin/management/styling-cards', label: 'Property Cards', icon: 'ri-layout-grid-line' },
      { path: '/admin/management/styling-details', label: 'Property Details', icon: 'ri-article-line' },
      { path: '/admin/management/property-cards', label: 'Cards & Carousel', icon: 'ri-layout-grid-2-line' },
    ],
  },
  {
    label: 'System',
    items: [
      { path: '/admin/management/cache', label: 'Save / Sync / Cache', icon: 'ri-database-2-line' },
    ],
  },
];

export default function ManagementSubNav() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path;

  return (
    <aside className="w-[220px] shrink-0 bg-white border-r border-stone-100 overflow-y-auto">
      <div className="px-4 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/10 rounded-md">
            <i className="ri-equalizer-2-line text-[#1B4332] text-base" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800 leading-tight">Management</p>
            <p className="text-[10px] text-stone-400">Options & Controls</p>
          </div>
        </div>
      </div>
      <nav className="px-2 py-3 space-y-0.5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
              {group.label}
            </p>
            {group.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors cursor-pointer whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-[#1B4332]/8 text-[#1B4332] font-medium'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-[#f5f5f5]'
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  <i className={`${item.icon} text-sm`} />
                </span>
                {item.label}
                {isActive(item.path) && (
                  <span className="ml-auto w-1 h-4 rounded-full bg-[#1B4332]" />
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
