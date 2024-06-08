import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async (event) => {
		if (!event.locals.user || event.locals.user.role !== 'Administrator') {
			event.cookies.set('redirect', event.url.pathname, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const user = await db.users.updateOne(
			{ username: event.params.id },
			{
				$set: {
					currentStatus: 'Archived'
				},
				$push: {
					status: { type: 'Archived', date: new Date() }
				}
			}
		);

		if (!user) return fail(500);

		redirect(
			'/users',
			user.modifiedCount > 0 || user.upsertedCount > 0
				? { type: 'success', message: 'User archived!' }
				: { type: 'info', message: 'No changes made.' },
			event
		);
	}
} satisfies Actions;
