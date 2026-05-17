import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  role: 'super_admin' | 'admin' | 'editor' | 'agent';
  full_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  photo: string | null;
  bio: string | null;
  title: string | null;
  status: 'pending' | 'active' | 'suspended';
  agent_id: string | null;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  whatsapp?: string;
  bio?: string;
  title?: string;
  role?: 'agent' | 'editor';
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', userId)
      .maybeSingle();
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) await fetchProfile(data.user.id);
    return { error: null };
  };

  const signUp = async (formData: SignUpData): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Registration failed. Please try again.' };

    const { error: profileError } = await supabase.from('user_profiles').insert({
      auth_user_id: data.user.id,
      role: formData.role ?? 'agent',
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone ?? null,
      whatsapp: formData.whatsapp ?? null,
      bio: formData.bio ?? null,
      title: formData.title ?? null,
      status: 'pending',
    });

    if (profileError) return { error: profileError.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (session?.user) await fetchProfile(session.user.id);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
