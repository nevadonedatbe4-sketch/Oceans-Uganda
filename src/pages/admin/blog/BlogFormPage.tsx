import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { BlogDraft } from './types';
import { EMPTY_POST } from './types';
import BlogForm from './components/BlogForm';

interface AgentOption {
  id: string;
  full_name: string;
}

export default function BlogFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [data, setData] = useState<BlogDraft>(EMPTY_POST);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      const { data: rows } = await supabase
        .from('agents')
        .select('id, full_name')
        .eq('active', true)
        .order('display_order');
      if (rows) setAgents(rows);
    };
    loadAgents();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      const { data: row } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (row) {
        setData({
          title: row.title,
          slug: row.slug,
          category: row.category,
          featured_image: row.featured_image,
          excerpt: row.excerpt,
          full_body: row.full_body,
          author_id: row.author_id,
          publish_date: row.publish_date,
          published: row.published,
          seo_title: row.seo_title,
          seo_description: row.seo_description,
        });
      }
      setLoading(false);
    };
    load();
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!data.title) return;
    setSaving(true);
    setError(null);
    const payload = {
      ...data,
      category: data.category || null,
      featured_image: data.featured_image || null,
      excerpt: data.excerpt || null,
      full_body: data.full_body || null,
      author_id: data.author_id || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
    };
    const { error: err } = isEdit
      ? await supabase.from('blog_posts').update(payload).eq('id', id)
      : await supabase.from('blog_posts').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); } else { navigate('/admin/blog'); }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1000px] space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/blog"
          className="w-8 h-8 flex items-center justify-center rounded-md border border-stone-200 text-stone-500 hover:bg-[#f5f5f5] cursor-pointer"
        >
          <i className="ri-arrow-left-line"></i>
        </Link>
        <div>
          <h1 className="text-xl font-jost font-bold text-stone-800">
            {isEdit ? `Edit: ${data.title || 'Post'}` : 'New Blog Post'}
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {data.published ? (
              <span className="text-green-600 font-medium"><i className="ri-checkbox-circle-line mr-1"></i>Published</span>
            ) : (
              <span className="text-stone-400"><i className="ri-draft-line mr-1"></i>Draft</span>
            )}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
          <i className="ri-error-warning-line"></i> {error}
        </div>
      )}

      <BlogForm
        data={data}
        agents={agents}
        onChange={setData}
        saving={saving}
        onSave={handleSave}
        isEdit={isEdit}
      />
    </div>
  );
}
