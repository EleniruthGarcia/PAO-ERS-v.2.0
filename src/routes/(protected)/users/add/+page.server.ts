import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';

import { formSchema } from '$lib/schema/user';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';
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
		form: await superValidate(
			{
				_id: 'USER-' + Date.now().toString(36).toUpperCase(),
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
			event.cookies.set('redirect', '/clients/add', { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		if (await db.users.findOne({ username: form.data.username }))
			return setError(form, 'username', 'Username already exists!');

		if (form.data.password !== form.data.confirmPassword)
			return setError(form, 'confirmPassword', 'Passwords do not match!');

		form.data.hashedPassword = await new Argon2id().hash(form.data.password);
		form.data.password = '';
		form.data.confirmPassword = '';

		const user = await db.users.insertOne(form.data);
		if (!user.acknowledged) return fail(500, { form });

		redirect(
			'/users/' + user.insertedId,
			{ type: 'success', message: 'User added successfully!' },
			event
		);
	}
};
