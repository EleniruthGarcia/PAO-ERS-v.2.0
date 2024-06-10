import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/schema/service';
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

	const service = await db.services.findOne({ _id: event.params.id });
	if (!service) redirect('/services', { type: 'warning', message: 'Service not found!' }, event);

	const client = await db.clients.find({ _id: { $in: service.client_id } }).toArray();
	if (!client || client.length === 0)
		redirect('/services', { type: 'warning', message: 'Client not found!' }, event);

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/services', text: 'Services' },
			{
				href: '/services/' + event.params.id,
				text: `${service.otherNature || service.nature} - ${client.length > 1 ? (client.length > 2 ? `${client[0].lastName} et. al.` : `${client[0].lastName} and ${client[1].lastName}`) : client[0].name}`
			},
			{ href: '/services/' + event.params.id + '/edit', text: `Edit` }
		],
		form: await superValidate(
			{
				...service,
				currentStatus: 'Updated'
			},
			zod(formSchema),
			{ errors: false }
		),
		clients: await db.clients.find().toArray(),
		lawyers: await db.users.find().toArray(),
		cases: await db.cases.find().toArray()
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

		const service = await db.services.updateOne(
			{ _id: event.params.id },
			{
				$set: form.data
			}
		);

		if (!service || !service.acknowledged) return fail(500, { form });
		if (service.matchedCount === 0) return fail(404, { form });
		if (service.modifiedCount === 0 && service.upsertedCount === 0) return fail(304, { form });

		redirect(
			'/services/' + form.data._id,
			service.modifiedCount > 0 || service.upsertedCount > 0
				? { type: 'success', message: 'Service updated!' }
				: { type: 'info', message: 'No changes made.' },
			event
		);
	}
} satisfies Actions;
