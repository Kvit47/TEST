'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import getInitials from '@/src/entities/profile/helpers/get-initial';
import useAuthStore from '@/src/entities/user/model/auth.store';
import {
    Globe,
    PencilIcon
} from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import ProfileEditForm from './profile-edit-form';


const ROLE_LABELS: Record<string, { label: string; style: string }> = {
    super_admin: { label: 'Super Admin', style: 'bg-purple-100 text-purple-800 border border-purple-200' },
    admin: { label: 'Admin', style: 'bg-blue-100 text-blue-800 border border-blue-200' },
    client: { label: 'Client', style: 'bg-gray-100 text-gray-700 border border-gray-200' },
    user: { label: 'User', style: 'bg-gray-100 text-gray-700 border border-gray-200' },
};

export default function Profile() {
    const { user, initialize } = useAuthStore();
    
    useEffect(() => {
        initialize();
    }, [initialize]);
    
    if (!user) {
        return <div>Loading...</div>;
    }
    const username = user.username.split('')[0].toUpperCase() + user.username.split('').slice(1).join('');

    const role = ROLE_LABELS[user.role] ?? ROLE_LABELS.user;

    return (
        <>
            {/* ─── Left: identity card ─── */}
            <aside className="w-full lg:w-1/4 shrink-0 space-y-4">

                <div className="bg-white border border-gray-200 overflow-hidden">
                    <div className={`py-8 relative ${role.style} bg-gray-900 `}>
                        <h1 className="text-4xl font-bold text-white">Welcome, {username}</h1>
                        <Sheet>
                            <SheetTrigger asChild className='absolute bottom-2 right-2'>
                                <Button variant="outline" className="w-6 h-6 p-3 rounded-full bg-gray-200 flex items-center justify-center">
                                    <PencilIcon className="w-4 h-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="min-w-[50vw] w-full sm:w-[50vw] z-9999">
                                <ProfileEditForm />
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className="px-5 pb-5 -mt-8">
                        <div className="relative w-16 h-16 border-2 border-white rounded-full shadow-sm flex items-center justify-center bg-gray-600 select-none">
                            {user.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <Image src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover rounded-full" width={64} height={64} />
                            ) : (
                                <span className="text-white text-lg font-bold">{getInitials(user.username)}</span>
                            )}
                        </div>
                        <div className="mt-3">
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">{username}</h2>
                            <p className="text-sm text-gray-500 mt-0.5 break-all">{user.email}</p>
                        </div>
                    </div>
                </div>

                {(user.sosialLinks?.facebook || user.sosialLinks?.twitter || user.sosialLinks?.instagram) && (
                    <div className="bg-white border border-gray-200 px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Social</p>
                        <div className="space-y-2">
                            {user.sosialLinks?.facebook && (
                                <a href={user.sosialLinks.facebook} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="truncate">Facebook</span>
                                </a>
                            )}
                            {user.sosialLinks?.twitter && (
                                <a href={user.sosialLinks.twitter} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="truncate">Twitter / X</span>
                                </a>
                            )}
                            {user.sosialLinks?.instagram && (
                                <a href={user.sosialLinks.instagram} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="truncate">Instagram</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
