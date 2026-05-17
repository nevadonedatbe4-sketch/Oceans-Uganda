import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  type UserProfile,
  type UserRole,
  type UserStatus,
  ROLE_LABELS,
  ROLE_COLORS,
  STATUS_COLORS,
  STATUS_ICONS,
} from './types';
import UserDetailDrawer from './components/UserDetailDrawer';
import InviteModal from './components/InviteModal';

type FilterRole = 'all' | UserRole;
type FilterStatus = 'all' | UserStatus;

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<FilterRole>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selected, setSelected] = useState<UserProfile | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers((data as UserProfile[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const quickUpdate = async (id: string, patch: Partial<UserProfile>) => {
    setActionLoading(id);
    const { error } = await supabase
      .from('user_profiles')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id);
    setActionLoading(null);
    if (error) { showToast(error.message, 'error'); return; }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    const action = (patch as any).status === 'active' ? 'approved' : (patch as any).status === 'suspended' ? 'suspended' : 'updated';
    showToast(`User ${action} successfully.`);
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.title ?? '').toLowerCase().includes(q);
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total: users.length,
    pending: users.filter((u) => u.status === 'pending').length,
    active: users.filter((u) => u.status === 'active').length,
    agents: users.filter((u) => u.role === 'agent').length,
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-md shadow-lg text-sm font-roboto transition-all ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          <i className={toast.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} />
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <p className="text-[#D5A91C] text-[10px] font-roboto font-semibold tracking-[0.18em] uppercase mb-1">Admin Panel</p>
          <h1 className="text-[#0d1f2d] font-jost font-bold text-2xl">Users & Roles</h1>
          <p className="text-[#7a7a7a] text-sm font-roboto mt-0.5">Manage team access, approve agents, and assign roles.</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0d1f2d] hover:bg-[#1a3347] text-white text-sm font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-user-add-line" />
          Invite Team Member
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Users', value: stats.total, icon: 'ri-team-line', color: 'text-[#0d1f2d]', bg: 'bg-[#0d1f2d]/8', onClick: () => setFilterStatus('all') },
          { label: 'Pending Approval', value: stats.pending, icon: 'ri-time-line', color: 'text-orange-600', bg: 'bg-orange-50', onClick: () => setFilterStatus('pending') },
          { label: 'Active Users', value: stats.active, icon: 'ri-checkbox-circle-line', color: 'text-emerald-600', bg: 'bg-emerald-50', onClick: () => setFilterStatus('active') },
          { label: 'Agents', value: stats.agents, icon: 'ri-user-star-line', color: 'text-[#D5A91C]', bg: 'bg-[#D5A91C]/10', onClick: () => setFilterRole('agent') },
        ].map((kpi) => (
          <button
            key={kpi.label}
            onClick={kpi.onClick}
            className="bg-white border border-[#e8e2d9] rounded-lg p-5 text-left hover:border-[#D5A91C]/40 transition-colors cursor-pointer"
          >
            <div className={`w-9 h-9 flex items-center justify-center rounded-md ${kpi.bg} mb-3`}>
              <i className={`${kpi.icon} ${kpi.color} text-base`} />
            </div>
            <p className="text-[#0d1f2d] font-prata text-2xl mb-0.5">{kpi.value}</p>
            <p className="text-[#a0a0a0] text-xs font-roboto">{kpi.label}</p>
          </button>
        ))}
      </div>

      {/* Pending approval banner */}
      {stats.pending > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-5 py-3.5 mb-5 flex items-center gap-3">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 shrink-0">
            <i className="ri-time-line text-orange-600 text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-[#0d1f2d] font-roboto font-semibold text-sm">
              {stats.pending} agent{stats.pending > 1 ? 's' : ''} waiting for approval
            </p>
            <p className="text-[#7a7a7a] text-xs font-roboto">
              Review and approve new agent registrations to give them access to the agent dashboard.
            </p>
          </div>
          <button
            onClick={() => setFilterStatus('pending')}
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-[#e8e2d9] rounded-lg px-5 py-3.5 flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-5">
        <div className="relative flex-1 min-w-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
            <i className="ri-search-line text-sm text-[#a0a0a0]" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or title..."
            className="w-full pl-9 pr-4 py-2 border border-[#e8e2d9] rounded-md text-sm font-roboto text-[#0d1f2d] bg-[#f7f5f0] focus:outline-none focus:border-[#D5A91C] focus:bg-white transition-colors placeholder:text-[#bbb]"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as FilterRole)}
            className="px-3 py-2 border border-[#e8e2d9] rounded-md text-sm font-roboto text-[#0d1f2d] bg-white focus:outline-none focus:border-[#D5A91C] transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="agent">Agent</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-3 py-2 border border-[#e8e2d9] rounded-md text-sm font-roboto text-[#0d1f2d] bg-white focus:outline-none focus:border-[#D5A91C] transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          {(filterRole !== 'all' || filterStatus !== 'all' || search) && (
            <button
              onClick={() => { setSearch(''); setFilterRole('all'); setFilterStatus('all'); }}
              className="px-3 py-2 border border-[#e8e2d9] rounded-md text-xs font-roboto text-[#7a7a7a] hover:bg-[#f7f5f0] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <i className="ri-close-line" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white border border-[#e8e2d9] rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <i className="ri-loader-4-line text-2xl text-[#a0a0a0] animate-spin" />
              <p className="text-sm font-roboto text-[#a0a0a0]">Loading users...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#f7f5f0] mb-4">
              <i className="ri-team-line text-[#bbb] text-2xl" />
            </div>
            <p className="text-[#0d1f2d] font-roboto font-semibold text-base mb-1">
              {search || filterRole !== 'all' || filterStatus !== 'all' ? 'No users match your filters' : 'No users yet'}
            </p>
            <p className="text-[#a0a0a0] text-sm font-roboto">
              {search || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Invite team members to get started.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[2fr_1.2fr_1fr_1fr_140px] gap-4 px-5 py-3 border-b border-[#e8e2d9] bg-[#f7f5f0]">
              {['User', 'Contact', 'Role', 'Status', 'Actions'].map((h) => (
                <p key={h} className="text-[11px] font-roboto font-semibold uppercase tracking-widest text-[#a0a0a0]">{h}</p>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#e8e2d9]">
              {filtered.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr_1fr_1fr_140px] gap-4 px-5 py-4 hover:bg-[#fdfcfa] transition-colors items-center"
                >
                  {/* User */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0d1f2d]/10 flex items-center justify-center shrink-0">
                      {user.photo ? (
                        <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-[#0d1f2d] font-roboto font-semibold text-sm">
                          {user.full_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#0d1f2d] font-roboto font-medium text-sm truncate">{user.full_name}</p>
                      <p className="text-[#a0a0a0] text-xs font-roboto truncate">{user.email}</p>
                      {user.title && (
                        <p className="text-[#D5A91C] text-[10px] font-roboto truncate">{user.title}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="text-xs font-roboto text-[#7a7a7a] space-y-0.5">
                    {user.phone && (
                      <p className="flex items-center gap-1.5">
                        <i className="ri-phone-line text-[#bbb]" />
                        {user.phone}
                      </p>
                    )}
                    {user.whatsapp && user.whatsapp !== user.phone && (
                      <p className="flex items-center gap-1.5">
                        <i className="ri-whatsapp-line text-[#bbb]" />
                        {user.whatsapp}
                      </p>
                    )}
                    {!user.phone && <p className="text-[#ccc] italic">No contact</p>}
                  </div>

                  {/* Role */}
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-roboto font-medium ${ROLE_COLORS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-roboto font-medium ${STATUS_COLORS[user.status]}`}>
                      <i className={`${STATUS_ICONS[user.status]} text-xs`} />
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                    <p className="text-[#ccc] text-[10px] font-roboto mt-1">
                      {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Approve */}
                    {user.status === 'pending' && (
                      <button
                        onClick={() => quickUpdate(user.id, { status: 'active' })}
                        disabled={actionLoading === user.id}
                        title="Approve"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                      >
                        {actionLoading === user.id ? (
                          <i className="ri-loader-4-line animate-spin text-xs" />
                        ) : (
                          <i className="ri-checkbox-circle-line text-xs" />
                        )}
                        Approve
                      </button>
                    )}

                    {/* Suspend */}
                    {user.status === 'active' && (
                      <button
                        onClick={() => quickUpdate(user.id, { status: 'suspended' })}
                        disabled={actionLoading === user.id}
                        title="Suspend"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                      >
                        {actionLoading === user.id ? (
                          <i className="ri-loader-4-line animate-spin text-xs" />
                        ) : (
                          <i className="ri-forbid-2-line text-xs" />
                        )}
                        Suspend
                      </button>
                    )}

                    {/* Reactivate */}
                    {user.status === 'suspended' && (
                      <button
                        onClick={() => quickUpdate(user.id, { status: 'active' })}
                        disabled={actionLoading === user.id}
                        title="Reactivate"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                      >
                        <i className="ri-restart-line text-xs" />
                        Reactivate
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => setSelected(user)}
                      title="Edit"
                      className="w-7 h-7 flex items-center justify-center border border-[#e8e2d9] rounded-md hover:bg-[#f7f5f0] text-[#7a7a7a] hover:text-[#0d1f2d] transition-colors cursor-pointer"
                    >
                      <i className="ri-edit-line text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#e8e2d9] bg-[#f7f5f0] flex items-center justify-between">
              <p className="text-xs font-roboto text-[#a0a0a0]">
                Showing {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={fetchUsers}
                className="flex items-center gap-1.5 text-xs font-roboto text-[#a0a0a0] hover:text-[#0d1f2d] transition-colors cursor-pointer"
              >
                <i className="ri-refresh-line text-xs" />
                Refresh
              </button>
            </div>
          </>
        )}
      </div>

      {/* Role legend */}
      <div className="mt-5 bg-white border border-[#e8e2d9] rounded-lg px-5 py-4">
        <p className="text-[11px] font-roboto font-semibold uppercase tracking-widest text-[#a0a0a0] mb-3">Role Permissions</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {([
            { role: 'super_admin' as UserRole, desc: 'Full access to all settings, users, data, and system config.' },
            { role: 'admin' as UserRole, desc: 'All content + most settings. Cannot manage other admins.' },
            { role: 'editor' as UserRole, desc: 'Manage listings, blog, media. No system settings.' },
            { role: 'agent' as UserRole, desc: 'Agent portal only — own listings and assigned leads.' },
          ] as { role: UserRole; desc: string }[]).map((item) => (
            <div key={item.role} className="flex items-start gap-2.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-roboto font-medium shrink-0 mt-0.5 ${ROLE_COLORS[item.role]}`}>
                {ROLE_LABELS[item.role]}
              </span>
              <p className="text-xs font-roboto text-[#7a7a7a] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drawers & modals */}
      {selected && (
        <UserDetailDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            showToast('User updated successfully.');
          }}
        />
      )}

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onInvited={() => { fetchUsers(); showToast('Invite sent!'); }}
        />
      )}
    </div>
  );
}
