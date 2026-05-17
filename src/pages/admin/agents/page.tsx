import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Agent } from './types';

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('agents')
      .select('*')
      .order('display_order')
      .order('full_name');
    if (data) setAgents(data as Agent[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const toggleActive = async (a: Agent) => {
    await supabase.from('agents').update({ active: !a.active }).eq('id', a.id);
    setAgents((prev) => prev.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x)));
  };

  const handleDelete = async (id: string) => {
    await supabase.from('agents').delete().eq('id', id);
    setAgents((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const activeCount = agents.filter((a) => a.active).length;

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-jost font-bold text-stone-800">Agents &amp; Team</h1>
          <p className="text-sm text-stone-500 mt-1">
            {agents.length} team members · {activeCount} active on site
          </p>
        </div>
        <Link
          to="/admin/agents/new"
          className="flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#163828] cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i> Add Agent
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-lg">
          <i className="ri-user-star-line text-4xl text-stone-300 block mb-3"></i>
          <h3 className="text-stone-600 font-medium">No team members yet</h3>
          <p className="text-sm text-stone-400 mt-1 mb-4">Add your first agent profile</p>
          <Link
            to="/admin/agents/new"
            className="inline-flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-[#163828] cursor-pointer"
          >
            <i className="ri-add-line"></i> Add Agent
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`bg-white border rounded-lg overflow-hidden ${agent.active ? 'border-stone-200' : 'border-stone-200 opacity-60'}`}
            >
              {/* Photo */}
              <div className="relative w-full h-52 bg-stone-100">
                {agent.photo ? (
                  <img
                    src={agent.photo}
                    alt={agent.full_name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="ri-user-3-line text-4xl text-stone-300"></i>
                  </div>
                )}
                {/* Active badge */}
                <div className="absolute top-2 left-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${agent.active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                    {agent.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                {/* Order badge */}
                <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white/80 rounded-full text-xs font-bold text-stone-500">
                  {agent.display_order}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-stone-800">{agent.full_name}</h3>
                {agent.title && (
                  <p className="text-xs text-stone-500 mt-0.5">{agent.title}</p>
                )}

                {/* Contact */}
                <div className="mt-3 space-y-1">
                  {agent.email && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 truncate">
                      <i className="ri-mail-line text-stone-400 shrink-0"></i>
                      <span className="truncate">{agent.email}</span>
                    </div>
                  )}
                  {agent.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <i className="ri-phone-line text-stone-400 shrink-0"></i>
                      {agent.phone}
                    </div>
                  )}
                </div>

                {/* Social icons */}
                {Object.keys(agent.social_links ?? {}).length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    {agent.social_links?.instagram && (
                      <a href={agent.social_links.instagram} target="_blank" rel="nofollow noreferrer" className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-[#1B4332] cursor-pointer">
                        <i className="ri-instagram-line text-sm"></i>
                      </a>
                    )}
                    {agent.social_links?.linkedin && (
                      <a href={agent.social_links.linkedin} target="_blank" rel="nofollow noreferrer" className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-[#1B4332] cursor-pointer">
                        <i className="ri-linkedin-line text-sm"></i>
                      </a>
                    )}
                    {agent.social_links?.facebook && (
                      <a href={agent.social_links.facebook} target="_blank" rel="nofollow noreferrer" className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-[#1B4332] cursor-pointer">
                        <i className="ri-facebook-line text-sm"></i>
                      </a>
                    )}
                    {agent.social_links?.twitter && (
                      <a href={agent.social_links.twitter} target="_blank" rel="nofollow noreferrer" className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-[#1B4332] cursor-pointer">
                        <i className="ri-twitter-x-line text-sm"></i>
                      </a>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                  <Link
                    to={`/admin/agents/${agent.id}`}
                    className="flex-1 text-center text-sm font-medium text-[#1B4332] border border-[#1B4332]/30 rounded-md py-2 hover:bg-[#1B4332]/5 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-pencil-line mr-1"></i> Edit
                  </Link>
                  <button
                    onClick={() => toggleActive(agent)}
                    title={agent.active ? 'Hide from site' : 'Show on site'}
                    className="w-9 h-9 flex items-center justify-center border border-stone-200 rounded-md text-stone-400 hover:bg-[#f5f5f5] cursor-pointer"
                  >
                    <i className={agent.active ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(agent.id)}
                    className="w-9 h-9 flex items-center justify-center border border-stone-200 rounded-md text-stone-400 hover:border-red-200 hover:text-red-500 cursor-pointer"
                  >
                    <i className="ri-delete-bin-line text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="font-semibold text-stone-800">Delete Agent?</h3>
            <p className="text-sm text-stone-500 mt-2">
              This agent will be permanently deleted. Listings assigned to them will not be affected.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-stone-200 rounded-md py-2 text-sm text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white rounded-md py-2 text-sm font-medium hover:bg-red-600 cursor-pointer whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
