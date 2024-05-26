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

		const service = await db.services.updateOne(
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

		if (!service || !service.acknowledged) return fail(500);
		if (service.matchedCount === 0) return fail(404);
		if (service.modifiedCount === 0 && service.upsertedCount === 0) return fail(304);

		redirect(
			`/services/${event.params.id}`,
			{ type: 'success', message: 'Service restored!' },
			event
		);
	}
} satisfies Actions;
