import type { User } from '$lib/server/database';

import { Home, Person, FileText, Gear, Backpack, CardStack } from 'svelte-radix';

const links = {
    admin: { href: '/admin', icon: Home, label: 'Admin' },
    cases: { href: '/cases', icon: Backpack, label: 'Cases' },
    clients: { href: '/clients', icon: Person, label: 'Clients' },
    dashboard: { href: '/dashboard', icon: Home, label: 'Dashboard' },
    reports: { href: '/reports', icon: FileText, label: 'Reports' },
    requests: { href: '/requests', icon: CardStack, label: 'Requests' },
    settings: { href: '/settings', icon: Gear, label: 'Settings' },
    profile: { href: '/profile', icon: Person, label: 'Profile' },
    users: { href: '/users', icon: Person, label: 'Users' },
};

const roles = {
    'Administrator': [
        'admin',
        'users',
        'clients',
        'requests',
        'cases',
        'reports',
        'profile',
        'settings'
    ],
    'Lawyer': [
        'dashboard',
        'clients',
        'requests',
        'cases',
        'reports',
        'profile',
        'settings'
    ],
    'Staff': [
        'dashboard',
        'clients',
        'requests',
        'profile',
        'settings'
    ],
    'Client': [
        'dashboard',
    ]
};

export const visibleLinks = (user?: User) => roles[user?.role ?? 'Client'].map(key => Object.entries(links).find(([k, _]) => k === key)?.[1]).filter(Boolean);