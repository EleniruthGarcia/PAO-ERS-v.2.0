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

	const request = await db.requests.findOne({ _id: event.params.id });
	if (!request)
		redirect('/requests', { type: 'warning', message: 'Request not found!' }, event);

	const client = await db.clients.find({ _id: { $in: request.client_id } }).toArray();
	if (!client || client.length === 0)
		redirect('/requests', { type: 'warning', message: 'Client not found!' }, event);

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/requets', text: 'Requests' },
			{
				href: '/requests/' + event.params.id,
				text: `${(request.otherNature || request.nature)} - ${client.length > 1 ? (client.length > 2 ? `${client[0].lastName} et. al.` : `${client[0].lastName} and ${client[1].lastName}`) : client[0].name}`
			}
		],
		request,
		client,
		clients: await db.clients.find().toArray(),
		lawyers: await db.users.find().toArray()
	};
};