import prisma from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		lawyer: prisma.lawyer.findUnique({
			where: { id: Number(params.id) }
		})
	};
};

export const actions = {
	default: async ({ params }) => {
		const lawyer = await prisma.lawyer.update({
			where: { id: Number(params.id) },
			data: { deletedAt: new Date() }
		});

		if (!lawyer.deletedAt) {
			return fail(400, { unsuccessful: true });
		}

		return { success: true };
	}
} satisfies Actions;
