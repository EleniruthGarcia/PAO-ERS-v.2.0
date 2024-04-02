import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', '/dashboard', { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/clients', text: 'Clients' }
		],
		clients: db.clients.find({}).sort({}).project({ _id: 1, name: 1, email: 1, phone: 1, address: 1, city: 1, state: 1, zip: 1, country: 1, notes: 1 }).toArray()
	};
};
