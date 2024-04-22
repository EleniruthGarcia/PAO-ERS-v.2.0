import db from '$lib/server/database';
import { generateInterviewSheet } from '$lib/server/interview_sheet';

import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', '/clients/' + event.params.id, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	const client = await db.clients.findOne({ _id: event.params.id });
	if (!client) {
		redirect('/clients', { type: 'warning', message: 'Client not found!' }, event);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/clients', text: 'Clients' },
			{
				href: '/clients/' + event.params.id,
				text: client.name
			}
		],
		requests: await db.requests.aggregate([{
			$match: { client_id: event.params.id }
		}, {
			$lookup: {
				from: 'users',
				localField: 'lawyer_id',
				foreignField: '_id',
				as: 'lawyer'
			}
		}, {
			$addFields: {
				lawyer: { $arrayElemAt: ['$lawyer', 0] }
			}
		}]).toArray(),
		client
	};
};