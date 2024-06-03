import db from '$lib/server/database';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
	if (event.locals.user) {
		return {
			user: {
				...event.locals.user
			},
			allUsers: await db.users.find().toArray(),
			allClients: await db.clients.find().toArray(),
			allServices: await db.services.find().toArray(),
			allCases: await db.cases.find().toArray()
		};
	}
});
