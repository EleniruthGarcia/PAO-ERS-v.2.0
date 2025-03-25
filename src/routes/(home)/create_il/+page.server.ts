import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db, { client } from '$lib/server/database';

import { formSchema } from '$lib/schema/client';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	return {
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

				return { type: 'success' };
			}, undefined)
		);

		if (txnResult.type === 'success') {
			redirect(
				'/',
				{ type: 'success', message: 'Client added successfully!' },
				event
			);
		} else {
			return setError(form, '', 'An error occurred while adding the client.');
		}
	}
};
