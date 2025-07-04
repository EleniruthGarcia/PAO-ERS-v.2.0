import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db, { client } from '$lib/server/database';

import { formSchema } from '$lib/schema/service';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	let client_id: string[] | undefined = undefined;
	if (event.cookies.get('client')) {
		client_id = [event.cookies.get('client') ?? ''];
		event.cookies.set('client', '', { path: '/' });
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
				status: [{ type: 'New', date: new Date() }],
				lawyer_id: event.locals.user.id,
				client_id,
				date: new Date(),
				nature: ['Administration of Oath'] 
			},
			zod(formSchema),
			{ errors: false }
		),

		lawyers: await db.users.find().toArray(),
		clients: await db.clients.find().toArray(),
		cases: await db.cases.find().toArray()
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

		const txnResult = await client.withSession(async (session) =>
			session.withTransaction(async () => {
				const lawyer = await db.users.findOne({ _id: form.data.lawyer_id }, { session });
				const branch = await db.branches.findOne({ _id: lawyer?.branch_id }, { session });

				const service = await db.services.insertOne(
					{
						...form.data,
						// _id: `${branch?.region}:${branch?.district}:${new Date().getFullYear()}:${new Date().getMonth()}:${(await db.counters.findOneAndUpdate({ _id: 'services', branch_id: branch?._id }, { $inc: { count: 1 } }, { upsert: true }))?.count}`
						_id: `${new Date().getFullYear()}:${String(new Date().getMonth() + 1).padStart(2, '0')}:${String((await db.counters.findOneAndUpdate({ _id: `services_${branch?.region}_${branch?.district}` }, { $inc: { count: 1 } }, { upsert: true }))?.count ?? 0).padStart(6, '0')}`
					},
					{ session }
				);
				if (!service.acknowledged) {
					await session.abortTransaction();
					return { type: 'error', error: 'Failed to add service!' };
				}

				return { type: 'success', service };
			}, undefined)
		);

		if (txnResult.type === 'success') {
			redirect(
				'/services/' + txnResult.service!.insertedId,
				{ type: 'success', message: 'Service added successfully!' },
				event
			);
		} else {
			return fail(500, { form });
		}
	}
};
