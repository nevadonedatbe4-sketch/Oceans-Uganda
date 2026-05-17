import AgentContactWidget from './AgentContactWidget';

interface Agent {
  id: string;
  full_name: string;
  title: string | null;
  photo: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
}

interface PropertySidebarProps {
  price: number | null;
  currency: string;
  priceNote: string | null;
  purpose: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  sizeSqm: number | null;
  agent: Agent | null;
  listingTitle: string;
  listingId?: string;
}

export default function PropertySidebar({
  agent,
  listingTitle,
  listingId,
}: PropertySidebarProps) {
  return (
    <AgentContactWidget
      agent={agent}
      listingTitle={listingTitle}
      listingId={listingId}
    />
  );
}