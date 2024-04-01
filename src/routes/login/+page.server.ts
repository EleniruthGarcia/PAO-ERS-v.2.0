import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';
import { lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';

import { formSchema } from '$lib/schema/login';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { username, password } = form.data;

		const existingUser = await db.users.findOne({
			username
		});

		if (!existingUser) {
			return setError(form, 'username', 'User does not exist!');
		}

		const validPassword = await new Argon2id().verify(existingUser.hashedPassword, password);
		if (!validPassword) {
			return setError(form, 'password', 'Wrong password!');
		}

		const session = await lucia.createSession(existingUser._id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(event.cookies.get('redirect') || '/', { type: 'success', message: 'Logged in successfully!' }, event);
	}
};
