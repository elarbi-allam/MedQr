'use client';

import React, { Fragment, JSX, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Home } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { ADMIN_NAVIGATION } from '@/lib/constants/admin-navigation';
import { DASHBOARD_NAVIGATION } from '@/lib/constants/dashboard-navigation';
import { JWTPayloadType } from '@/lib/types/jwt-payload.type';
import { TabInterface } from '@/lib/types/tab.interface';

// Breadcrumb skeleton component
const BreadcrumbSkeleton = () => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
};

/**
 * Checks if a route pattern matches the current path
 * Supports dynamic segments in the format :param or [param]
 */
const isRouteMatch = (routePattern: string, currentPath: string): boolean => {
    // Convert route patterns to regex patterns
    // :id -> ([^/]+)
    // [id] -> ([^/]+)
    const regexPattern = routePattern
        .replace(/\/:[^/]+/g, '/([^/]+)')
        .replace(/\/\[[^\]]+\]/g, '/([^/]+)')
        .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(currentPath);
};

/**
 * Extracts dynamic parameters from a route
 */
const extractDynamicParams = (
    routePattern: string,
    currentPath: string
): Record<string, string> => {
    const params: Record<string, string> = {};

    // Get parameter names from route pattern
    const paramNames: string[] = [];

    // Extract :param style parameters
    const colonParams = routePattern.match(/\/:([^/]+)/g);
    if (colonParams) {
        colonParams.forEach((param) => {
            paramNames.push(param.substring(2)); // Remove /: prefix
        });
    }

    // Extract [param] style parameters
    const bracketParams = routePattern.match(/\/\[([^\]]+)\]/g);
    if (bracketParams) {
        bracketParams.forEach((param) => {
            paramNames.push(param.substring(2, param.length - 1)); // Remove /[ and ]
        });
    }

    // If no parameters, return empty object
    if (paramNames.length === 0) {
        return params;
    }

    // Convert route pattern to regex with capturing groups
    const regexPattern = routePattern
        .replace(/\/:[^/]+/g, '/([^/]+)')
        .replace(/\/\[[^\]]+\]/g, '/([^/]+)')
        .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    const matches = currentPath.match(regex);

    // If we have matches, assign them to param names
    if (matches && matches.length > 1) {
        for (let i = 0; i < paramNames.length; i++) {
            params[paramNames[i]] = matches[i + 1];
        }
    }

    return params;
};

export default function DashboardBreadcrumb() {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Use the correct cookie name
    const token = Cookies.get('access-token');
    // decode the user token using jwt-decode
    const user = token ? (jwtDecode(token) as JWTPayloadType) : null;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Memoized tabs based on user role
    const tabs = useMemo(() => {
        if (!mounted) return [];

        try {
            if (!token) return [];

            const decodedToken = jwtDecode(token) as JWTPayloadType;

            // Return specific tabs for user role
            if (decodedToken.role === 'user') {
                return DASHBOARD_NAVIGATION;
            }

            // Return admin tabs for admin role
            if (decodedToken.role === 'admin') {
                return ADMIN_NAVIGATION;
            }

            return [];
        } catch {
            return [];
        }
    }, [mounted, token]);

    const pathSegments = useMemo(
        () => pathname.split('/').filter(Boolean),
        [pathname]
    );

    const breadcrumbItems = useMemo(
        () =>
            pathSegments.reduce((acc: JSX.Element[], _, index) => {
                const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
                let navItem: TabInterface | null = null;
                let dynamicParams: Record<string, string> = {};

                if (!tabs || !tabs.length) return acc;

                // First check for exact matches
                navItem = tabs.find((item) => item.url === path) || null;

                if (!navItem) {
                    // Check for dynamic route matches in top-level items
                    const dynamicMatch = tabs.find((item) =>
                        isRouteMatch(item.url, path)
                    );
                    if (dynamicMatch) {
                        navItem = dynamicMatch;
                        dynamicParams = extractDynamicParams(
                            dynamicMatch.url,
                            path
                        );
                    }
                }

                if (!navItem) {
                    // Check for nested items in all tabs with children
                    for (const tab of tabs) {
                        if (tab.children) {
                            // First try exact match in children
                            const childItem =
                                tab.children.find(
                                    (child) => child.url === path
                                ) || null;
                            if (childItem) {
                                navItem = childItem;
                                break;
                            }

                            // Then try dynamic match in children
                            const dynamicChildMatch = tab.children.find(
                                (child) => isRouteMatch(child.url, path)
                            );
                            if (dynamicChildMatch) {
                                navItem = dynamicChildMatch;
                                dynamicParams = extractDynamicParams(
                                    dynamicChildMatch.url,
                                    path
                                );
                                break;
                            }
                        }
                    }
                }

                if (navItem) {
                    if (navItem.url === '/admin' && pathSegments.length > 1) {
                        return acc;
                    }

                    // For dynamic routes, display the actual value instead of the parameter placeholder
                    let displayTitle = navItem.title;

                    // If this is a dynamic route with an ID parameter, append the ID to the title
                    if (Object.keys(dynamicParams).length > 0) {
                        const idParam = dynamicParams.id;
                        if (idParam) {
                            // For edit routes, show "Edit [resource] #[id]"
                            if (path.includes('/edit')) {
                                displayTitle = `${displayTitle} #${idParam}`;
                            }
                            // For view routes, show the ID
                            else if (
                                displayTitle.toLowerCase().includes('voir') ||
                                displayTitle === navItem.title
                            ) {
                                displayTitle = `${displayTitle} #${idParam}`;
                            }
                        }
                    }

                    acc.push(
                        <Fragment key={navItem.title + path}>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={path}>
                                        <Badge
                                            variant={'outline'}
                                            className="rounded-lg p-1.5 px-3 text-sm font-medium text-muted-foreground hover:text-brand"
                                        >
                                            {displayTitle}
                                        </Badge>
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < pathSegments.length - 1 && (
                                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                            )}
                        </Fragment>
                    );
                }
                return acc;
            }, []),
        [pathSegments, tabs]
    );

    // Return skeleton during SSR or when not mounted
    if (!mounted) {
        return <BreadcrumbSkeleton />;
    }

    if (!tabs || tabs.length === 0) {
        return null;
    }

    // Determine the home link based on user role
    const homeLink = user?.role === 'admin' ? '/admin' : '/user';

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={homeLink}>
                            <Badge
                                variant={'outline'}
                                className="rounded-lg p-2 text-sm font-medium text-muted-foreground hover:text-brand"
                            >
                                <Home
                                    aria-hidden="true"
                                    className="stroke-3 size-4"
                                />
                                <span className="sr-only">Home</span>
                            </Badge>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.length > 0 && (
                    <BreadcrumbSeparator>/</BreadcrumbSeparator>
                )}
                {breadcrumbItems.map((item) => item)}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
