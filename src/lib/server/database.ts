import { dev } from '$app/environment';
import { DATABASE_URL } from '$env/static/private';
import { type ObjectId, MongoClient, ServerApiVersion } from 'mongodb';

const client = new MongoClient(DATABASE_URL, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: !dev,
	}
});

await client.connect();

export const db = client.db();

export const users = db.collection<User>('users');
export const sessions = db.collection<Session>('sessions');
export const clients = db.collection<Client>('clients');

export default { users, sessions, clients };

export interface User {
	_id: ObjectId;
	username: string;
	hashedPassword: string;
	role: 'admin' | 'user';
}

export interface Session {
	_id: string;
	expires_at: Date;
	user_id: ObjectId;
}

export interface Client {
	_id?: ObjectId;
	name: string;
	secret: string;
	redirect_uris: string[];
}
