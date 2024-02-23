import prisma from "$lib/prisma";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    return { clients: await prisma.client.findMany() };
};