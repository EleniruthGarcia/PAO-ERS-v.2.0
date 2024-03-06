import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		clients: prisma.client.findMany({
			where: { deletedAt: null }
		}),
		requests: prisma.request.findMany({
			where: { deletedAt: null }
		}),
		cases: prisma.case.findMany({
			where: { deletedAt: null }
		})
	};
};
