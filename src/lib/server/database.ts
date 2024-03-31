import { MongoClient, ServerApiVersion } from "mongodb";
import { Argon2id } from "oslo/password";

if (!process.env['DATABASE_URL']) {
    throw new Error('DATABASE_URL environment variable is required');
}

const client = new MongoClient(process.env['DATABASE_URL'], {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: process.env['NODE_ENV'] === 'production',
        deprecationErrors: true
    }
});

await client.connect();
const db = client.db('pao');

const users = db.collection('users');
const admin = await users.findOne({ username: 'admin' });
if (!admin) {
    await users.insertOne({
        username: 'admin',
        hashedPassword: await new Argon2id().hash('password'),
        role: 'admin'
    });
}

export default db;