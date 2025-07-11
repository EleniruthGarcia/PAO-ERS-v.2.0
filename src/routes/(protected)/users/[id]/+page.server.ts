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

	const user = await db.users
		.aggregate([
			{
				$match: { username: event.params.id }
			},
			{
				$addFields: {
					age: { $dateDiff: { startDate: '$dateOfBirth', endDate: '$$NOW', unit: 'year' } }
				}
			}
		])
		.next();
	if (!user) redirect('/users', { type: 'warning', message: 'User not found!' }, event);

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/users', text: 'Users' },
			{
				href: '/users/' + event.params.id,
				text: user.name
			}
		],
		user
	};
};
