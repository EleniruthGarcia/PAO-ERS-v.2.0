import { db } from './database';
import { ObjectId } from 'mongodb';

import { Lucia, TimeSpan } from 'lucia';

import type { RegisteredDatabaseUserAttributes, RegisteredDatabaseSessionAttributes } from 'lucia';

import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';

interface User extends RegisteredDatabaseUserAttributes {
	_id: ObjectId;
	username: string;
	role: 'admin' | 'user';
}

interface Session extends RegisteredDatabaseSessionAttributes {
	_id: string;
	expires_at: Date;
	user_id: ObjectId;
}

const users = db.collection<User>('users');
const sessions = db.collection<Session>('sessions');

export const lucia = new Lucia(new MongodbAdapter(sessions, users), {
	sessionCookie: {
		attributes: {
			secure: process.env['NODE_ENV'] === 'production',
			sameSite: 'strict'
		}
	},
	sessionExpiresIn: new TimeSpan(1, 'd'),
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		UserId: ObjectId;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	role: 'admin' | 'user';
}
