import db from '$lib/server/database';
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

	const client = await db.clients
		.aggregate([
			{
				$match: { _id: event.params.id }
			},
			{
				$addFields: {
					// age: { $dateDiff: { startDate: '$dateOfBirth', endDate: '$$NOW', unit: 'year' } }
				}
			}
		])
		.next();

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
		services: await db.services
			.aggregate([
				{
					$match: { client_id: event.params.id }
				},
				{
					$lookup: {
						from: 'users',
						localField: 'lawyer_id',
						foreignField: '_id',
						as: 'lawyer'
					}
				},
				{
					$addFields: {
						lawyer: { $arrayElemAt: ['$lawyer', 0] }
					}
				}
			])
			.toArray(),
		client
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', event.params.id, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		event.cookies.set('client', event.params.id, { path: '/' });

		redirect('/services/add', { type: 'info', message: `Add service for ${event.locals}.` }, event);
	}
};
