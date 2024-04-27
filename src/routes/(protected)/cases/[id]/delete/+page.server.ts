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
				$push: {
					status: { type: 'Archived', date: new Date() }
				}
			}
		);

		if (!_case || !_case.acknowledged) return fail(500);
		if (_case.matchedCount === 0) return fail(404);
		if (_case.modifiedCount === 0 && _case.upsertedCount === 0) return fail(304);

		redirect(
			'/cases',
			_case.modifiedCount > 0 || _case.upsertedCount > 0
				? { type: 'success', message: 'Case archived!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	}
} satisfies Actions;
