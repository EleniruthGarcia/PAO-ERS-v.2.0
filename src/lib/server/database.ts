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
	classification?: ['Child in Conflict with the Law' | 'Woman Client' | 'VAWC Victim' | 'Law Enforcer' | 'Drug-Related Duty' | 'OFW (Land-Based)' | 'OFW (Sea-Based)' | 'FRs and FVEs' | 'Senior Citizen' | 'Refugee or Evacuee' | 'Tenant in Agrarian Case' | 'Victim of Terrorism (R.A. No. 9372)' | 'Victim of Torture (R.A. 9745)' | 'Victim of Trafficking (R.A. No. 9208)' | 'Foreign National' | 'Urban Poor' | 'Rural Poor' | 'Indigenous People' | 'PWD' | 'Petitioner for Voluntary Rehabilitation'];
	status?: 'deleted' | 'archived';
}

interface Case {
	_id?: string;
	dateFiled: Date;
	dateResolved?: Date;
	status: 'ongoing' | 'resolved';
}