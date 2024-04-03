import { Home, Person, FileText, Gear, QuestionMarkCircled } from 'svelte-radix';

export const visibleLinks = (links?: string[]) => Object.entries({
    dashboard: { href: '/dashboard', icon: Home, label: 'Dashboard' },
    clients: { href: '/clients', icon: Person, label: 'Clients' },
    reports: { href: '/reports', icon: FileText, label: 'Reports' },
    settings: { href: '/settings', icon: Gear, label: 'Settings' },
    about: { href: '/about', icon: QuestionMarkCircled, label: 'About' }
}).filter(([key, _]) => links?.includes(key) ?? true).map(([_, value]) => value);