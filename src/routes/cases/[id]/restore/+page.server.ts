import prisma from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		case: prisma.case.findUnique({
			where: { id: Number(params.id) }
		})
	};
};

export const actions = {
	default: async ({ params }) => {
		const case = await prisma.case.update({
			where: { id: Number(params.id) },
			data: { deletedAt: null }
		});

		if (case.deletedAt) {
			return fail(400, { unsuccessful: true });
		}

		return { success: true };
	}
} satisfies Actions;
