import { dev } from '$app/environment';
import { DATABASE_URL } from '$env/static/private';
import { MongoClient, ServerApiVersion } from 'mongodb';

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

export const requests = db.collection<Request>('requests');
export const clients = db.collection<Client>('clients');
export const cases = db.collection<Case>('cases');

export default { users, sessions, clients, requests, cases };

export interface User {
	_id: string;
	username: string;
	hashedPassword: string;
	role: 'Administrator' | 'Lawyer' | 'Staff' | 'Client';
	title?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	nameSuffix?: string;
	email: string;
	contactNumber: number;
	address: string;
}

export interface Session {
	_id: string;
	expires_at: Date;
	user_id: string;
}

interface Request {
	_id?: string;
	client_id: string[];
	lawyer_id: string;
	case_id?: string;
	date: Date;
	type: 'request' | 'complaint' | 'inquiry' | 'other';
}

export interface Client {
	_id?: string;
	name: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	nameSuffix?: string;
	age: number;
	sex: 'male' | 'female';
	address: string;
	email?: string;
	contactNumber?: string;
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
	spouseContactNumber?: string;
}

interface Case {
	_id?: string;
	dateFiled: Date;
	dateResolved?: Date;
	status: 'ongoing' | 'resolved';
}

const seed = {
	request: {
		_id: 'REQUEST-0000000',
		client_id: ['CLIENT-0000000'],
		lawyer_id: 'LAWYER-0000000',
		case_id: 'CASE-0000000',
		date: new Date(),
		type: 'request'
	},
	lawyer: {
		_id: 'LAWYER-0000000',
		title: 'Atty.',
		firstName: 'John',
		middleName: 'Doe',
		lastName: 'Doe',
		nameSuffix: 'Jr.'
	},
	client: {
		_id: 'CLIENT-0000000',
		name: 'John B. Doe Jr.',
		firstName: 'John',
		middleName: 'B.',
		lastName: 'Doe',
		nameSuffix: 'Jr.',
		dateOfBirth: new Date('2003-05-19'),
		address: 'Cebu City'
	},
	case: {
		_id: 'CASE-0000000',
		status: 'pending',
		type: 'interview',
		location: 'Cebu City',
		purpose: 'interview',
		dateFiled: new Date()
	}
};

// upload seed data to database
db.collection<{ _id: string }>('clients').updateOne(
	{
		_id: seed.client._id
	},
	[
		{
			$set: {
				...seed.client,
				age: {
					$subtract: [
						{
							$dateDiff: {
								startDate: '$dateOfBirth',
								endDate: '$$NOW',
								unit: 'year'
							}
						},
						{
							$cond: [
								{
									$gt: [
										0,
										{
											$subtract: [{ $dayOfYear: '$$NOW' }, { $dayOfYear: '$dateOfBirth' }]
										}
									]
								},
								1,
								0
							]
						}
					]
				}
			}
		}
	],
	{ upsert: true }
);

db.collection<{ _id: string }>('requests').updateOne(
	{
		_id: seed.request._id
	},
	{
		$set: {
			...seed.request
		}
	},
	{ upsert: true }
);

db.collection<{ _id: string }>('cases').updateOne(
	{
		_id: seed.case._id
	},
	{
		$set: {
			...seed.case
		}
	},
	{ upsert: true }
);
