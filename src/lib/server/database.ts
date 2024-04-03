import { dev } from '$app/environment';
import { DATABASE_URL } from '$env/static/private';
import { type ObjectId, MongoClient, ServerApiVersion } from 'mongodb';

const client = new MongoClient(DATABASE_URL, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: !dev
	}
});

await client.connect();

export const db = client.db();

export const users = db.collection<User>('users');
export const sessions = db.collection<Session>('sessions');
export const records = db.collection<Record>('records');

export default { users, sessions, records };

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

export interface Record {
	_id?: ObjectId;
	client: Client;
	request: Request;
	case?: Case;
}

export interface Client {
	_id?: ObjectId;
	firstName: string;
	middleName?: string;
	lastName: string;
	nameSuffix?: string;
	age: number;
	sex: 'male' | 'female';
	address: string;
	email?: string;
	contactNumber?: number;
	civilStatus: 'single' | 'married' | 'widowed' | 'separated';
	religion?: string;
	citizenship: string;
	educationalAttainment: string;
	language: string;
	individualMonthlyIncome?: number;
	detained: boolean;
	detainedAt?: string;
	detainedSince?: Date;
	spouseName?: string;
	spouseAddress?: string;
	spouseContactNumber?: number;
}

interface Request {
	_id?: ObjectId;
	date: Date;
	type: 'request' | 'complaint' | 'inquiry';
}

interface Case {
	_id?: ObjectId;
	dateFiled: Date;
	dateResolved?: Date;
	status: 'ongoing' | 'resolved';
}
