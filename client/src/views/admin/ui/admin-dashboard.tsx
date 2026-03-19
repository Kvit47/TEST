'use client';

import { getRoleNames, isAdmin, isSuperAdmin } from '@/src/entities/user/lib/auth.utils';
import { User } from '@/src/entities/user/types/user.types';
import { Check, List, Package, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useAuthStore from '../../../entities/user/model/auth.store';
import { userAPI } from '../../../entities/user/service/auth.api';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const { user, loading, initialize } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!user || !isAdmin(user)) return;
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const data = await userAPI.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [user]);

  if (loading) {
    return (
      <div className="container py-8 px-8 bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <div className="container py-8 px-8 bg-white min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Administrator privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-8 bg-white min-h-screen ">
      {/* Header */}
      <div className="flex justify-between mt-16 mb-8">

      <div className="w-full">
        <h1 className="text-5xl md:text-6xl font-serif  mb-2">
          Admin Dashboard
        </h1>
        <p className="text-base text-gray-600 mt-2">
          Welcome, {user.username}! Your role: {getRoleNames(user.role)}
        </p>
      </div>

      {/* Logout Button */}
      <Button variant="outline" className="mb-4" onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* User Management - Super Admin Only */}
        {isSuperAdmin(user) && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    User Management
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    Manage user roles
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link 
                href="/admin/users" 
                className="text-gray-900 font-medium text-sm hover:text-gray-700 transition-colors group inline-flex items-center"
              >
                View all users
                <span
                  className="ml-2 inline-block transition-all duration-200 group-hover:translate-x-[5px] group-hover:w-[6px]"
                  style={{ width: '5px' }}
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* System Stats */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <List className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Category Management
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  Manage categories
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Link href="/admin/categories" className="text-gray-900 font-medium text-sm hover:text-gray-700 transition-colors group inline-flex items-center">
              View categories 
              <span
                  className="ml-2 inline-block transition-all duration-200 group-hover:translate-x-[5px] group-hover:w-[6px]"
                  style={{ width: '5px' }}
                >
                  →
                </span>
            </Link>
          </div>
        </div>

        {/* Product Management - Admin and Super Admin */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Product Management
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  Manage products
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Link href="/admin/products" className="text-gray-900 font-medium text-sm hover:text-gray-700 transition-colors group inline-flex items-center">
              View products 
              <span
                  className="ml-2 inline-block transition-all duration-200 group-hover:translate-x-[5px] group-hover:w-[6px]"
                  style={{ width: '5px' }}
                >
                  →
                </span>
            </Link>
          </div>
        </div>

        
      </div>

      {/* Role Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-gray-900 text-xl font-semibold mb-4">Your Permissions</h3>
        <ul className="space-y-2">
          <li className="text-base text-gray-700 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Access admin dashboard
          </li>
          <li className="text-base text-gray-700 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Manage products
          </li>
          {isSuperAdmin(user) && (
            <>
              <li className="text-base text-gray-700 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Manage user roles
              </li>
              <li className="text-base text-gray-700 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                View all users
              </li>
              <li className="text-base text-gray-700 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Promote clients to admin
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Admin Users Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">Admin Users</h3>
          {isSuperAdmin(user) && (
            <Link 
              href="/admin/users" 
              className="text-gray-900 font-medium text-sm hover:text-gray-700 hover:underline transition-colors"
            >
              View all users →
            </Link>
          )}
        </div>
        
        {loadingUsers ? (
          <div className="p-6 text-center text-gray-600">Loading users...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users
              .filter((u) => u.role === 'admin' || u.role === 'super_admin')
              .map((adminUser) => (
                <div 
                  key={adminUser._id} 
                  className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg transition-all hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="w-12 h-12 min-w-12 rounded-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl font-bold text-white">
                    {adminUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="font-semibold text-base text-gray-900 truncate">{adminUser.username}</div>
                    <div className="text-sm text-gray-600 truncate">{adminUser.email}</div>
                    <span
                      className={`inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        adminUser.role === 'super_admin' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {getRoleNames(adminUser.role)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

