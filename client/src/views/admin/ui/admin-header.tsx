'use client';

import { ArrowLeft, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHeader({ title }: { title: string }) {
    const router = useRouter();

    return (
        <div className="w-full bg-white border-b border-neutral-200">
            {/* Top accent line */}
            <div className="h-px w-full bg-linear-to-r from-black via-neutral-400 to-transparent" />

            <div className="w-full px-6 py-5 flex items-center justify-between">
                {/* Left: back nav */}
                <button
                    onClick={() => router.push('/admin/dashboard')}
                    className="group flex items-center gap-2 text-neutral-400 hover:text-black transition-colors duration-200"
                >
                    <span className="flex items-center justify-center w-7 h-7 border border-neutral-200 group-hover:border-black group-hover:bg-black transition-all duration-200">
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:text-white transition-colors duration-200" />
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
                        Dashboard
                    </span>
                </button>

                {/* Center: title block */}
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none select-none">
                    <div className="flex items-center gap-2.5">
                        <div className="w-5 h-px bg-neutral-300" />
                        <Package className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.5} />
                        <div className="w-5 h-px bg-neutral-300" />
                    </div>
                    <h1 className="text-[11px] font-bold tracking-[0.35em] uppercase text-black leading-none mt-1">
                        {title}
                    </h1>
                </div>

                {/* Right: decorative label */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-neutral-300">
                        Admin
                    </span>
                    <div className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-neutral-300">
                        Panel
                    </span>
                </div>
            </div>
        </div>
    );
}