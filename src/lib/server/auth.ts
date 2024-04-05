import { dev } from '$app/environment';
import cron from 'node-cron';

import type { User } from './database';
import { users, sessions } from './database';

import { Lucia, TimeSpan } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';

export const lucia = new Lucia(new MongodbAdapter(sessions, users), {
	sessionCookie: {
		attributes: {
			secure: !dev,
			sameSite: 'strict'
		}
	},
	sessionExpiresIn: new TimeSpan(1, 'd'),
	getUserAttributes: (attributes) => {
		return {
			...attributes
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		UserId: string;
		DatabaseUserAttributes: User;
	}
}

if (!process.env['VERCEL'])
	cron
		.schedule('0 0 * * *', async () => {
			await lucia.deleteExpiredSessions();
		})
		.start();
