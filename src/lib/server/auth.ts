import db from './database';

import { Lucia, TimeSpan } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';

interface User {
    _id: string;
}

interface Session {
    _id: string;
    expires_at: Date;
    user_id: string;
}

const users = db.collection<User>('users');
const sessions = db.collection<Session>('sessions');

// @ts-expect-error
export const lucia = new Lucia(new MongodbAdapter(sessions, users), {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        }
    },
    sessionExpiresIn: new TimeSpan(1, 'd'),
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
        };
    }
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    username: string;
}