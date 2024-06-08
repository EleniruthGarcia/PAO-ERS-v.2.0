import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', event.url.pathname, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const client = await db.clients.updateOne(
			{ _id: event.params.id },
			{
				$set: {
					currentStatus: 'Restored'
				},
				$push: {
					status: { type: 'Restored', date: new Date() }
				}
			}
		);

		if (!client || !client.acknowledged) return fail(500);
		if (client.matchedCount === 0) return fail(404);
		if (client.modifiedCount === 0 && client.upsertedCount === 0) return fail(304);

		redirect(
			'/clients',
			client.modifiedCount > 0 || client.upsertedCount > 0
				? { type: 'success', message: 'Client archived!' }
				: { type: 'info', message: 'No changes made.' },
			event
		);
	}
} satisfies Actions;
