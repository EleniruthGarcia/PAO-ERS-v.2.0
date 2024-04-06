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
		client
	};
};

export const actions = {
	delete: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', '/clients/' + event.params.id, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const client = await db.clients.updateOne(
			{ _id: event.params.id },
			{
				$set: { status: 'deleted' }
			}
		);
		if (!client || !client.acknowledged) return fail(500);
		if (client.matchedCount === 0) return fail(404);
		if (client.modifiedCount === 0 && client.upsertedCount === 0) return fail(304);
		redirect(
			'/clients/' + client.upsertedId,
			client.modifiedCount > 0 || client.upsertedCount > 0
				? { type: 'success', message: 'Client deleted!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	},
	generateInterviewSheet: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', '/clients/' + event.params.id, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const data = await db.requests.find({
			client_id: event.params.id
		});
		if (!data) return fail(404);

		return { interview_sheet: await generateInterviewSheet(data) };
	}
} satisfies Actions;
