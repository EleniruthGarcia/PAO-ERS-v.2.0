import prisma from "$lib/server/prisma";
import { redirect, type Handle } from '@sveltejs/kit';

enum Roles {
    ADMIN = 'ADMIN',
    USER = 'USER',
    LAWYER = 'LAWYER',
}

export const handle: Handle = async ({ event, resolve }) => {
    const session = event.cookies.get('session');
    if (!session) {
        return await resolve(event);
    }

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

    const response = await resolve(event);
    return response;
};