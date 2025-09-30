'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOutIcon, UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { useGetCurrentUserInfo } from '@/features/admin/users/hooks/use-user';

export default function ProfileMenu() {
    const [mounted, setMounted] = useState(false);

    const router = useRouter();

    // get user info from api and cache the response
    // const { data: userInfo, isLoading } = useGetCurrentUserInfo();

    // Handle logout
    const handleLogout = () => {
        Cookies.remove('access-token');
        router.push('/');
    };

    // Set mounted to true
    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything until client-side hydration is complete
    if (!mounted) {
        return null;
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="size-10 justify-center gap-2 transition-all rounded-lg duration-300 hover:bg-brand/10 hover:text-brand border hover:border-brand"
                    >
                        <UserIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end">
                    <DropdownMenuLabel className="flex w-fit items-center gap-2">
                        <Avatar className="size-8 bg-card">
                            <AvatarFallback className="uppercase text-brand-foreground">
                                {/* {userInfo?.data?.firstName?.charAt(0) ?? ''} */}
                                {/* ici on doit avoir un user name  */}
                                un
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            {/* <span className="text-sm">
                                {isLoading
                                    ? 'Chargement...'
                                    : `${userInfo?.data?.firstName ?? ''}`}
                            </span> */}
                            <span className="text-xs text-muted-foreground/50">
                                {/* {userInfo?.data?.role ?? ''} */}
                                {/* ici on doit avoir un user name  */}
                            </span>
                        </div>
                    </DropdownMenuLabel>
                    {/* <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex cursor-pointer p-0">
                        <Link href={`/profile`} className="flex w-full items-center gap-1.5 px-2 py-1.5">
                            <UserIcon className="size-3" />
                            Profil
                        </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="group flex cursor-pointer items-center gap-1.5 focus:bg-error focus:text-error-foreground"
                        onClick={handleLogout}
                    >
                        <LogOutIcon className="size-3 group-hover:text-error-foreground" />
                        Déconnexion
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
