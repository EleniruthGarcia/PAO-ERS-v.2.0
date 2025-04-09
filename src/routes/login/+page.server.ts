import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db, { client } from '$lib/server/database';
import { lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';

import { formSchema } from '$lib/schema/login';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user)
		redirect('/', { type: 'warning', message: 'You are already logged in!' }, event);

	return {
		form: await superValidate(zod(formSchema), { errors: false })
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;

		const txnResult = await client.withSession(async (session) =>
			session.withTransaction(async (session) => {
				const existingUser = await db.users.findOne({ username }, { session });
				if (!existingUser) {
					await session.abortTransaction();
					return { type: 'error', message: 'User does not exist!' };
				}

				const validPassword = await new Argon2id().verify(existingUser.hashedPassword, password);
				if (!validPassword) {
					await session.abortTransaction();
					return { type: 'error', message: 'Wrong password!' };
				}

				const luciaSession = await lucia.createSession(existingUser._id, {});
				const sessionCookie = lucia.createSessionCookie(luciaSession.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});

				let redirectUrl = existingUser.role === 'Administrator' ? '/admin' : '/dashboard';
				if (event.cookies.get('redirect') !== undefined || event.cookies.get('redirect') !== '') {
					redirectUrl = event.cookies.get('redirect') || redirectUrl;
					event.cookies.set('redirect', '', { path: '/' });
				}

				return { type: 'success', redirectUrl };
			}, undefined)
		);

		if (txnResult.type == 'success' && txnResult.redirectUrl) {
			redirect(
				txnResult.redirectUrl,
				{ type: 'success', message: 'Logged in successfully!' },
				event
			);
		} else {
			if (txnResult.message === 'User does not exist!') {
				return setError(form, 'username', 'User does not exist!');
			}
			if (txnResult.message === 'Wrong password!') {
				return setError(form, 'password', 'Wrong password!');
			}
			return fail(500, { form });
		}
	}
};
