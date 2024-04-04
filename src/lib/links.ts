import type { User } from '$lib/server/database';

import { Home, Person, FileText, Gear, Backpack, CardStack } from 'svelte-radix';

const links = {
    admin: { href: '/admin', icon: Home, label: 'Admin' },
    dashboard: { href: '/dashboard', icon: Home, label: 'Dashboard' },
    clients: { href: '/clients', icon: Person, label: 'Clients' },
    requests: { href: '/requests', icon: CardStack, label: 'Requests' },
    cases: { href: '/cases', icon: Backpack, label: 'Cases' },
    users: { href: '/users', icon: Person, label: 'Users' },
    reports: { href: '/reports', icon: FileText, label: 'Reports' },
    settings: { href: '/settings', icon: Gear, label: 'Settings' },
};

const roles = {
    'Administrator': [
        'admin',
        'users',
        'clients',
        'requests',
        'cases',
        'reports',
        'settings'
    ],
    'Lawyer': [
        'dashboard',
        'clients',
        'requests',
        'cases',
        'reports',
        'settings'
    ],
    'Staff': [
        'dashboard',
        'clients',
        'requests',
        'settings'
    ],
    'Client': [
        'dashboard',
    ]
};

export const visibleLinks = (user?: User) => Object.entries(links).filter(([key]) => roles[user?.role ?? 'Client'].includes(key)).map(([_, value]) => value);