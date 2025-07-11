import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db, { client } from '$lib/server/database';

import { formSchema } from '$lib/schema/client';
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

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/clients', text: 'Clients' },
			{ href: '/clients/add', text: 'Add Client' }
		],
		form: await superValidate(
			{
				currentStatus: 'New',
				status: [{ type: 'New', date: new Date() }]
			},
			zod(formSchema),
			{ errors: false }
		)
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
			session.withTransaction(async (session) => {
				form.data._id = String((await db.clients.countDocuments({}, { session })) + 1);
				const insertedClient = await db.clients.insertOne(form.data, { session });
				if (!insertedClient.acknowledged) {
					await session.abortTransaction();
					return { type: 'error' };
				}

				return { type: 'success', insertedClient };
			}, undefined)
		);

		if (txnResult.type === 'success') {
			redirect(
				'/clients/' + txnResult.insertedClient!.insertedId,
				{ type: 'success', message: 'Client added successfully!' },
				event
			);
		} else {
			return setError(form, '', 'An error occurred while adding the client.');
		}
	}
};
