import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/schema/case';
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

	const _case = await db.cases.findOne({ _id: event.params.id });
	if (!_case) redirect('/cases', { type: 'warning', message: 'Case not found!' }, event);

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/cases', text: 'Clients' },
			{
				href: '/cases/' + event.params.id,
				text: _case.titleOfTheCase || 'Untitled Case'
			},
			{ href: '/clients/' + event.params.id + '/edit', text: `Edit` }
		],
		form: await superValidate({
			..._case,
			currentStatus: 'Pending',
			status: [{ type: 'Pending', date: new Date() }]
		}, zod(formSchema))
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

		const _case = await db.cases.updateOne({ _id: event.params.id }, [
			{
				$set: form.data
			},
			{
				$push: {
					status: { type: form.data.currentStatus, date: new Date() }
				}
			}
		]);

		if (!_case || !_case.acknowledged) return fail(500, { form });
		if (_case.matchedCount === 0) return fail(404, { form });
		if (_case.modifiedCount === 0 && _case.upsertedCount === 0) return fail(304, { form });

		redirect(
			'/cases/' + form.data._id,
			_case.modifiedCount > 0 || _case.upsertedCount > 0
				? { type: 'success', message: 'Case updated!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	}
} satisfies Actions;
