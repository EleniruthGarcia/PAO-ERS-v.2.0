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
			{ href: '/cases', text: 'Cases' },
			{
				href: '/cases/' + event.params.id,
				text: _case.titleOfTheCase || 'Untitled Case'
			},
			{ href: '/cases/' + event.params.id + '/edit', text: `Edit` }
		],
		form: await superValidate(
			{
				..._case,
				currentStatus: _case.currentStatus === 'New' ? 'Pending' : _case.currentStatus
			},
			zod(formSchema),
			{ errors: false }
		),
		requests: await db.requests.find().toArray(),
		clients: await db.clients.find().toArray(),
		users: await db.users.find().toArray()
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

		form.data.status.push({ type: form.data.currentStatus, date: new Date() });

		const _case = await db.cases.updateOne({ _id: event.params.id }, { $set: form.data });

		if (!_case || !_case.acknowledged) return fail(500, { form });
		if (_case.matchedCount === 0) return fail(404, { form });
		if (_case.modifiedCount === 0 && _case.upsertedCount === 0) return fail(304, { form });

		if (form.data.transferredTo) {
			const request = await db.requests.updateOne({ _id: form.data._id }, { $set: { lawyer_id: form.data.transferredTo } });
			if (!request) return fail(500, { form });
		}

		redirect(
			'/cases/' + form.data._id,
			_case.modifiedCount > 0 || _case.upsertedCount > 0
				? { type: 'success', message: 'Case updated!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	}
} satisfies Actions;
