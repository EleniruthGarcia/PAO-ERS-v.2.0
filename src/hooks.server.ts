import { authenticateUser } from "$lib/server/auth";
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = await authenticateUser(event);

    if (event.route.id?.includes('(admin)') && event.locals.user?.role !== 'admin') {
        throw redirect(302, '/');
    }

    if (event.route.id?.includes('(client)') && event.locals.user?.role !== 'client') {
        throw redirect(302, '/');
    }

    if (event.route.id?.includes('(lawyer)') && event.locals.user?.role !== 'lawyer') {
        throw redirect(302, '/');
    }

    const response = await resolve(event);
    return response;
};