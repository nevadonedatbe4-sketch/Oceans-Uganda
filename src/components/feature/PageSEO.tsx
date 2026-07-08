import { useEffect } from 'react';
import { useSEO, injectSchemaLD, SITE_URL } from '@/hooks/useSEO';

/* ─────────────── Shared Organisation schema (injected on every page) ─────────────── */
function useOrganisationSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': `${SITE_URL}/#organisation`,
      name: 'Oceans Uganda',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.png`,
        width: 512,
        height: 512,
      },
      telephone: '+256757861270',
      email: 'info@oceans.co.ug',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot 785, Luthuli Avenue',
        addressLocality: 'Bugolobi',
        addressRegion: 'Kampala',
        postalCode: '',
        addressCountry: 'UG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 0.3163,
        longitude: 32.5822,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '14:00',
        },
      ],
      areaServed: {
        '@type': 'City',
        name: 'Kampala',
        containedInPlace: { '@type': 'Country', name: 'Uganda' },
      },
      sameAs: [
        'https://www.facebook.com/oceansuganda',
        'https://www.instagram.com/oceansuganda',
      ],
    };
    return injectSchemaLD('schema-organisation', schema);
  }, []);
}

/* ─────────────── Home Page SEO ─────────────── */
export function HomeSEO() {
  useSEO({
    title: 'Kampala Real Estate | Houses for Sale &amp; Rent | Oceans Uganda',
    description: 'Oceans Uganda — Kampala\'s premier estate agent. Discover premium houses for sale, luxury rentals &amp; prime land in Kololo, Nakasero, Muyenga &amp; across Uganda.',
    keywords: 'Kampala real estate, houses for sale Uganda, property rentals Kampala',
    canonical: '/',
    ogType: 'website',
  });

  useOrganisationSchema();

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Oceans Uganda',
      url: SITE_URL,
      description: 'Kampala\'s leading estate and letting agent specialising in property sales, rentals and management.',
      publisher: { '@id': `${SITE_URL}/#organisation` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
    return injectSchemaLD('schema-home', schema);
  }, []);

  return null;
}

/* ─────────────── Buy Page SEO ─────────────── */
export function BuySEO({ count }: { count: number }) {
  useSEO({
    title: `${count > 0 ? count + ' ' : ''}Properties for Sale in Kampala | Oceans Uganda`,
    description: `Browse ${count > 0 ? count + ' ' : ''}properties for sale in Kampala, Uganda. Luxury houses, apartments &amp; land in Kololo, Nakasero, Muyenga &amp; more. Expert Kampala real estate agents.`,
    keywords: 'properties for sale Kampala, houses for sale Uganda, buy property Kampala',
    canonical: '/buy',
    ogType: 'website',
  });

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/buy#page`,
      name: 'Properties for Sale in Kampala',
      description: 'Browse all properties for sale in Kampala, Uganda with Oceans Uganda estate agents.',
      url: `${SITE_URL}/buy`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Properties for Sale', item: `${SITE_URL}/buy` },
        ],
      },
    };
    return injectSchemaLD('schema-buy', schema);
  }, []);

  return null;
}

/* ─────────────── Rent Page SEO ─────────────── */
export function RentSEO({ count }: { count: number }) {
  useSEO({
    title: `${count > 0 ? count + ' ' : ''}Properties to Rent in Kampala | Oceans Uganda`,
    description: `Find ${count > 0 ? count + ' ' : ''}properties to rent in Kampala, Uganda. Furnished &amp; unfurnished apartments, houses &amp; villas in Kololo, Nakasero, Muyenga &amp; beyond.`,
    keywords: 'properties to rent Kampala, apartments for rent Uganda, rental houses Kampala',
    canonical: '/rent',
    ogType: 'website',
  });

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/rent#page`,
      name: 'Properties to Rent in Kampala',
      description: 'Browse all rental properties in Kampala, Uganda with Oceans Uganda estate agents.',
      url: `${SITE_URL}/rent`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Properties to Rent', item: `${SITE_URL}/rent` },
        ],
      },
    };
    return injectSchemaLD('schema-rent', schema);
  }, []);

  return null;
}

