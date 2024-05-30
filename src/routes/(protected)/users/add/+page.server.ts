import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';

import { formSchema } from '$lib/schema/user';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';
import { Argon2id } from 'oslo/password';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user?.role !== 'Administrator') {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{
				type: 'warning',
				message: 'You must be logged in as an administrator to access this page!'
			},
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/users', text: 'Users' },
			{ href: '/users/add', text: 'Add User' }
		],
		users: await db.users.find().toArray(),
		branches: await db.branches.find().toArray(),
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
		if (event.locals.user?.role !== 'Administrator') {
			event.cookies.set('redirect', event.url.pathname, { path: '/' });
			redirect(
				'/login',
				{
					type: 'warning',
					message: 'You must be logged in as an administrator to access this page!'
				},
				event
			);
		}

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		if (form.data.password !== form.data.confirmPassword)
			return setError(form, '', 'Passwords do not match!');

		const existingUser = await db.users.findOne({ username: form.data.username });
		if (existingUser) return setError(form, '', 'Username already exists!');

		form.data._id = String((await db.users.countDocuments()) + 1);
		form.data.hashedPassword = await new Argon2id().hash(form.data.password);

		const formData: any = form.data;
		delete formData.password;
		delete formData.confirmPassword;

		const user = await db.users.insertOne(formData);
		if (!user) return fail(500, { form });

		redirect(
			'/users/' + formData.username,
			{ type: 'success', message: 'User added successfully!' },
			event
		);
	}
};
