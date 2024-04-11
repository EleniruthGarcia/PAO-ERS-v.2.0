import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';

import { formSchema } from '$lib/schema/case';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', '/dashboard', { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/cases', text: 'Cases' },
			{ href: '/cases/add', text: 'Add Case' }
		],
		form: await superValidate({
			_id: 'CASE-' + Date.now().toString(36).toUpperCase(),
			currentStatus: 'New',
			status: [{ type: 'New', date: new Date() }],
		}, zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', '/clients/add', { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const _case = await db.cases.insertOne(form.data);
		if (!_case.acknowledged) return fail(500, { form });

		redirect(
			'/cases/' + _case.insertedId,
			{ type: 'success', message: 'Case added successfully!' },
			event
		);
	}
};