/* ─────────────── Contact Page SEO ─────────────── */
export function ContactSEO() {
  useSEO({
    title: 'Contact Oceans Uganda | Kampala Estate Agents | Bugolobi Office',
    description: 'Get in touch with Oceans Uganda — Kampala\'s leading estate agents. Visit our Bugolobi office, call +256 757 861 270 or send a message. We respond within 24 hours.',
    keywords: 'contact Oceans Uganda, Kampala estate agent contact, property agent Bugolobi',
    canonical: '/contact',
    ogType: 'website',
  });

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `${SITE_URL}/contact#page`,
      name: 'Contact Oceans Uganda',
      url: `${SITE_URL}/contact`,
      description: 'Contact Kampala\'s leading estate and letting agent.',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` },
        ],
      },
      mainEntity: {
        '@type': 'RealEstateAgent',
        '@id': `${SITE_URL}/#organisation`,
        name: 'Oceans Uganda',
        telephone: '+256757861270',
        email: 'info@oceans.co.ug',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '785 Luthuli Avenue',
          addressLocality: 'Bugolobi',
          addressRegion: 'Kampala',
          addressCountry: 'UG',
        },
      },
    };
    return injectSchemaLD('schema-contact', schema);
  }, []);

  return null;
}

/* ─────────────── Landlords Page SEO ─────────────── */
export function LandlordsSEO() {
  useSEO({
    title: 'Landlord Services Kampala | Property Management Uganda | Oceans Uganda',
    description: 'Oceans Uganda offers expert landlord services in Kampala — free property valuations, tenant sourcing, property management &amp; rent collection. 98% occupancy rate.',
    keywords: 'landlord services Kampala, property management Uganda, letting agent Kampala',
    canonical: '/landlords',
    ogType: 'website',
  });

  useEffect(() => {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${SITE_URL}/landlords#service`,
      name: 'Landlord &amp; Property Management Services',
      provider: { '@id': `${SITE_URL}/#organisation` },
      serviceType: 'Property Management',
      areaServed: { '@type': 'City', name: 'Kampala' },
      description: 'Full-service property management including tenant sourcing, rent collection, maintenance and free valuation for landlords across Kampala, Uganda.',
      url: `${SITE_URL}/landlords`,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Landlord Services', item: `${SITE_URL}/landlords` },
        ],
      },
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/landlords#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does it cost to list my property with Oceans Uganda?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our letting service is offered on a no-let, no-fee basis. You only pay a commission when we successfully place a verified tenant. There are no upfront costs.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to find a tenant in Kampala?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'On average, Oceans Uganda places tenants within 14 days of listing. Premium properties in Kololo and Nakasero often let within a week.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you offer property management services in Kampala?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Oceans Uganda provides full property management including rent collection, maintenance coordination, tenant communication and regular inspections.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you provide a free property valuation in Kampala?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely. We offer free, no-obligation property valuations across all Kampala neighbourhoods. Our agents provide a detailed market comparison report within 48 hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which neighbourhoods does Oceans Uganda cover?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We cover all of Kampala\'s premium neighbourhoods including Kololo, Nakasero, Muyenga, Bugolobi, Naguru, Mbuya, Munyonyo, Ntinda, Lubowa, Buziga and Nalya.',
          },
        },
      ],
    };

    const cleanup1 = injectSchemaLD('schema-landlords', serviceSchema);
    const cleanup2 = injectSchemaLD('schema-landlords-faq', faqSchema);
    return () => { cleanup1(); cleanup2(); };
  }, []);

  return null;
}

