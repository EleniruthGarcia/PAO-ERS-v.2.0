import { ObjectId, MongoClient, ServerApiVersion } from 'mongodb';
import { Argon2id } from 'oslo/password';
import { DATABASE_URL } from '$env/static/private';
import { dev } from '$app/environment';

const database_url = dev ? DATABASE_URL : process.env['DATABASE_URL'];

if (!database_url) {
	throw new Error('DATABASE_URL environment variable is required');
}

interface User {
	_id?: ObjectId;
	username: string;
	hashedPassword: string;
	role: 'admin' | 'user';
}

const client = new MongoClient(database_url, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: dev ? false : process.env['NODE_ENV'] === 'production',
		deprecationErrors: process.env['NODE_ENV'] === 'development'
	}
});

await client.connect();
export const db = client.db('pao');
export const users = db.collection<User>('users');

const admin = await users.findOne({ username: 'admin' });
if (!admin) {
	await users.insertOne({
		username: 'admin',
		hashedPassword: await new Argon2id().hash('password'),
		role: 'admin'
	});
}

export default { users };
