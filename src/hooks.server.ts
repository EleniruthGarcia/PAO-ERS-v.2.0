import { authenticateUser } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = await authenticateUser(event);

	if (
		!event.locals.user &&
		(event.url.pathname.startsWith('/cases') ||
			event.url.pathname.startsWith('/clients') ||
			event.url.pathname.startsWith('/lawyers') ||
			event.url.pathname.startsWith('/reports') ||
			event.url.pathname.startsWith('/settings'))
	)
		throw redirect(303, '/');

	if (event.url.pathname.startsWith('/lawyers') && event.locals.user?.role !== 'admin')
		throw redirect(303, '/');

	const response = await resolve(event);
	return response;
};