/* ─────────────── All Properties Page SEO ─────────────── */
export function AllPropertiesSEO({ count }: { count: number }) {
  useSEO({
    title: `All Properties Kampala | ${count > 0 ? count + ' Listings' : 'Sales &amp; Rentals'} | Oceans Uganda`,
    description: `View all ${count > 0 ? count + ' ' : ''}property listings in Kampala — for sale &amp; to rent. Houses, apartments, land &amp; villas across every Kampala neighbourhood.`,
    keywords: 'all properties Kampala, property listings Uganda, buy rent Kampala',
    canonical: '/all-properties',
    ogType: 'website',
  });

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/all-properties#page`,
      name: 'All Properties in Kampala',
      description: 'Complete listing of properties for sale and rent in Kampala with Oceans Uganda.',
      url: `${SITE_URL}/all-properties`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'All Properties', item: `${SITE_URL}/all-properties` },
        ],
      },
    };
    return injectSchemaLD('schema-all-properties', schema);
  }, []);

  return null;
}

/* ─────────────── New Developments Page SEO ─────────────── */
export function NewDevelopmentsSEO() {
  useSEO({
    title: 'New Developments Kampala | Off-Plan &amp; New Build Properties | Oceans Uganda',
    description: 'Discover new property developments in Kampala — off-plan apartments, villas &amp; new builds in Kololo, Nakasero &amp; Muyenga. Invest in Kampala real estate today.',
    keywords: 'new developments Kampala, off-plan property Uganda, new build homes Kampala',
    canonical: '/new-developments',
    ogType: 'website',
  });

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/new-developments#page`,
      name: 'New Developments in Kampala',
      description: 'Off-plan and newly completed property developments in Kampala, Uganda.',
      url: `${SITE_URL}/new-developments`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'New Developments', item: `${SITE_URL}/new-developments` },
        ],
      },
    };
    return injectSchemaLD('schema-new-dev', schema);
  }, []);

  return null;
}

/* ─────────────── Search Page SEO ─────────────── */
export function SearchSEO() {
  useSEO({
    title: 'Search Properties in Kampala | Oceans Uganda',
    description: 'Search all properties for sale and rent in Kampala, Uganda. Filter by price, bedrooms, area and more. Find your perfect Kampala home with Oceans Uganda.',
    keywords: 'search property Kampala, find homes Uganda, property search Kampala',
    canonical: '/search',
    ogType: 'website',
    noIndex: false,
  });

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      '@id': `${SITE_URL}/search#page`,
      name: 'Property Search — Kampala, Uganda',
      description: 'Search all properties for sale and rent in Kampala, Uganda.',
      url: `${SITE_URL}/search`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Search Properties', item: `${SITE_URL}/search` },
        ],
      },
    };
    return injectSchemaLD('schema-search', schema);
  }, []);

  return null;
}

/* ─────────────── Blog Index Page SEO ─────────────── */
export function BlogIndexSEO() {
  useSEO({
    title: 'Kampala Area Guides & Property Blog | Oceans Uganda',
    description: 'Read in-depth neighbourhood guides, market insights, and expert property advice from Oceans Uganda — Kampala&apos;s leading estate and letting agents.',
    keywords: 'Kampala property blog, area guides Uganda, real estate insights Kampala',
    canonical: '/blog',
    ogType: 'website',
  });

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog#page`,
      name: 'Kampala Area Guides & Property Blog',
      description: 'In-depth neighbourhood guides, market insights, and expert property advice from Oceans Uganda.',
      url: `${SITE_URL}/blog`,
      publisher: { '@id': `${SITE_URL}/#organisation` },
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog & Area Guides', item: `${SITE_URL}/blog` },
        ],
      },
    };
    return injectSchemaLD('schema-blog-index', schema);
  }, []);

  return null;
}

/* ─────────────── Property Detail Page SEO ─────────────── */
interface PropertyDetailSEOProps {
  title: string;
  description: string;
  price: string;
  type: string;
  purpose: string;
  beds: number;
  baths: number;
  location: string;
  image: string;
  slug: string;
}

