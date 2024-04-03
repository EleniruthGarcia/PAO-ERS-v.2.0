import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
    if (event.locals.user) {
        const { id, username, role } = event.locals.user;
        return {
            user: {
                id,
                username,
                role
            }
        }
    }

    return {};
});