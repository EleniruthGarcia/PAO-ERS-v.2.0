import db from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
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
};
