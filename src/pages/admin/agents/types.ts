export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
}

export interface Agent {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  photo: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  social_links: SocialLinks;
  active: boolean;
  display_order: number;
  created_at: string;
}

export type AgentDraft = Omit<Agent, 'id' | 'created_at'>;

export const EMPTY_AGENT: AgentDraft = {
  full_name: '',
  title: null,
  bio: null,
  photo: null,
  phone: null,
  email: null,
  whatsapp: null,
  social_links: {},
  active: true,
  display_order: 0,
};
