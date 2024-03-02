import prisma from '$lib/server/prisma'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
    const lawyer = locals.user ? await prisma.user.findUnique({
        where: { username: locals.user?.name }
    }).lawyer() : null

    return {
        user: locals.user,
        lawyer: lawyer ? lawyer[0] : null
    }
}