import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', '/dashboard', { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	return {
		user_id: event.locals.user._id,
		username: event.locals.user.username,
		role: event.locals.user.role,
		breadcrumbs: [
			{
				href: '/dashboard',
				text: 'Dashboard'
			}
		]
	};
};
