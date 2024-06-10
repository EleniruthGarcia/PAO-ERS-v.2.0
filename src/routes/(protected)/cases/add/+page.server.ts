import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';

import { formSchema } from '$lib/schema/case';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

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
			{ href: '/cases', text: 'Cases' },
			{ href: '/cases/add', text: 'Add Case' }
		],
		form: await superValidate(
			{
				currentStatus: 'New',
				status: [{ type: 'New', date: new Date() }]
			},
			zod(formSchema),
			{ errors: false }
		),
		services: await db.services.find().toArray(),
		clients: await db.clients.find().toArray(),
		users: await db.users.find().toArray()
	};
};

export const actions: Actions = {
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

		const _case = await db.cases.insertOne(form.data);
		if (!_case.acknowledged) return fail(500, { form });

		if (form.data.transferredTo) {
			const service = await db.services.updateOne(
				{ _id: form.data.controlNo },
				{ $set: { lawyer_id: form.data.transferredTo } }
			);
			if (!service) return fail(500, { form });
		}

		redirect(
			'/cases/' + _case.insertedId,
			{ type: 'success', message: 'Case added successfully!' },
			event
		);
	}
};
