import prisma from '$lib/server/prisma';
import bcrypt from 'bcrypt';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		lawyer: prisma.lawyer.findUnique({
			where: { id: Number(params.id), deletedAt: null },
			include: { user: true }
		})
	};
};

export const actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();

		// required fields
		let username = data.get('username');
		let changePassword = data.get('changePassword');
		let password = data.get('password');
		let confirmPassword = data.get('confirmPassword');

		let title = data.get('title');
		let firstName = data.get('firstName');
		let middleName = data.get('middleName');
		let lastName = data.get('lastName');

		let age = data.get('age');
		let sex = data.get('sex');
		let address = data.get('address');

		// optional fields
		let nameSuffix = data.get('nameSuffix');
		let email = data.get('email');
		let contactNumber = data.get('contactNumber');

		// validation
		if (!username || !title || !firstName || !middleName || !lastName || !age || !sex || !address) {
			return fail(400, { missing: true });
		}

		if (
			typeof username !== 'string' ||
			typeof title !== 'string' ||
			typeof firstName !== 'string' ||
			typeof middleName !== 'string' ||
			typeof lastName !== 'string' ||
			typeof Number(age) !== 'number' ||
			typeof sex !== 'string' ||
			typeof address !== 'string'
		) {
			return fail(400, { invalid: true });
		}

		if (changePassword && (!password || !confirmPassword)) {
			return fail(400, { missing: true });
		}

		if (changePassword && (typeof password !== 'string' || typeof confirmPassword !== 'string')) {
			return fail(400, { invalid: true });
		}

		if (changePassword && password !== confirmPassword) {
			return fail(400, { mismatch: true });
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

		let userUpdate =
			changePassword && password && typeof password === 'string'
				? {
						username,
						passwordHash: await bcrypt.hash(password, 10)
					}
				: { username };

		// save to database
		const lawyer = await prisma.lawyer.update({
			where: { id: Number(params.id) },
			data: {
				title,
				firstName,
				middleName,
				lastName,
				nameSuffix,
				age: Number(age),
				sex,
				address,
				email,
				contactNumber,
				user: {
					update: userUpdate
				}
			}
		});

		if (!lawyer) {
			return fail(500, { error: true });
		}

		return { success: true };
	}
} satisfies Actions;
