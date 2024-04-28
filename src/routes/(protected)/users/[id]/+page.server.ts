import db from '$lib/server/database';
import { generateInterviewSheet } from '$lib/server/interview_sheet';

import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	const user = await db.users.findOne({ _id: event.params.id });
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
