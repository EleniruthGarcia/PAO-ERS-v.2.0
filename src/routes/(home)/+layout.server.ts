import db from '$lib/server/database';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
	return {
		user: db.users.findOne({
			username: event.locals.user?.username,
			projection: {
				_id: 1,
				username: 1,
				role: 1
			}
		})
	};
});
