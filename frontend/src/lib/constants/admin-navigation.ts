import {
    BookUserIcon,
    CalendarIcon,
    ClipboardPlusIcon,
    ClockIcon,
    LayoutDashboardIcon,
    ListIcon,
    PillIcon,
    SettingsIcon,
    ShieldIcon,
    SyringeIcon,
    TagIcon,
    UsersIcon,
} from "lucide-react";

import { TabInterface } from "@/lib/types/tab.interface";

export const BASE_ADMIN_URL = "/admin";

export const ADMIN_NAVIGATION: TabInterface[] = [
    {
        title: "Overview",
        url: `${BASE_ADMIN_URL}`,
        icon: LayoutDashboardIcon,
    },
    {
        title: "Salle d'attente",
        url: `${BASE_ADMIN_URL}/waiting-room`,
        icon: ClockIcon,
    },
    {
        title: "Rendez-vous",
        url: `${BASE_ADMIN_URL}/appointments`,
        icon: CalendarIcon,
    },
    {
        title: "Patients",
        url: `${BASE_ADMIN_URL}/patients`,
        icon: BookUserIcon,
        children: [
            {
                title: "Ajouter un patient",
                url: `${BASE_ADMIN_URL}/patients/add`,
                icon: ClipboardPlusIcon,
            },
            {
                title: "Liste des patients",
                url: `${BASE_ADMIN_URL}/patients`,
                icon: ListIcon,
            },
        ],
    },
    {
        title: "Configuration",
        url: `${BASE_ADMIN_URL}/configuration`,
        icon: SettingsIcon,
        children: [
            {
                title: "Médicaments",
                url: `${BASE_ADMIN_URL}/configuration/medications`,
                icon: PillIcon,
            },
            {
                title: "Catégories",
                url: `${BASE_ADMIN_URL}/configuration/categories`,
                icon: TagIcon,
            },
            {
                title: "Allergies",
                url: `${BASE_ADMIN_URL}/configuration/allergies`,
                icon: SyringeIcon,
            },
            {
                title: "Assurances",
                url: `${BASE_ADMIN_URL}/configuration/insurances`,
                icon: ShieldIcon,
            },
        ],
    },
    {
        title: "Utilisateurs",
        url: `${BASE_ADMIN_URL}/users`,
        icon: UsersIcon,
    },
];
