import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		lawyers: prisma.lawyer.findMany({
			include: { user: true }
		})
	};
};
