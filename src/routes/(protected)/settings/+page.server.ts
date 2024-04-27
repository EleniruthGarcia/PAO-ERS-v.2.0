import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/schema/user';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/settings', text: 'Settings' }
		],
		form: await superValidate({
			...event.locals.user,
			currentStatus: 'Updated',
		}, zod(formSchema), { errors: false }),
		branches: await db.branches.find().toArray()
	};
};

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

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const user = await db.users.updateOne({ _id: event.locals.user._id }, [
			{
				$set: form.data
			},
			{
				$push: {
					status: { type: 'Updated', date: new Date() }
				}
			}
		]);

		if (!user || !user.acknowledged) return fail(500, { form });
		if (user.matchedCount === 0) return fail(404, { form });
		if (user.modifiedCount === 0 && user.upsertedCount === 0) return fail(304, { form });

		redirect(
			event.url.pathname,
			user.modifiedCount > 0 || user.upsertedCount > 0
				? { type: 'success', message: 'User updated!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	}
} satisfies Actions;