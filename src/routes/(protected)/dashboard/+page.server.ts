import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(
			'/login?redirect=dashboard',
			{ type: 'error', message: 'You must be logged in to access this page!' },
			event
		);
	}

	return { username: event.locals.user.username };
};
