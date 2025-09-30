import { LayoutDashboard } from 'lucide-react';

import { TabInterface } from '@/lib/types/tab.interface';

export const BASE_DASHBOARD_URL = '/user';

export const DASHBOARD_NAVIGATION: TabInterface[] = [
    {
        title: 'Overview',
        url: `${BASE_DASHBOARD_URL}`,
        icon: LayoutDashboard,
    },
];
