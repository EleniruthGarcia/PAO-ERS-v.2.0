import prisma from '$lib/server/prisma'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user?.role !== 'admin')
        redirect(302, '/')

    return {
        lawyers: prisma.lawyer.findMany()
    };
}
