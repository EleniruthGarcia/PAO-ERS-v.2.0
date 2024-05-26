import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/schema/request';
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

	const request = await db.services.findOne({ _id: event.params.id });
	if (!request) redirect('/services', { type: 'warning', message: 'Request not found!' }, event);

	const client = await db.clients.find({ _id: { $in: request.client_id } }).toArray();
	if (!client || client.length === 0)
		redirect('/services', { type: 'warning', message: 'Client not found!' }, event);

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/services', text: 'Services' },
			{
				href: '/services/' + event.params.id,
				text: `${request.otherNature || request.nature} - ${client.length > 1 ? (client.length > 2 ? `${client[0].lastName} et. al.` : `${client[0].lastName} and ${client[1].lastName}`) : client[0].name}`
			},
			{ href: '/services/' + event.params.id + '/edit', text: `Edit` }
		],
		form: await superValidate(
			{
				...request,
				currentStatus: 'Updated'
			},
			zod(formSchema),
			{ errors: false }
		),
		clients: await db.clients.find().toArray(),
		lawyers: await db.users.find().toArray()
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

		const request = await db.services.updateOne(
			{ _id: event.params.id },
			{
				$set: form.data
			}
		);

		if (!request || !request.acknowledged) return fail(500, { form });
		if (request.matchedCount === 0) return fail(404, { form });
		if (request.modifiedCount === 0 && request.upsertedCount === 0) return fail(304, { form });

		redirect(
			'/services/' + form.data._id,
			request.modifiedCount > 0 || request.upsertedCount > 0
				? { type: 'success', message: 'Request updated!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	}
} satisfies Actions;
