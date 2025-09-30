'use client';

import { useEffect, useState } from 'react';
import Link, { useLinkStatus } from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Loader2 } from 'lucide-react';

import { ADMIN_NAVIGATION } from '@/lib/constants/admin-navigation';
import { DASHBOARD_NAVIGATION } from '@/lib/constants/dashboard-navigation';
import { JWTPayloadType } from '@/lib/types/jwt-payload.type';
import { TabInterface } from '@/lib/types/tab.interface';
import { cn } from '@/lib/utils';
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from './ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from './ui/collapsible';

export default function DashboardNavItems() {
    const [tabs, setTabs] = useState<TabInterface[] | null>(null);

    // navigation hook
    const { pending } = useLinkStatus();

    const pathname = usePathname();

    useEffect(() => {
        let role: string | undefined = undefined;
        const userToken = Cookies.get('access-token');

        if (userToken) {
            const decodedToken = jwtDecode<JWTPayloadType>(userToken);
            role = decodedToken.role;
        }

        if (role) {
            setTabs(() => {
                return role === 'admin'
                    ? ADMIN_NAVIGATION
                    : DASHBOARD_NAVIGATION;
            });
        }
    }, []);

    return (
        tabs &&
        tabs.map((item) =>
            item.children ? (
                <Collapsible
                    key={item.title}
                    defaultOpen
                    className="group/collapsible"
                >
                    <SidebarMenuItem className="group-data-[collapsible=icon]:size-10!">
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="hover:bg-primary/10 px-4 py-5 data-[active=true]:bg-brand/10 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:pl-3!">
                                <item.icon
                                    className={cn(
                                        'size-4',
                                        pathname === item.url && 'text-brand'
                                    )}
                                />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {item.children.map((child) => (
                                <SidebarMenuSub key={child.title}>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === child.url}
                                            tooltip={child.title}
                                            className="group hover:bg-primary/10 px-4 py-5 data-[active=true]:bg-brand/10 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:pl-3! group-data-[collapsible=icon]:pr-8!"
                                        >
                                            <Link
                                                href={child.url}
                                                prefetch={false}
                                            >
                                                <child.icon
                                                    className={cn(
                                                        'size-4',
                                                        pathname ===
                                                            child.url &&
                                                            'text-brand'
                                                    )}
                                                />
                                                <span
                                                    className={cn(
                                                        pathname ===
                                                            child.url &&
                                                            'text-brand'
                                                    )}
                                                >
                                                    {child.title}
                                                </span>
                                                {pending && (
                                                    <Loader2 className="size-4 text-brand animate-spin" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            ))}
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            ) : (
                <SidebarMenuItem
                    key={item.title}
                    className="group-data-[collapsible=icon]:size-10!"
                >
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        tooltip={item.title}
                        className="group hover:bg-primary/10 px-4 py-5 data-[active=true]:bg-brand/10 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:pl-3!"
                    >
                        <Link href={item.url} as={item.url} prefetch={false}>
                            <item.icon
                                className={cn(
                                    'size-4',
                                    pathname === item.url && 'text-brand'
                                )}
                            />
                            <span
                                className={cn(
                                    pathname === item.url && 'text-brand'
                                )}
                            >
                                {item.title}
                            </span>
                            {pending && (
                                <Loader2 className="size-4 text-brand animate-spin" />
                            )}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )
        )
    );
}
