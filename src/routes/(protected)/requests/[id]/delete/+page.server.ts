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

		const request = await db.requests.updateOne(
			{ _id: event.params.id },
			{
				$set: {
					currentStatus: 'Archived'
				},
				$push: {
					status: { type: 'Archived', date: new Date() }
				}
			}
		);

		if (!request || !request.acknowledged) return fail(500);
		if (request.matchedCount === 0) return fail(404);
		if (request.modifiedCount === 0 && request.upsertedCount === 0) return fail(304);

		redirect(
			'/requests',
			request.modifiedCount > 0 || request.upsertedCount > 0
				? { type: 'success', message: 'Request archived!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	}
} satisfies Actions;
