import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

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
			},
			{ href: '/clients/' + event.params.id + '/delete', text: `Delete` }
		],
		client
	};
};

export const actions = {
	default: async (event) => {
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
				$set: { status: 'Archived' }
			}
		);

		if (!client || !client.acknowledged) return fail(500);
		if (client.matchedCount === 0) return fail(404);
		if (client.modifiedCount === 0 && client.upsertedCount === 0) return fail(304);

		redirect(
			'/clients',
			client.modifiedCount > 0 || client.upsertedCount > 0
				? { type: 'success', message: 'Client archived!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	}
} satisfies Actions;
