import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { AgentDraft } from './types';
import { EMPTY_AGENT } from './types';
import AgentForm from './components/AgentForm';

export default function AgentFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [data, setData] = useState<AgentDraft>(EMPTY_AGENT);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      const { data: row } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (row) {
        setData({
          full_name: row.full_name,
          title: row.title,
          bio: row.bio,
          photo: row.photo,
          phone: row.phone,
          email: row.email,
          whatsapp: row.whatsapp,
          social_links: row.social_links ?? {},
          active: row.active ?? true,
          display_order: row.display_order ?? 0,
        });
      }
      setLoading(false);
    };
    load();
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!data.full_name) return;
    setSaving(true);
    setError(null);

    const { error: err } = isEdit
      ? await supabase.from('agents').update(data).eq('id', id)
      : await supabase.from('agents').insert(data);

    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      navigate('/admin/agents');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1100px] space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/agents"
          className="w-8 h-8 flex items-center justify-center rounded-md border border-stone-200 text-stone-500 hover:bg-[#f5f5f5] cursor-pointer"
        >
          <i className="ri-arrow-left-line"></i>
        </Link>
        <div>
          <h1 className="text-xl font-jost font-bold text-stone-800">
            {isEdit ? `Edit: ${data.full_name || 'Agent'}` : 'Add Agent'}
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {isEdit ? 'Update agent profile and contact details' : 'Add a new team member to Oceans'}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
          <i className="ri-error-warning-line"></i> {error}
        </div>
      )}

      <AgentForm
        data={data}
        onChange={setData}
        saving={saving}
        onSave={handleSave}
        isEdit={isEdit}
      />
    </div>
  );
}
