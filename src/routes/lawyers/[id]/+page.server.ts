import prisma from '$lib/server/prisma';

import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (locals.user?.role !== 'admin') redirect(302, '/');

	return {
		lawyer: prisma.lawyer.findUnique({
			where: {
				id: Number(params.id)
			},
			include: {
				user: true
			}
		})
	};
};

export const actions = {
	delete: async ({ params }) => {
		const lawyer = await prisma.lawyer.update({
			where: { id: Number(params.id) },
			data: { deletedAt: new Date(), deleted: true }
		});

		if (!lawyer) {
			return fail(400, { notFound: true });
		}

		return { success: true };
	},
	edit: async ({ request, params }) => {
		const data = await request.formData();

		// required fields
		let username = data.get('username');
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
		if (!username || !title || !middleName || !lastName || !age || !sex || !address) {
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
		const lawyer = await prisma.lawyer.update({
			where: { id: Number(params.id) },
			include: { user: true },
			data: {
				user: { update: { data: { username } } },
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
		});

		if (!lawyer) {
			return fail(500, { error: true });
		}

		return { success: true };
	}
} satisfies Actions;
