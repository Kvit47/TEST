import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { isAdmin } from "../../user/lib/auth.utils";
import useAuthStore from "../../user/model/auth.store";


export default function ProfileIcon() {

    const { user } = useAuthStore();
    if (!user) return null;
    return (

        <HoverCard openDelay={10} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link href="/profile" className="cursor-pointer">
                    <Avatar className="w-10 h-10">
                       
                        <AvatarFallback>
                            {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </HoverCardTrigger>

            <HoverCardContent className="flex w-64 flex-col gap-0.5">
                <div className="font-semibold">{user.username}</div>
                {isAdmin(user) && (
                    <Link href="/admin" className="w-full">Admin</Link>
                )}
                <Link href="/profile" className="w-full">Profile</Link>
                <Link href="/auth/signin" className="w-full" onClick={() => signOut({ callbackUrl: '/auth/signin', redirect: true })}>Logout</Link>
                
            </HoverCardContent>

        </HoverCard>


    )
}