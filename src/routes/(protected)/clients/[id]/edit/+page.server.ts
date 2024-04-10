import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/schema/client';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', '/clients/' + event.params.id, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	const client = await db.clients.findOne({ _id: event.params.id });
	if (!client) redirect('/clients', { type: 'warning', message: 'Client not found!' }, event);

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/clients', text: 'Clients' },
			{
				href: '/clients/' + event.params.id,
				text: client.name
			},
			{ href: '/clients/' + event.params.id + '/edit', text: `Edit` }
		],
		form: await superValidate(client, zod(formSchema)),
		client
	};
};

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', '/clients/' + event.params.id, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const client = await db.clients.updateOne({ _id: event.params.id }, [{
			$set: form.data
		},
		{
			$push: {
				status: { type: 'Updated', date: new Date() }
			}
		}]);

		if (!client || !client.acknowledged) return fail(500, { form });
		if (client.matchedCount === 0) return fail(404, { form });
		if (client.modifiedCount === 0 && client.upsertedCount === 0) return fail(304, { form });

		redirect(
			'/clients/' + form.data._id,
			client.modifiedCount > 0 || client.upsertedCount > 0
				? { type: 'success', message: 'Client updated!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	},
} satisfies Actions;
