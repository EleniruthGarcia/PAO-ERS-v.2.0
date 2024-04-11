import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';

import { formSchema } from '$lib/schema/user';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { Argon2id } from 'oslo/password';

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
			{ href: '/users', text: 'Users' },
			{ href: '/users/add', text: 'Add User' }
		],
		form: await superValidate({
			currentStatus: 'New',
			status: [{ type: 'New', date: new Date() }],
		}, zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', '/clients/add', { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const user = await db.users.insertOne({
			...form.data,
			_id: form.data.role === 'Lawyer' ? 'LAWYER' : 'STAFF' + '-' + Date.now().toString(36).toUpperCase(),
			hashedPassword: await (new Argon2id().hash(form.data.hashedPassword))
		});
		if (!user.acknowledged) return fail(500, { form });

		redirect(
			'/users/' + user.insertedId,
			{ type: 'success', message: 'User added successfully!' },
			event
		);
	}
};
