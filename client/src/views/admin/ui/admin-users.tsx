'use client';

import { getRoleNames, isSuperAdmin } from '@/src/entities/user/lib/auth.utils';
import { User } from '@/src/entities/user/types/user.types';
import {
  ArrowLeft,
  Crown,
  Loader2,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  User as UserIcon,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import useAuthStore from '../../../entities/user/model/auth.store';

const ROLE_STYLES: Record<string, { badge: string; icon: React.ReactNode }> = {
  super_admin: {
    badge: 'bg-purple-100 text-purple-700 border border-purple-200',
    icon: <Crown className="w-3 h-3" />,
  },
  admin: {
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    icon: <Shield className="w-3 h-3" />,
  },
  client: {
    badge: 'bg-gray-100 text-gray-600 border border-gray-200',
    icon: <UserIcon className="w-3 h-3" />,
  },
};

const AVATAR_COLORS = [
  'from-violet-500 to-purple-700',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-700',
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function UserCard({
  u,
  currentUser,
  changingRole,
  onRoleChange,
}: {
  u: User;
  currentUser: User;
  changingRole: string | null;
  onRoleChange: (userId: string, role: 'admin' | 'client') => void;
}) {
  const isSelf = u._id === currentUser._id;
  const isChanging = changingRole === u._id;
  const roleStyle = ROLE_STYLES[u.role] ?? ROLE_STYLES.client;
  const avatarGradient = getAvatarColor(u._id);
  const canChangeRole = !isSelf && u.role !== 'super_admin';

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-200 overflow-hidden
        ${u.role === 'admin' || u.role === 'super_admin'
          ? 'border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5'
        }`}
    >
      {/* Top accent bar */}
      {(u.role === 'super_admin' || u.role === 'admin') && (
        <div
          className={`h-1 w-full ${u.role === 'super_admin' ? 'bg-linear-to-r from-purple-500 to-violet-600' : 'bg-linear-to-r from-blue-500 to-cyan-500'}`}
        />
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className={`w-12 h-12 min-w-12 rounded-full bg-linear-to-br ${avatarGradient} flex items-center justify-center text-lg font-bold text-white shadow-sm`}
          >
            {u.username.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-base leading-tight truncate">
                {u.username}
              </span>
              {isSelf && (
                <span className="text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate mt-0.5">{u.email}</p>

            {/* Role badge */}
            <span
              className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${roleStyle.badge}`}
            >
              {roleStyle.icon}
              {getRoleNames(u.role)}
            </span>
          </div>
        </div>

        {/* Role action */}
        {canChangeRole && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {u.role === 'client' ? (
              <button
                onClick={() => onRoleChange(u._id, 'admin')}
                disabled={!!changingRole}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  bg-blue-50 text-blue-700 border border-blue-200
                  hover:bg-blue-100 hover:border-blue-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-150"
              >
                {isChanging ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {isChanging ? 'Promoting…' : 'Promote to Admin'}
              </button>
            ) : (
              <button
                onClick={() => onRoleChange(u._id, 'client')}
                disabled={!!changingRole}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  bg-red-50 text-red-600 border border-red-200
                  hover:bg-red-100 hover:border-red-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-150"
              >
                {isChanging ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldOff className="w-4 h-4" />
                )}
                {isChanging ? 'Demoting…' : 'Demote to Client'}
              </button>
            )}
          </div>
        )}

        {isSelf && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">Cannot change your own role</p>
          </div>
        )}

        {u.role === 'super_admin' && !isSelf && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">Super Admin role is protected</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UsersManager() {
  const { user, loading, initialize, users, usersLoading, usersError, changingRole, fetchUsers, changeUserRole, clearUsersError } =
    useAuthStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'admin' | 'client'>('all');

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user && isSuperAdmin(user)) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const sortedFiltered = useMemo<User[]>(() => {
    const roleOrder = { super_admin: 0, admin: 1, client: 2, user: 3 };
    return users
      .filter((u) => {
        const matchesSearch =
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
          filter === 'all' ||
          (filter === 'admin' && (u.role === 'admin' || u.role === 'super_admin')) ||
          (filter === 'client' && u.role === 'client');
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99));
  }, [users, search, filter]);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length,
      clients: users.filter((u) => u.role === 'client').length,
    }),
    [users],
  );

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  /* ─── Access denied ─── */
  if (!user || !isSuperAdmin(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-sm p-10 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">
            This page is restricted to <span className="font-semibold text-purple-700">Super Administrators</span> only.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-2 mt-14">
          <Link
            href="/admin"
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900">User Management</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage roles and permissions for all registered users
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-blue-200 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
              <p className="text-xs text-gray-500">Admins</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.clients}</p>
              <p className="text-xs text-gray-500">Clients</p>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {usersError && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 text-sm text-red-700">
            <span>{usersError}</span>
            <button
              onClick={clearUsersError}
              className="text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & filter toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'admin', 'client'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 capitalize
                  ${filter === f
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
              >
                {f === 'all' ? 'All' : f === 'admin' ? 'Admins' : 'Clients'}
              </button>
            ))}
          </div>
        </div>

        {/* Users grid */}
        {usersLoading ? (
          <div className="flex flex-col items-center gap-3 py-24 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">Loading users…</span>
          </div>
        ) : sortedFiltered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-gray-400">
            <Users className="w-10 h-10" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <>
            {/* Admins section */}
            {(filter === 'all' || filter === 'admin') && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Admins
                  </h2>
                  <span className="text-xs text-gray-400 font-normal">
                    ({sortedFiltered.filter((u) => u.role === 'admin' || u.role === 'super_admin').length})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedFiltered
                    .filter((u) => u.role === 'admin' || u.role === 'super_admin')
                    .map((u) => (
                      <UserCard
                        key={u._id}
                        u={u}
                        currentUser={user}
                        changingRole={changingRole}
                        onRoleChange={changeUserRole}
                      />
                    ))}
                </div>
              </section>
            )}

            {/* Clients section */}
            {(filter === 'all' || filter === 'client') && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Clients
                  </h2>
                  <span className="text-xs text-gray-400 font-normal">
                    ({sortedFiltered.filter((u) => u.role === 'client').length})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedFiltered
                    .filter((u) => u.role === 'client')
                    .map((u) => (
                      <UserCard
                        key={u._id}
                        u={u}
                        currentUser={user}
                        changingRole={changingRole}
                        onRoleChange={changeUserRole}
                      />
                    ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
