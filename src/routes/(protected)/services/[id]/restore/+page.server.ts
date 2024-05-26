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

		const request = await db.services.updateOne(
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

		if (!request || !request.acknowledged) return fail(500);
		if (request.matchedCount === 0) return fail(404);
		if (request.modifiedCount === 0 && request.upsertedCount === 0) return fail(304);

		redirect(
			`/services/${event.params.id}`,
			{ type: 'success', message: 'Request restored!' },
			event
		);
	}
} satisfies Actions;
