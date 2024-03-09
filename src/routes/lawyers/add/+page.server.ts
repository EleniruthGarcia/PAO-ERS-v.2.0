import prisma from '$lib/server/prisma';
import bcrypt from 'bcrypt';

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'admin') redirect(302, '/');

	return {};
};

export const actions = {
	default: async ({ locals, request }) => {
		if (locals.user?.role !== 'admin') return fail(403, { unauthorized: true });

		const data = await request.formData();

		const username = data.get('username');
		const password = data.get('password');
		const confirmPassword = data.get('confirmPassword');

		if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
			return fail(400, { invalid: true });
		}

		if (password !== confirmPassword) {
			return fail(400, { mismatch: true });
		}

		let user = await prisma.user.findUnique({
			where: { username }
		});

		if (user) {
			return fail(400, { user: true });
		}

		// required fields
		let title = data.get('title');
		let firstName = data.get('firstName');
		let lastName = data.get('lastName');

		let age = data.get('age');
		let sex = data.get('sex');
		let address = data.get('address');

		// optional fields
		let middleName = data.get('middleName');
		let nameSuffix = data.get('nameSuffix');
		let email = data.get('email');
		let contactNumber = data.get('contactNumber');

		// validation
		if (!title || !firstName || !lastName || !age || !sex || !address) {
			return fail(400, { missing: true });
		}

		if (
			typeof title !== 'string' ||
			typeof firstName !== 'string' ||
			typeof lastName !== 'string' ||
			typeof Number(age) !== 'number' ||
			typeof sex !== 'string' ||
			typeof address !== 'string'
		) {
			return fail(400, { invalid: true });
		}

		if (middleName && typeof middleName !== 'string') {
			return fail(400, { invalid: true });
		}

		if (nameSuffix && typeof nameSuffix !== 'string') {
			return fail(400, { invalid: true });
		}

		if (email && typeof email !== 'string') {
			return fail(400, { invalid: true });
		}

		if (contactNumber && typeof contactNumber !== 'string') {
			return fail(400, { invalid: true });
		}

		// save to database
		const client = await prisma.user.create({
			data: {
				username,
				passwordHash: await bcrypt.hash(password, 10),
				userAuthToken: crypto.randomUUID(),
				lawyer: {
					create: {
						title,
						firstName,
						middleName,
						lastName,
						nameSuffix,
						age: Number(age),
						sex,
						address,
						email,
						contactNumber
					}
				}
			}
		});

		if (!client) {
			return fail(500, { error: true });
		}

		return { success: true };
	}
} satisfies Actions;