export function PropertyDetailSEO({ title, description, price, type, purpose, beds, baths, location, image, slug }: PropertyDetailSEOProps) {
  useSEO({
    title: `${title} | Oceans Uganda`,
    description: description ? description.slice(0, 155) : `${title} — ${purpose === 'sale' ? 'for sale' : 'to rent'} in ${location}, Kampala. ${beds} bed, ${baths} bath. Contact Oceans Uganda for details.`,
    keywords: `${type.toLowerCase()} ${purpose === 'sale' ? 'for sale' : 'to rent'} ${location}, Kampala property`,
    canonical: `/property/${slug}`,
    ogType: 'article',
    ogTitle: `${title} | Oceans Uganda`,
    ogDescription: description ? description.slice(0, 155) : `${title} — ${purpose === 'sale' ? 'for sale' : 'to rent'} in ${location}.`,
    ogImage: image,
  });

  useEffect(() => {
    const priceNumeric = price.replace(/[^0-9.]/g, '');
    const currency = price.includes('UGX') ? 'UGX' : 'USD';
    const pageUrl = `${SITE_URL}/property/${slug}`;

    const listingSchema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      '@id': `${pageUrl}#listing`,
      name: title,
      description: description || `${title} ${purpose === 'sale' ? 'for sale' : 'to rent'} in ${location}, Kampala.`,
      image: image ? [image] : undefined,
      url: pageUrl,
      datePosted: new Date().toISOString().split('T')[0],
      offers: {
        '@type': 'Offer',
        price: priceNumeric || '0',
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        url: pageUrl,
        seller: { '@id': `${SITE_URL}/#organisation` },
      },
      numberOfRooms: beds,
      numberOfBathroomsTotal: baths,
      floorSize: {
        '@type': 'QuantitativeValue',
        unitCode: 'MTK',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressRegion: 'Kampala',
        addressCountry: 'UG',
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Property Type', value: type },
        { '@type': 'PropertyValue', name: 'Purpose', value: purpose === 'sale' ? 'For Sale' : 'To Rent' },
      ],
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: purpose === 'sale' ? 'For Sale' : 'To Rent', item: `${SITE_URL}/${purpose === 'sale' ? 'buy' : 'rent'}` },
        { '@type': 'ListItem', position: 3, name: title, item: pageUrl },
      ],
    };

    const cleanup1 = injectSchemaLD('schema-property-detail', listingSchema);
    const cleanup2 = injectSchemaLD('schema-property-breadcrumb', breadcrumbSchema);
    return () => { cleanup1(); cleanup2(); };
  }, [title, description, price, type, purpose, beds, baths, location, image, slug]);

  return null;
}

/* ─────────────── Neighbourhood Page SEO ─────────────── */
export function NeighbourhoodSEO({ name, count }: { name: string; count: number; slug: string }) {
  const nbSlug = name.toLowerCase().replace(/\s+/g, '-');

  useSEO({
    title: `${name} Properties | Houses for Sale &amp; Rent in ${name} | Oceans Uganda`,
    description: `Find ${count > 0 ? count + ' ' : ''}properties in ${name}, Kampala — houses for sale, apartments to rent &amp; land. Kampala real estate experts at Oceans Uganda.`,
    keywords: `${name} properties Kampala, houses for sale ${name}, rentals ${name} Uganda`,
    canonical: `/neighbourhood/${nbSlug}`,
    ogType: 'website',
  });

  useEffect(() => {
    const pageSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/neighbourhood/${nbSlug}#page`,
      name: `Properties in ${name}`,
      description: `Browse all properties for sale and rent in ${name}, Kampala with Oceans Uganda.`,
      url: `${SITE_URL}/neighbourhood/${nbSlug}`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Neighbourhoods', item: `${SITE_URL}/all-properties` },
        { '@type': 'ListItem', position: 3, name: name, item: `${SITE_URL}/neighbourhood/${nbSlug}` },
      ],
    };

    const placeSchema = {
      '@context': 'https://schema.org',
      '@type': 'Place',
      '@id': `${SITE_URL}/neighbourhood/${nbSlug}#place`,
      name: name,
      description: `${name} is a sought-after neighbourhood in Kampala, Uganda known for premium residential properties.`,
      containedInPlace: {
        '@type': 'City',
        name: 'Kampala',
        containedInPlace: { '@type': 'Country', name: 'Uganda' },
      },
    };

    const cleanup1 = injectSchemaLD('schema-neighbourhood', pageSchema);
    const cleanup2 = injectSchemaLD('schema-neighbourhood-breadcrumb', breadcrumbSchema);
    const cleanup3 = injectSchemaLD('schema-neighbourhood-place', placeSchema);
    return () => { cleanup1(); cleanup2(); cleanup3(); };
  }, [name, nbSlug]);

  return null;
}

