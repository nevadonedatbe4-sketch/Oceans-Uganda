import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from './types';

type FilterTab = 'all' | 'published' | 'draft';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*, author:agents!blog_posts_author_id_fkey(id, full_name)')
      .order('created_at', { ascending: false });
    if (data) setPosts(data as BlogPost[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const togglePublished = async (post: BlogPost) => {
    await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id);
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)));
  };

  const handleDelete = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = posts.filter((p) => {
    if (filter === 'published') return p.published;
    if (filter === 'draft') return !p.published;
    return true;
  });

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: posts.length },
    { key: 'published', label: 'Published', count: publishedCount },
    { key: 'draft', label: 'Drafts', count: draftCount },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-jost font-bold text-stone-800">Blog &amp; Insights</h1>
          <p className="text-sm text-stone-500 mt-1">
            {publishedCount} published · {draftCount} drafts
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#163828] cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i> New Post
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-lg p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 text-sm rounded-md font-medium cursor-pointer whitespace-nowrap transition-colors ${
              filter === t.key ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === t.key ? 'bg-stone-100 text-stone-500' : 'bg-stone-200/50 text-stone-400'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-lg">
          <i className="ri-article-line text-4xl text-stone-300 block mb-3"></i>
          <h3 className="text-stone-600 font-medium">No posts yet</h3>
          <p className="text-sm text-stone-400 mt-1 mb-4">Write your first article to build authority and attract organic traffic</p>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-[#163828] cursor-pointer"
          >
            <i className="ri-add-line"></i> New Post
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-[#f5f5f5]">
                <th className="text-left py-3 px-4 font-medium text-stone-500">Title</th>
                <th className="text-left py-3 px-4 font-medium text-stone-500 hidden lg:table-cell">Category</th>
                <th className="text-left py-3 px-4 font-medium text-stone-500 hidden md:table-cell">Author</th>
                <th className="text-left py-3 px-4 font-medium text-stone-500 hidden md:table-cell">Date</th>
                <th className="text-left py-3 px-4 font-medium text-stone-500">Status</th>
                <th className="py-3 px-4 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-b border-stone-100 hover:bg-[#f5f5f5] transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-stone-800 line-clamp-1">{post.title}</p>
                    {post.excerpt && (
                      <p className="text-xs text-stone-400 mt-0.5 line-clamp-1 hidden sm:block">{post.excerpt}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    {post.category ? (
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full whitespace-nowrap">{post.category}</span>
                    ) : (
                      <span className="text-stone-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-xs text-stone-500">
                    {post.author?.full_name ?? <span className="text-stone-300">—</span>}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-xs text-stone-400">
                    {formatDate(post.publish_date)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap ${
                        post.published
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      {post.published ? (
                        <><i className="ri-checkbox-circle-line mr-1"></i>Published</>
                      ) : (
                        <><i className="ri-draft-line mr-1"></i>Draft</>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/blog/${post.id}`}
                        className="w-7 h-7 flex items-center justify-center rounded border border-stone-200 text-stone-500 hover:bg-[#f5f5f5] cursor-pointer"
                      >
                        <i className="ri-pencil-line text-xs"></i>
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="w-7 h-7 flex items-center justify-center rounded border border-stone-200 text-stone-400 hover:border-red-200 hover:text-red-500 cursor-pointer"
                      >
                        <i className="ri-delete-bin-line text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="font-semibold text-stone-800">Delete Post?</h3>
            <p className="text-sm text-stone-500 mt-2">This article will be permanently deleted.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-stone-200 rounded-md py-2 text-sm text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white rounded-md py-2 text-sm font-medium hover:bg-red-600 cursor-pointer whitespace-nowrap">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
