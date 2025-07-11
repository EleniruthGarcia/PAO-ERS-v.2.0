import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/users', text: 'Users' }
		],
		users: db.users
			.aggregate([
				{
					$addFields: {
						// 'client.age': {
						// 	$dateDiff: { startDate: '$client.dateOfBirth', endDate: '$$NOW', unit: 'year' }
						// }
					}
				}
			])
			.toArray()
	};
};