/* ─────────────── Neighbourhoods Listing Page SEO ─────────────── */
export function NeighbourhoodsSEO() {
  useSEO({
    title: 'Kampala Neighbourhoods | Area Guides & Property Guides | Oceans Uganda',
    description: 'Explore every Kampala neighbourhood — Kololo, Nakasero, Muyenga, Bugolobi & more. In-depth area guides, property listings & local insights from Oceans Uganda.',
    keywords: 'Kampala neighbourhoods, area guides Kampala, Kololo Nakasero Muyenga property',
    canonical: '/neighbourhoods',
    ogType: 'website',
  });

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/neighbourhoods#page`,
      name: 'Kampala Neighbourhoods & Area Guides',
      description: 'Explore all Kampala neighbourhoods with in-depth area guides, property listings and local insights from Oceans Uganda.',
      url: `${SITE_URL}/neighbourhoods`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Neighbourhoods', item: `${SITE_URL}/neighbourhoods` },
        ],
      },
    };
    return injectSchemaLD('schema-neighbourhoods', schema);
  }, []);

  return null;
}

/* ─────────────── Blog Post Page SEO ─────────────── */
interface BlogPostSEOProps {
  title: string;
  description: string;
  slug: string;
  image?: string | null;
  publishDate?: string;
  category?: string | null;
  authorName?: string;
}

export function BlogPostSEO({ title, description, slug, image, publishDate, category, authorName }: BlogPostSEOProps) {
  useSEO({
    title: `${title} | Oceans Uganda`,
    description: description ? description.slice(0, 155) : `${title} — read the latest property insights and area guides from Oceans Uganda, Kampala's leading estate agent.`,
    keywords: `${category ? category + ', ' : ''}Kampala real estate blog, property guide Uganda`,
    canonical: `/blog/${slug}`,
    ogType: 'article',
    ogTitle: `${title} | Oceans Uganda`,
    ogDescription: description ? description.slice(0, 155) : `${title} — Oceans Uganda property insights.`,
    ogImage: image || undefined,
  });

  useEffect(() => {
    const pageUrl = `${SITE_URL}/blog/${slug}`;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${pageUrl}#article`,
      headline: title,
      description: description || title,
      image: image ? [image] : undefined,
      url: pageUrl,
      datePublished: publishDate || new Date().toISOString().split('T')[0],
      dateModified: publishDate || new Date().toISOString().split('T')[0],
      author: authorName
        ? { '@type': 'Person', name: authorName }
        : { '@id': `${SITE_URL}/#organisation` },
      publisher: { '@id': `${SITE_URL}/#organisation` },
      isPartOf: { '@id': `${SITE_URL}/#website` },
      articleSection: category || 'Real Estate',
      inLanguage: 'en-UG',
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Neighbourhoods & Guides', item: `${SITE_URL}/neighbourhoods` },
        { '@type': 'ListItem', position: 3, name: title, item: pageUrl },
      ],
    };

    const cleanup1 = injectSchemaLD('schema-blog-post', articleSchema);
    const cleanup2 = injectSchemaLD('schema-blog-post-breadcrumb', breadcrumbSchema);
    return () => { cleanup1(); cleanup2(); };
  }, [title, description, slug, image, publishDate, category, authorName]);

  return null;
}

