import { useState } from 'react';
import type { BlogDraft } from '../types';
import { BLOG_CATEGORIES } from '../types';

interface AgentOption {
  id: string;
  full_name: string;
}

interface Props {
  data: BlogDraft;
  agents: AgentOption[];
  onChange: (data: BlogDraft) => void;
  saving: boolean;
  onSave: () => void;
  isEdit: boolean;
}

type Tab = 'content' | 'settings';

export default function BlogForm({ data, agents, onChange, saving, onSave, isEdit }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('content');

  const set = (partial: Partial<BlogDraft>) => onChange({ ...data, ...partial });

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleTitleChange = (title: string) => {
    set({ title, slug: isEdit ? data.slug : autoSlug(title) });
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'content', label: 'Content', icon: 'ri-article-line' },
    { key: 'settings', label: 'Publish & SEO', icon: 'ri-settings-3-line' },
  ];

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === t.key
                ? 'border-[#1B4332] text-[#1B4332]'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <i className={t.icon}></i> {t.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Post Title *</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Kampala\'s Top 5 Neighbourhoods for Families in 2025"
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">URL Slug *</label>
              <div className="flex items-center border border-stone-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#1B4332]/20">
                <span className="px-3 py-2.5 bg-[#f5f5f5] text-stone-400 text-sm border-r border-stone-200 whitespace-nowrap">/blog/</span>
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) => set({ slug: e.target.value })}
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Category</label>
              <select
                value={data.category ?? ''}
                onChange={(e) => set({ category: e.target.value || null })}
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
              >
                <option value="">Select a category…</option>
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Excerpt</label>
            <textarea
              rows={3}
              value={data.excerpt ?? ''}
              onChange={(e) => set({ excerpt: e.target.value || null })}
              placeholder="Short summary shown on blog listing cards and in search results…"
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Article Body</label>
            <textarea
              rows={16}
              value={data.full_body ?? ''}
              onChange={(e) => set({ full_body: e.target.value || null })}
              placeholder="Write your full article here. You can use markdown-style formatting — paragraphs, headings (# H1, ## H2), bullet lists (- item), bold (**text**), and links ([text](url))."
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none font-mono leading-relaxed"
            />
            <p className="text-xs text-stone-400 mt-1">
              {(data.full_body ?? '').length.toLocaleString()} characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Featured Image URL</label>
            <input
              type="url"
              value={data.featured_image ?? ''}
              onChange={(e) => set({ featured_image: e.target.value || null })}
              placeholder="https://…"
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            />
            {data.featured_image && (
              <div className="mt-2 w-full h-40 rounded-lg overflow-hidden border border-stone-200">
                <img src={data.featured_image} alt="Featured preview" className="w-full h-full object-cover object-top" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings & SEO Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Publish settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Publish Settings</h3>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Author</label>
              <select
                value={data.author_id ?? ''}
                onChange={(e) => set({ author_id: e.target.value || null })}
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
              >
                <option value="">No author assigned</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.full_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Publish Date</label>
              <input
                type="date"
                value={data.publish_date}
                onChange={(e) => set({ publish_date: e.target.value })}
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-lg border border-stone-200">
              <div>
                <p className="text-sm font-medium text-stone-700">Published</p>
                <p className="text-xs text-stone-400 mt-0.5">Live on the public blog</p>
              </div>
              <button
                onClick={() => set({ published: !data.published })}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${data.published ? 'bg-[#1B4332]' : 'bg-stone-300'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.published ? 'left-5' : 'left-0.5'}`}></span>
              </button>
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">SEO</h3>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">SEO Title</label>
              <input
                type="text"
                value={data.seo_title ?? ''}
                onChange={(e) => set({ seo_title: e.target.value || null })}
                placeholder={data.title || 'Post title for search engines…'}
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
              <p className="text-xs text-stone-400 mt-1">{(data.seo_title ?? '').length}/60</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">SEO Description</label>
              <textarea
                rows={3}
                value={data.seo_description ?? ''}
                onChange={(e) => set({ seo_description: e.target.value || null })}
                placeholder="Meta description for search engines…"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none"
              />
              <p className="text-xs text-stone-400 mt-1">{(data.seo_description ?? '').length}/160</p>
            </div>

            {(data.seo_title || data.seo_description) && (
              <div className="border border-stone-200 rounded-lg p-4 bg-white">
                <p className="text-xs text-stone-400 mb-2 font-medium">Search preview</p>
                <p className="text-[#1a0dab] text-base font-medium leading-snug">
                  {data.seo_title || data.title || 'Post title'}
                </p>
                <p className="text-[#006621] text-xs mt-0.5">oceansuganda.com/blog/{data.slug}</p>
                <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                  {data.seo_description || data.excerpt || 'No description.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end pt-2 border-t border-stone-100">
        <button
          onClick={onSave}
          disabled={saving || !data.title}
          className="px-6 py-2.5 bg-[#1B4332] text-white rounded-md text-sm font-semibold hover:bg-[#163828] disabled:opacity-60 cursor-pointer whitespace-nowrap"
        >
          {saving ? 'Saving…' : data.published ? (isEdit ? 'Save & Keep Published' : 'Publish Post') : (isEdit ? 'Save Draft' : 'Save as Draft')}
        </button>
      </div>
    </div>
  );
}
