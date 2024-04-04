import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';

import { formSchema } from '$lib/schema/client';
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
			{ href: '/clients', text: 'Clients' },
			{ href: '/clients/add', text: 'Add Client' }
		],
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form })

		const client = await db.clients.insertOne({
			...form.data,
			_id: 'CLIENT-' + Date.now().toString(36).toUpperCase(),
			name: `${form.data.firstName} ${form.data.middleName !== '' ? form.data.middleName + ' ' : ''}${form.data.lastName}${form.data.nameSuffix !== '' ? ', ' + form.data.nameSuffix : ''}`
		});
		if (!client.acknowledged) return fail(500, { form });

		redirect('/clients/' + client.insertedId, { type: 'success', message: 'Client added successfully!' }, event);
	}
};
