import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		clients: prisma.client.findMany(),
		requests: prisma.request.findMany(),
		cases: prisma.case.findMany()
	};
};