/* ─────────────── Agent Public Profile Page SEO ─────────────── */
interface AgentProfileSEOProps {
  name: string;
  title?: string;
  bio?: string;
  photo?: string;
  agentId: string;
}

export function AgentProfileSEO({ name, title, bio, photo, agentId }: AgentProfileSEOProps) {
  useSEO({
    title: `${name} — Kampala Estate Agent | Oceans Uganda`,
    description: bio
      ? bio.slice(0, 155)
      : `${name}${title ? ', ' + title : ''} — Kampala real estate agent at Oceans Uganda. Browse their property listings for sale and rent across Kampala, Uganda.`,
    keywords: `${name} estate agent Kampala, Oceans Uganda agent, property agent Uganda`,
    canonical: `/agents/${agentId}`,
    ogType: 'profile',
    ogTitle: `${name} | Oceans Uganda`,
    ogDescription: bio ? bio.slice(0, 155) : `${name} — Kampala real estate agent at Oceans Uganda.`,
    ogImage: photo || undefined,
  });

  useEffect(() => {
    const pageUrl = `${SITE_URL}/agents/${agentId}`;

    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${pageUrl}#agent`,
      name,
      jobTitle: title || 'Real Estate Agent',
      description: bio || `${name} is a real estate agent at Oceans Uganda, Kampala's leading estate agency.`,
      image: photo || undefined,
      url: pageUrl,
      worksFor: { '@id': `${SITE_URL}/#organisation` },
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: name, item: pageUrl },
      ],
    };

    const cleanup1 = injectSchemaLD('schema-agent-profile', personSchema);
    const cleanup2 = injectSchemaLD('schema-agent-breadcrumb', breadcrumbSchema);
    return () => { cleanup1(); cleanup2(); };
  }, [name, title, bio, photo, agentId]);

  return null;
}

/* ─────────────── About Page SEO ─────────────── */
export function AboutSEO() {
  useSEO({
    title: 'About Oceans Uganda | Kampala Estate & Letting Agents',
    description: 'Learn about Oceans Uganda — Kampala\'s premier estate and letting agents. 12+ years of excellence, 500+ properties sold, and a team dedicated to exceptional real estate service across Uganda.',
    keywords: 'about Oceans Uganda, Kampala estate agents, property agency Uganda, real estate company Kampala',
    canonical: '/about',
    ogType: 'website',
  });

  useOrganisationSchema();

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': `${SITE_URL}/about#page`,
      name: 'About Oceans Uganda',
      description: 'Oceans Uganda is Kampala\'s leading estate and letting agent, specialising in premium property sales, rentals and management across Uganda.',
      url: `${SITE_URL}/about`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'About Us', item: `${SITE_URL}/about` },
        ],
      },
      mainEntity: {
        '@type': 'RealEstateAgent',
        '@id': `${SITE_URL}/#organisation`,
        name: 'Oceans Uganda',
        description: 'Kampala\'s premier estate and letting agent with 12+ years of market-leading service.',
        foundingDate: '2012',
        numberOfEmployees: { '@type': 'QuantitativeValue', value: '15+' },
      },
    };
    return injectSchemaLD('schema-about', schema);
  }, []);

  return null;
}

