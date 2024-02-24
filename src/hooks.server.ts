import prisma from "$lib/server/prisma";
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const session = event.cookies.get('session');

    const user = await prisma.user.findUnique({
        where: { userAuthToken: session },
        select: {
            username: true,
            role: true,
        },
    });

    if (user) {
        event.locals.user = {
            name: user.username,
            role: user.role.name,
        }
    }

    if (event.route.id?.includes('admin') && event.locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    if (event.route.id?.includes('client') && event.locals.user.role !== 'client') {
        throw redirect(302, '/');
    }

    if (event.route.id?.includes('lawyer') && event.locals.user.role !== 'lawyer') {
        throw redirect(302, '/');
    }

    const response = await resolve(event);
    return response;
};