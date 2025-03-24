import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db, { client } from '$lib/server/database';

import { formSchema } from '$lib/schema/client';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	return {
		form: await superValidate(
			{
				_id: '',
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
				const client = await db.clients.insertOne(form.data, { session });
				if (!client.acknowledged) {
					await session.abortTransaction();
					return { type: 'error' };
				}

				return { type: 'success', client };
			}, undefined)
		);

		if (txnResult.type === 'success') {
			redirect(
				'/clients/' + txnResult.client!.insertedId,
				{ type: 'success', message: 'Client added successfully!' },
				event
			);
		} else {
			return fail(500, { form });
		}
	}
};
