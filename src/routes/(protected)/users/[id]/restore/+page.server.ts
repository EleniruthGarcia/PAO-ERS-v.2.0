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

		const user = await db.users.updateOne(
			{ _id: event.params.id },
			{
				$set: {
					currentStatus: 'Restored',
				},
				$push: {
					status: { type: 'Restored', date: new Date() }
				}
			}
		);

		if (!user || !user.acknowledged) return fail(500);
		if (user.matchedCount === 0) return fail(404);
		if (user.modifiedCount === 0 && user.upsertedCount === 0) return fail(304);

		redirect(
			`/users/${event.params.id}`,
			{ type: 'success', message: 'User restored!' },
			event
		);
	}
} satisfies Actions;
