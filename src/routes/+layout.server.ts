import { visibleLinks } from '$lib/links';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
    if (event.locals.user) {
        return {
            user: {
                ...event.locals.user,
            }
        }
    }
});