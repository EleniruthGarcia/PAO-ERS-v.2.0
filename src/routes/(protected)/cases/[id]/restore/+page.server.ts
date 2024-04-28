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

		const _case = await db.cases.updateOne(
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

		if (!_case || !_case.acknowledged) return fail(500);
		if (_case.matchedCount === 0) return fail(404);
		if (_case.modifiedCount === 0 && _case.upsertedCount === 0) return fail(304);

		redirect(`/cases/${event.params.id}`, { type: 'success', message: 'Case restored!' }, event);
	}
} satisfies Actions;