/* ─────────────── Joint Ventures Page SEO ─────────────── */
export function JointVentureSEO() {
  useSEO({
    title: 'Joint Venture Land Partnerships Uganda | Oceans Uganda',
    description: 'Partner your land with an investor, or find prime land to invest in across Uganda. Post a landowner brief or submit an investor request with Oceans Uganda\'s JV desk.',
    keywords: 'joint venture land Uganda, land investment Kampala, landowner investor partnership Uganda',
    canonical: '/joint-venture',
    ogType: 'website',
  });

  useEffect(() => {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${SITE_URL}/joint-venture#service`,
      name: 'Joint Venture Land Partnerships',
      provider: { '@id': `${SITE_URL}/#organisation` },
      serviceType: 'Real Estate Joint Venture Brokerage',
      areaServed: { '@type': 'Country', name: 'Uganda' },
      description: 'Matching landowners with investors for joint venture land development, and sourcing land for outright purchase, across Uganda.',
      url: `${SITE_URL}/joint-venture`,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Joint Ventures', item: `${SITE_URL}/joint-venture` },
        ],
      },
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/joint-venture#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What exactly is a land joint venture?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A landowner contributes the land and an investor contributes capital for development. Instead of a straight sale, both sides agree how the finished value or income will be split.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Oceans Uganda charge a fee for joint ventures?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Submitting a brief is free. A facilitation fee applies only once a joint venture or sale is concluded, agreed upfront with both parties.',
          },
        },
      ],
    };

    const cleanup1 = injectSchemaLD('schema-joint-venture', serviceSchema);
    const cleanup2 = injectSchemaLD('schema-joint-venture-faq', faqSchema);
    return () => { cleanup1(); cleanup2(); };
  }, []);

  return null;
}

/* ─────────────── Neighbourhood History Page SEO ─────────────── */
interface NbHistorySEOProps {
  name: string;
  slug: string;
}

export function NbHistorySEO({ name, slug }: NbHistorySEOProps) {
  useSEO({
    title: `${name} History & Character | Kampala Neighbourhood Guide | Oceans Uganda`,
    description: `Discover the history, architecture and community of ${name}, Kampala. From colonial origins to modern living — explore what makes ${name} one of Kampala's most sought-after neighbourhoods.`,
    keywords: `${name} history Kampala, ${name} neighbourhood guide, living in ${name} Uganda, Kampala area guide`,
    canonical: `/neighbourhood/${slug}/history`,
    ogType: 'article',
  });

  useEffect(() => {
    const pageUrl = `${SITE_URL}/neighbourhood/${slug}/history`;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${pageUrl}#article`,
      headline: `The History & Character of ${name}, Kampala`,
      description: `A comprehensive guide to the history, architecture, and community of ${name}, one of Kampala's most prestigious neighbourhoods.`,
      url: pageUrl,
      datePublished: '2024-01-01',
      dateModified: new Date().toISOString().split('T')[0],
      author: { '@id': `${SITE_URL}/#organisation` },
      publisher: { '@id': `${SITE_URL}/#organisation` },
      isPartOf: { '@id': `${SITE_URL}/#website` },
      articleSection: 'Neighbourhood Guide',
      inLanguage: 'en-UG',
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Neighbourhoods', item: `${SITE_URL}/neighbourhoods` },
        { '@type': 'ListItem', position: 3, name: name, item: `${SITE_URL}/neighbourhood/${slug}` },
        { '@type': 'ListItem', position: 4, name: 'History', item: pageUrl },
      ],
    };

    const placeSchema = {
      '@context': 'https://schema.org',
      '@type': 'Place',
      '@id': `${pageUrl}#place`,
      name: name,
      description: `${name} is a historic and prestigious neighbourhood in Kampala, Uganda, known for its distinctive character and premium residential properties.`,
      containedInPlace: {
        '@type': 'City',
        name: 'Kampala',
        containedInPlace: { '@type': 'Country', name: 'Uganda' },
      },
    };

    const cleanup1 = injectSchemaLD('schema-nb-history', articleSchema);
    const cleanup2 = injectSchemaLD('schema-nb-history-breadcrumb', breadcrumbSchema);
    const cleanup3 = injectSchemaLD('schema-nb-history-place', placeSchema);
    return () => { cleanup1(); cleanup2(); cleanup3(); };
  }, [name, slug]);

  return null;
}