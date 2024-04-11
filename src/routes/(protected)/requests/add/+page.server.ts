import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';

import { formSchema } from '$lib/schema/request';
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
			{ href: '/requests', text: 'Requests' },
			{ href: '/requests/add', text: 'Add Request' }
		],
		form: await superValidate(
			{
				currentStatus: 'New',
				status: [{ type: 'New', date: new Date() }]
			},
			zod(formSchema),
			{ errors: false }
		),
		lawyers: await db.users.find({ role: 'Lawyer' }).toArray()
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const request = await db.requests.insertOne({
			...form.data,
			_id: 'REQUEST-' + Date.now().toString(36).toUpperCase()
		});
		if (!request.acknowledged) return fail(500, { form });

		redirect(
			'/requests/' + request.insertedId,
			{ type: 'success', message: 'Request added successfully!' },
			event
		);
	}
};
