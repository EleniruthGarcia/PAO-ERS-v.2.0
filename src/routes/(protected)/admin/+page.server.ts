import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user?.role !== 'Administrator') {
		event.cookies.set('redirect', '/admin', { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in as an administrator to access this page!' },
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/admin', text: 'Dashboard' }
		],
		clients: db.clients.find().toArray()
	};
};
