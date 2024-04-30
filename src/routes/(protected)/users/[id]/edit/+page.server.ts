import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/schema/user';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	const user = await db.users.findOne({ _id: event.params.id });
	if (!user) redirect('/users', { type: 'warning', message: 'User not found!' }, event);

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/users', text: 'Users' },
			{
				href: '/users/' + event.params.id,
				text: user.name
			},
			{ href: '/users/' + event.params.id + '/edit', text: `Edit` }
		],
		form: await superValidate(
			{
				...user,
				currentStatus: 'Updated'
			},
			zod(formSchema),
			{ errors: false }
		),
		branches: await db.branches.find().toArray()
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

		if (form.data.password !== form.data.confirmPassword)
			return setError(form, '', 'Passwords do not match!');

		const existingUser = await db.users.findOne({ username: form.data.username });
		if (existingUser && existingUser._id !== form.data._id)
			return setError(form, '', 'Username already exists!');

		form.data.hashedPassword = await new Argon2id().hash(form.data.password);

		const formData: any = form.data;
		delete formData._id;
		delete formData.password;
		delete formData.confirmPassword;
		formData.status.push({ type: formData.currentStatus, date: new Date() });
		const user = await db.users.updateOne({ _id: form.data._id }, { $set: formData });

		if (!user || !user.acknowledged) return fail(500, { form });
		if (user.matchedCount === 0) return fail(404, { form });
		if (user.modifiedCount === 0 && user.upsertedCount === 0) return fail(304, { form });

		redirect(
			'/users/' + form.data._id,
			user.modifiedCount > 0 || user.upsertedCount > 0
				? { type: 'success', message: 'User updated!' }
				: { type: 'info', message: 'No changes made...' },
			event
		);
	}
} satisfies Actions;
