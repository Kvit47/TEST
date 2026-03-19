'use client';

import {
    Field,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from '@/components/ui/input-group';
import useAuthStore from '@/src/entities/user/model/auth.store';
import { userSchema, UserSchema } from '@/src/entities/user/model/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CheckCircle,
    Edit3,
    FileText,
    Globe,
    Link as LinkIcon,
    Loader2,
    Mail,
    MapPin,
    Phone,
    User as UserIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

// ─── component ───────────────────────────────────────────────────────────────

export default function ProfileEditForm() {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const { user, patchUser } = useAuthStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
    });

    useEffect(() => {
        if (user) {
            reset({
                username: user.username ?? '',
                bio: user.bio ?? '',
                phone: user.phone ?? '',
                address: user.address ?? '',
                sosialLinks: {
                    facebook: user.sosialLinks?.facebook ?? '',
                    twitter: user.sosialLinks?.twitter ?? '',
                    instagram: user.sosialLinks?.instagram ?? '',
                },
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: UserSchema) => {
        setSaving(true);
        setSaved(false);
        try {
            await patchUser(data);
            setSaved(true);
            toast.success('Profile updated successfully');
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update profile';
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-sm">Loading profile…</span>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="h-1 w-full bg-gray-900" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">

                {/* Page heading */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">My Profile</h1>
                    <p className="text-gray-500 text-sm mt-2">Manage your personal information and social links</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                   

                    {/* ─── Right: edit form ─── */}
                    <section className="flex-1 min-w-0">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Personal information */}
                            <div className="bg-white border border-gray-200">
                                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Personal Information</h3>
                                </div>
                                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                                    {/* Username */}
                                    <Field data-invalid={!!errors.username}>
                                        <FieldLabel>
                                            Username <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <InputGroup className="rounded-none">
                                            <InputGroupAddon>
                                                <InputGroupText>
                                                    <UserIcon />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...register('username')}
                                                placeholder="Your display name"
                                                aria-invalid={!!errors.username}
                                            />
                                        </InputGroup>
                                        <FieldError errors={[errors.username]} />
                                    </Field>

                                    {/* Email (read-only) */}
                                    <Field>
                                        <FieldLabel>Email address</FieldLabel>
                                        <InputGroup className="rounded-none">
                                            <InputGroupAddon>
                                                <InputGroupText>
                                                    <Mail />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                value={user.email}
                                                disabled
                                                readOnly
                                            />
                                        </InputGroup>
                                    </Field>

                                    {/* Phone */}
                                    <Field data-invalid={!!errors.phone}>
                                        <FieldLabel>Phone</FieldLabel>
                                        <InputGroup className="rounded-none">
                                            <InputGroupAddon>
                                                <InputGroupText>
                                                    <Phone />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...register('phone')}
                                                placeholder="+1 (555) 000-0000"
                                                aria-invalid={!!errors.phone}
                                            />
                                        </InputGroup>
                                        <FieldError errors={[errors.phone]} />
                                    </Field>

                                    {/* Address */}
                                    <Field data-invalid={!!errors.address}>
                                        <FieldLabel>Address</FieldLabel>
                                        <InputGroup className="rounded-none">
                                            <InputGroupAddon>
                                                <InputGroupText>
                                                    <MapPin />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...register('address')}
                                                placeholder="City, Country"
                                                aria-invalid={!!errors.address}
                                            />
                                        </InputGroup>
                                        <FieldError errors={[errors.address]} />
                                    </Field>

                                    {/* Bio */}
                                    <div className="sm:col-span-2">
                                        <Field data-invalid={!!errors.bio}>
                                            <FieldLabel>Bio</FieldLabel>
                                            <InputGroup className="rounded-none">
                                                <InputGroupAddon align="block-start" className="border-b border-input">
                                                    <InputGroupText>
                                                        <FileText />
                                                        <span className="text-xs">About you</span>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupTextarea
                                                    {...register('bio')}
                                                    rows={3}
                                                    placeholder="Write a short bio about yourself…"
                                                    aria-invalid={!!errors.bio}
                                                />
                                            </InputGroup>
                                            <FieldError errors={[errors.bio]} />
                                        </Field>
                                    </div>

                                </div>
                            </div>

                            {/* Social links */}
                            <div className="bg-white border border-gray-200">
                                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                                    <LinkIcon className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Social Links</h3>
                                </div>
                                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-5">

                                    {/* Facebook */}
                                    <Field data-invalid={!!errors.sosialLinks?.facebook}>
                                        <FieldLabel>Facebook</FieldLabel>
                                        <InputGroup className="rounded-none">
                                            <InputGroupAddon>
                                                <InputGroupText>
                                                    <Globe />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...register('sosialLinks.facebook')}
                                                placeholder="https://facebook.com/…"
                                                aria-invalid={!!errors.sosialLinks?.facebook}
                                            />
                                        </InputGroup>
                                        <FieldError errors={[errors.sosialLinks?.facebook]} />
                                    </Field>

                                    {/* Twitter */}
                                    <Field data-invalid={!!errors.sosialLinks?.twitter}>
                                        <FieldLabel>Twitter / X</FieldLabel>
                                        <InputGroup className="rounded-none">
                                            <InputGroupAddon>
                                                <InputGroupText>
                                                    <Globe />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...register('sosialLinks.twitter')}
                                                placeholder="https://twitter.com/…"
                                                aria-invalid={!!errors.sosialLinks?.twitter}
                                            />
                                        </InputGroup>
                                        <FieldError errors={[errors.sosialLinks?.twitter]} />
                                    </Field>

                                    {/* Instagram */}
                                    <Field data-invalid={!!errors.sosialLinks?.instagram}>
                                        <FieldLabel>Instagram</FieldLabel>
                                        <InputGroup className="rounded-none">
                                            <InputGroupAddon>
                                                <InputGroupText>
                                                    <Globe />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...register('sosialLinks.instagram')}
                                                placeholder="https://instagram.com/…"
                                                aria-invalid={!!errors.sosialLinks?.instagram}
                                            />
                                        </InputGroup>
                                        <FieldError errors={[errors.sosialLinks?.instagram]} />
                                    </Field>

                                </div>
                            </div>

                            {/* Save bar */}
                            <div className="flex items-center justify-between bg-white border border-gray-200 px-6 py-4">
                                <p className="text-xs text-gray-400">
                                    {isDirty ? 'You have unsaved changes' : 'All changes saved'}
                                </p>
                                <button
                                    type="submit"
                                    disabled={saving || !isDirty}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving…
                                        </>
                                    ) : saved ? (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Saved
                                        </>
                                    ) : (
                                        <>
                                            <Edit3 className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
