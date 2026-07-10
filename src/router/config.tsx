import { Navigate, type RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/home/page';
import BuyPage from '@/pages/buy/page';
import RentPage from '@/pages/rent/page';
import AdminLogin from '@/pages/admin/login/page';
import AgentRegister from '@/pages/agent/register/page';
import AgentLayout from '@/pages/agent/components/AgentLayout';
import AgentDashboard from '@/pages/agent/dashboard/page';
import AgentListings from '@/pages/agent/listings/page';
import AgentLeads from '@/pages/agent/leads/page';
import AgentProfile from '@/pages/agent/profile/page';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import ProtectedRoute from '@/pages/admin/components/ProtectedRoute';
import AdminDashboard from '@/pages/admin/dashboard/page';
import AdminListings from '@/pages/admin/listings/page';
import ListingFormPage from '@/pages/admin/listings/ListingFormPage';
import AdminJVDesk from '@/pages/admin/jv-desk/page';
import AdminNeighborhoods from '@/pages/admin/neighborhoods/page';
import NeighborhoodFormPage from '@/pages/admin/neighborhoods/NeighborhoodFormPage';
import AdminAgents from '@/pages/admin/agents/page';
import AgentFormPage from '@/pages/admin/agents/AgentFormPage';
import AdminLeads from '@/pages/admin/leads/page';
import AdminDeals from '@/pages/admin/deals/page';
import AdminHomepage from '@/pages/admin/homepage/page';
import AdminTestimonials from '@/pages/admin/testimonials/page';
import AdminBlog from '@/pages/admin/blog/page';
import BlogFormPage from '@/pages/admin/blog/BlogFormPage';
import AdminMedia from '@/pages/admin/media/page';
import AdminSEO from '@/pages/admin/seo/page';
import AdminSettings from '@/pages/admin/settings/page';
import AdminUsers from '@/pages/admin/users/page';
import ManagementWrapper from '@/pages/admin/management/ManagementWrapper';
import GeneralMgmt from '@/pages/admin/management/general/page';
import BrandingMgmt from '@/pages/admin/management/branding/page';
import CurrencyMgmt from '@/pages/admin/management/currency/page';
import TypographyMgmt from '@/pages/admin/management/typography/page';
import SearchMgmt from '@/pages/admin/management/search/page';
import PropertyMgmt from '@/pages/admin/management/property/page';
import RequiredMgmt from '@/pages/admin/management/required/page';
import HomepageControlsMgmt from '@/pages/admin/management/homepage/page';
import BreadcrumbsMgmt from '@/pages/admin/management/breadcrumbs/page';
import ContactMgmt from '@/pages/admin/management/contact/page';
import SocialMgmt from '@/pages/admin/management/social/page';
import MapsMgmt from '@/pages/admin/management/maps/page';
import CacheMgmt from '@/pages/admin/management/cache/page';
import DashboardMenuMgmt from '@/pages/admin/management/dashboard-menu/page';
import PropertyDetailsMgmt from '@/pages/admin/management/property-details/page';
import NeighborhoodsMgmt from '@/pages/admin/management/neighborhoods/page';
import ListingsPagesMgmt from '@/pages/admin/management/listings-pages/page';
import PropertyFormLayoutMgmt from '@/pages/admin/management/property-form-layout/page';
import StylingCardsMgmt from '@/pages/admin/management/styling-cards/page';
import StylingDetailsMgmt from '@/pages/admin/management/styling-details/page';
import HeroMgmt from '@/pages/admin/management/hero/page';
import LandlordsMgmt from '@/pages/admin/management/landlords/page';
import LandlordsPageMgmt from '@/pages/admin/management/landlords-page/page';
import NewDevelopmentsMgmt from '@/pages/admin/management/new-developments/page';
import AboutMgmt from '@/pages/admin/management/about/page';
import ContactPageMgmt from '@/pages/admin/management/contact-page/page';
import NeighbourhoodsPageMgmt from '@/pages/admin/management/neighbourhoods-page/page';
import PropertyCardsMgmt from '@/pages/admin/management/property-cards/page';
import DesignSystemMgmt from '@/pages/admin/management/design-system/page';
import ComponentSettingsMgmt from '@/pages/admin/management/component-settings/page';
import PageBuilderMgmt from '@/pages/admin/management/page-builder/page';
import NavigationSettingsMgmt from '@/pages/admin/management/navigation-settings/page';
import PropertyLayoutMgmt from '@/pages/admin/management/property-layout/page';
import NeighbourhoodDetailPage from '@/pages/neighbourhood/page';
import NbHistoryPage from '@/pages/neighbourhood/components/NbHistoryPage';
import BlogPostPage from '@/pages/blog/PostPage';
import NeighbourhoodsPage from '@/pages/neighbourhoods/page';
import PropertyDetailPage from '@/pages/property/page';
import LandlordsPage from '@/pages/landlords/page';
import ContactPage from '@/pages/contact/page';
import NewDevelopmentsPage from '@/pages/new-developments/page';
import SearchPage from '@/pages/search/page';
import ResetPasswordPage from '@/pages/admin/reset-password/page';
import AllPropertiesPage from '@/pages/all-properties/page';
import AdminSetup from '@/pages/admin/setup/page';
import AgentLogin from '@/pages/agent/login/page';
import AgentResetPasswordPage from '@/pages/agent/reset-password/page';
import AgentPublicProfile from '@/pages/agent-profile/page';
import AdminMessages from '@/pages/admin/messages/page';
import AdminInsights from '@/pages/admin/insights/page';
import AdminActivities from '@/pages/admin/activities/page';
import AdminFavorites from '@/pages/admin/favorites/page';
import AdminSavedSearches from '@/pages/admin/saved-searches/page';
import AdminInquiries from '@/pages/admin/inquiries/page';
import AdminProfilePage from '@/pages/admin/profile/page';
import AboutPage from '@/pages/about/page';
import JointVenturePage from '@/pages/joint-venture/page';
import LandDetailPage from '@/pages/land/page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/buy',
    element: <BuyPage />,
  },
  {
    path: '/all-properties',
    element: <AllPropertiesPage />,
  },
  {
    path: '/rent',
    element: <RentPage />,
  },
  {
    path: '/neighbourhoods',
    element: <NeighbourhoodsPage />,
  },
  {
    path: '/neighbourhood/:slug',
    element: <NeighbourhoodDetailPage />,
  },
  {
    path: '/neighbourhood/:slug/history',
    element: <NbHistoryPage />,
  },
  {
    path: '/blog',
    element: <Navigate to="/neighbourhoods" replace />,
  },
  {
    path: '/blog/:slug',
    element: <BlogPostPage />,
  },
  {
    path: '/property/:slug',
    element: <PropertyDetailPage />,
  },
  {
    path: '/valuation',
    element: <Navigate to="/landlords" replace />,
  },
  {
    path: '/landlords',
    element: <LandlordsPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/new-developments',
    element: <NewDevelopmentsPage />,
  },
  {
    path: '/joint-venture',
    element: <JointVenturePage />,
  },
  {
    path: '/land/:slug',
    element: <LandDetailPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/agents/:id',
    element: <AgentPublicProfile />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/setup',
    element: <AdminSetup />,
  },
  {
    path: '/admin/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/agent/register',
    element: <AgentRegister />,
  },
  {
    path: '/agent/login',
    element: <AgentLogin />,
  },
  {
    path: '/agent/reset-password',
    element: <AgentResetPasswordPage />,
  },
  {
    path: '/agent',
    element: <AgentLayout />,
    children: [
      { index: true, element: <Navigate to="/agent/dashboard" replace /> },
      { path: 'dashboard', element: <AgentDashboard /> },
      { path: 'listings', element: <AgentListings /> },
      { path: 'leads', element: <AgentLeads /> },
      { path: 'viewings', element: <AgentListings /> },
      { path: 'performance', element: <AgentListings /> },
      { path: 'profile', element: <AgentProfile /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'listings',
        element: <AdminListings />,
      },
      {
        path: 'listings/new',
        element: <ListingFormPage />,
      },
      {
        path: 'listings/:id',
        element: <ListingFormPage />,
      },
      {
        path: 'jv-desk',
        element: <AdminJVDesk />,
      },
      {
        path: 'neighborhoods',
        element: <AdminNeighborhoods />,
      },
      {
        path: 'neighborhoods/new',
        element: <NeighborhoodFormPage />,
      },
      {
        path: 'neighborhoods/:id',
        element: <NeighborhoodFormPage />,
      },
      {
        path: 'agents',
        element: <AdminAgents />,
      },
      {
        path: 'agents/new',
        element: <AgentFormPage />,
      },
      {
        path: 'agents/:id',
        element: <AgentFormPage />,
      },
      {
        path: 'leads',
        element: <AdminLeads />,
      },
      {
        path: 'deals',
        element: <AdminDeals />,
      },
      {
        path: 'messages',
        element: <AdminMessages />,
      },
      {
        path: 'insights',
        element: <AdminInsights />,
      },
      {
        path: 'activities',
        element: <AdminActivities />,
      },
      {
        path: 'favorites',
        element: <AdminFavorites />,
      },
      {
        path: 'saved-searches',
        element: <AdminSavedSearches />,
      },
      {
        path: 'inquiries',
        element: <AdminInquiries />,
      },
      {
        path: 'homepage',
        element: <AdminHomepage />,
      },
      {
        path: 'testimonials',
        element: <AdminTestimonials />,
      },
      {
        path: 'blog',
        element: <AdminBlog />,
      },
      {
        path: 'blog/new',
        element: <BlogFormPage />,
      },
      {
        path: 'blog/:id',
        element: <BlogFormPage />,
      },
      {
        path: 'media',
        element: <AdminMedia />,
      },
      {
        path: 'seo',
        element: <AdminSEO />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
      {
        path: 'profile',
        element: <AdminProfilePage />,
      },
      {
        path: 'management',
        element: <ManagementWrapper />,
        children: [
          { index: true, element: <Navigate to="/admin/management/general" replace /> },
          { path: 'general', element: <GeneralMgmt /> },
          { path: 'branding', element: <BrandingMgmt /> },
          { path: 'currency', element: <CurrencyMgmt /> },
          { path: 'typography', element: <TypographyMgmt /> },
          { path: 'search', element: <SearchMgmt /> },
          { path: 'property', element: <PropertyMgmt /> },
          { path: 'required', element: <RequiredMgmt /> },
          { path: 'homepage', element: <HomepageControlsMgmt /> },
          { path: 'breadcrumbs', element: <BreadcrumbsMgmt /> },
          { path: 'contact', element: <ContactMgmt /> },
          { path: 'social', element: <SocialMgmt /> },
          { path: 'maps', element: <MapsMgmt /> },
          { path: 'cache', element: <CacheMgmt /> },
          { path: 'dashboard-menu', element: <DashboardMenuMgmt /> },
          { path: 'property-details', element: <PropertyDetailsMgmt /> },
          { path: 'neighborhoods', element: <NeighborhoodsMgmt /> },
          { path: 'listings-pages', element: <ListingsPagesMgmt /> },
          { path: 'property-form-layout', element: <PropertyFormLayoutMgmt /> },
          { path: 'styling-cards', element: <StylingCardsMgmt /> },
          { path: 'styling-details', element: <StylingDetailsMgmt /> },
          { path: 'hero', element: <HeroMgmt /> },
          { path: 'landlords', element: <LandlordsMgmt /> },
          { path: 'landlords-page', element: <LandlordsPageMgmt /> },
          { path: 'new-developments', element: <NewDevelopmentsMgmt /> },
          { path: 'about', element: <AboutMgmt /> },
          { path: 'contact-page', element: <ContactPageMgmt /> },
          { path: 'neighbourhoods-page', element: <NeighbourhoodsPageMgmt /> },
          { path: 'property-cards', element: <PropertyCardsMgmt /> },
          { path: 'design-system', element: <DesignSystemMgmt /> },
          { path: 'component-settings', element: <ComponentSettingsMgmt /> },
          { path: 'page-builder', element: <PageBuilderMgmt /> },
          { path: 'navigation-settings', element: <NavigationSettingsMgmt /> },
          { path: 'property-layout', element: <PropertyLayoutMgmt /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
