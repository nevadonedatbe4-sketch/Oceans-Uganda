export type UserRole = 'super_admin' | 'admin' | 'editor' | 'agent';
export type UserStatus = 'pending' | 'active' | 'suspended';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  photo: string | null;
  bio: string | null;
  title: string | null;
  status: UserStatus;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  agent: 'Agent',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-violet-100 text-violet-700',
  admin: 'bg-blue-100 text-blue-700',
  editor: 'bg-sky-100 text-sky-700',
  agent: 'bg-amber-100 text-amber-700',
};

export const STATUS_COLORS: Record<UserStatus, string> = {
  pending: 'bg-orange-100 text-orange-700',
  active: 'bg-emerald-100 text-emerald-700',
  suspended: 'bg-red-100 text-red-700',
};

export const STATUS_ICONS: Record<UserStatus, string> = {
  pending: 'ri-time-line',
  active: 'ri-checkbox-circle-line',
  suspended: 'ri-forbid-2-line',
};
