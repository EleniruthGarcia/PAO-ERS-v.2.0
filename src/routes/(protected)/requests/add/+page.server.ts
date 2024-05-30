import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';

import { formSchema } from '$lib/schema/service';
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
			{ href: '/services', text: 'Services' },
			{ href: '/services/add', text: 'Add Service' }
		],
		form: await superValidate(
			{
				currentStatus: 'New',
				status: [{ type: 'New', date: new Date() }]
			},
			zod(formSchema),
			{ errors: false }
		),
		lawyers: await db.users.find().toArray(),
		clients: await db.clients.find().toArray()
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

		const branch = await db.branches.findOne({ _id: event.locals.user.branch_id });

		const service = await db.services.insertOne({
			...form.data,
			// _id: `${branch?.region}:${branch?.district}:${new Date().getFullYear()}:${new Date().getMonth()}:${(await db.counters.findOneAndUpdate({ _id: 'services', branch_id: branch?._id }, { $inc: { count: 1 } }, { upsert: true }))?.count}`
			_id: `${new Date().getFullYear()}:${String(new Date().getMonth()).padStart(2, '0')}:${String((await db.counters.findOneAndUpdate({ _id: 'services', branch_id: branch?._id }, { $inc: { count: 1 } }, { upsert: true }))?.count ?? 0).padStart(6, '0')}`
		});
		if (!service.acknowledged) return fail(500, { form });

		redirect(
			'/services/' + service.insertedId,
			{ type: 'success', message: 'Service added successfully!' },
			event
		);
	}
};
