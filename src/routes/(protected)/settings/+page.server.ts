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

	const user = await db.users.findOne({ _id: event.locals.user.id });

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/settings', text: 'Settings' }
		],
		form: await superValidate(
			{
				...event.locals.user,
				currentStatus: 'Updated',
				hashedPassword: user?.hashedPassword,
			},
			zod(formSchema),
			{ errors: false }
		),
		branches: await db.branches.find().toArray(),
		users: await db.users.find().toArray()
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

		const existingUser = await db.users.findOne({ username: form.data.username });
		if (existingUser && existingUser._id !== event.locals.user.id)
			return setError(form, '', 'Username already exists!');

		if (form.data.changePassword && form.data.password) {
			form.data.hashedPassword = await new Argon2id().hash(form.data.password);
			form.data.changePassword = false;
		}

		const formData: any = form.data;
		delete formData._id;
		delete formData.password;
		delete formData.confirmPassword;
		formData.status.push({ type: formData.currentStatus, date: new Date() });
		const user = await db.users.updateOne({ _id: event.locals.user.id }, { $set: formData });

		if (!user || !user.acknowledged) return fail(500, { form });
		if (user.matchedCount === 0) return fail(404, { form });
		if (user.modifiedCount === 0 && user.upsertedCount === 0) return fail(304, { form });

		return message(form, 'Settings updated!');
	}
} satisfies Actions;
