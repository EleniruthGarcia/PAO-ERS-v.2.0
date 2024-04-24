import type { User } from '$lib/schema';

import { Home, Person, IdCard, FileText, Gear, Backpack, CardStack, Laptop } from 'svelte-radix';

const links = {
	admin: { href: '/admin', icon: Home, label: 'Dashboard' },
	dashboard: { href: '/dashboard', icon: Home, label: 'Dashboard' },
	users: { href: '/users', icon: IdCard, label: 'Users' },
	clients: { href: '/clients', icon: Person, label: 'Clients' },
	requests: { href: '/requests', icon: CardStack, label: 'Requests' },
	cases: { href: '/cases', icon: Backpack, label: 'Cases' },
	reports: { href: '/reports', icon: FileText, label: 'Reports' },
	settings: { href: '/settings', icon: Gear, label: 'Settings' },
	presentation: { href: '/presentation', icon: Laptop, label: 'Presentation' },
	about: { href: '/about', icon: Home, label: 'About' },
	services: { href: '/services', icon: Home, label: 'Services' },
	contact: { href: '/contact', icon: Home, label: 'Contact' }
};

const roles = {
	Administrator: [
		'admin',
		'users',
		'clients',
		'requests',
		'cases',
		'reports',
		'settings',
		// 'presentation'
	],
	Lawyer: ['dashboard', 'clients', 'requests', 'cases', 'reports', /* 'settings' */],
	Staff: ['dashboard', 'clients', 'requests', /* 'settings' */],
	Client: ['about', 'contact']
};

export const visibleLinks = (user?: User) =>
	Object.entries(links)
		.filter(([key]) => roles[user?.role ?? 'Client'].includes(key))
		.map(([_, value]) => value);
