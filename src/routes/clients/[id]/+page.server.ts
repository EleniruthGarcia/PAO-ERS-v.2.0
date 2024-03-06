import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		client: prisma.client.findUnique({
			where: { id: Number(params.id) },
			include: { request: true }
		})
	};
};
