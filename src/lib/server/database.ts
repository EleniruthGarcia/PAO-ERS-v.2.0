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

export const branches = db.collection<Branch>('branches');
export const logs = db.collection<Log>('logs');

export const requests = db.collection<Request>('requests');
export const clients = db.collection<Client>('clients');
export const cases = db.collection<Case>('cases');

export default { users, sessions, branches, clients, requests, cases, logs };

export interface Branch {
	_id: string;
	name: string;
	region: string;
	province: string;
	district: string;
	lawyers: string[];
}

export interface Log {
	_id: string;
	date: Date;
	client_id: string;
	serviceType: string;
}

export interface User {
	_id: string;
	branch_id: string;
	username: string;
	hashedPassword: string;
	role: 'Administrator' | 'Lawyer' | 'Staff';
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
	user_id: string;
	expires_at: Date;
}

export interface Request {
	_id?: string;
	client_id: string[];
	lawyer_id: string;
	interviewee_id?: string;
	case_id?: string;
	date: Date;
	natureOfRequest: string[];
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
	classification?: ['Child in Conflict with the Law' | 'Woman Client' | 'VAWC Victim' | 'Law Enforcer' | 'Drug-Related Duty' | 'OFW (Land-Based)' | 'OFW (Sea-Based)' | 'FRs and FVEs' | 'Senior Citizen' | 'Refugee or Evacuee' | 'Tenant in Agrarian Case' | 'Victim of Terrorism (R.A. No. 9372)' | 'Victim of Torture (R.A. 9745)' | 'Victim of Trafficking (R.A. No. 9208)' | 'Petitioner for Voluntary Rehabilitation'];
	foreignNational?: string;
	pwd?: string;
	indigenousPeople?: string;
	urbanPoor?: string;
	ruralPoor?: string;
	status?: 'deleted' | 'archived';
	proofOfIndigency?: string;
}

interface Case {
	_id?: string;
	dateFiled: Date;
	dateResolved?: Date;
	natureOfTheCase: string[];
	status: 'pending' | 'ongoing' | 'resolved';
	lawId: string[];
	clientInvolvement: string;
	adverseParty: string[];
	adverseParty_id: string[];
	factsOfTheCase: string;
	natureOfOffence: string;
	titleOfCase: string;
	docketNumber: string;
	courtBody: string;
}

const seedBranches = [
	{
		_id: '1',
		name: 'Branch A',
		region: 'Region 1',
		province: 'Province 1',
		district: 'District 1',
		lawyers: ['Lawyer A', 'Lawyer B']
	},
	{
		_id: '2',
		name: 'Branch B',
		region: 'Region 2',
		province: 'Province 2',
		district: 'District 2',
		lawyers: ['Lawyer C', 'Lawyer D']
	},
	{
		_id: '3',
		name: 'Branch C',
		region: 'Region 1',
		province: 'Province 3',
		district: 'District 3',
		lawyers: ['Lawyer E', 'Lawyer F']
	},
	{
		_id: '4',
		name: 'Branch D',
		region: 'Region 2',
		province: 'Province 4',
		district: 'District 4',
		lawyers: ['Lawyer G', 'Lawyer H']
	}
]

const seedUsers = [
	{
		_id: '1',
		branch_id: '1',
		username: 'admin1',
		hashedPassword: 'hashedPassword1',
		role: 'Administrator',
		title: 'Mr',
		firstName: 'John',
		middleName: 'Doe',
		lastName: 'Smith',
		nameSuffix: 'Jr',
		email: 'john.doe@example.com',
		contactNumber: 1234567890,
		address: '123 Main St, City, Country'
	},
	{
		_id: '2',
		branch_id: '1',
		username: 'lawyer1',
		hashedPassword: 'hashedPassword2',
		role: 'Lawyer',
		title: 'Ms',
		firstName: 'Jane',
		lastName: 'Doe',
		email: 'jane.doe@example.com',
		contactNumber: 9876543210,
		address: '456 Elm St, City, Country'
	},
	{
		_id: '3',
		branch_id: '2',
		username: 'staff1',
		hashedPassword: 'hashedPassword3',
		role: 'Staff',
		title: 'Dr',
		firstName: 'Emily',
		middleName: 'Anne',
		lastName: 'Brown',
		email: 'emily.brown@example.com',
		contactNumber: 1122334455,
		address: '789 Oak St, City, Country'
	},
	{
		_id: '4',
		branch_id: '2',
		username: 'lawyer2',
		hashedPassword: 'hashedPassword4',
		role: 'Lawyer',
		title: 'Mr',
		firstName: 'Michael',
		lastName: 'Johnson',
		email: 'michael.johnson@example.com',
		contactNumber: 5544332211,
		address: '101 Pine St, City, Country'
	}
]

const seedRequests = [{
	_id: '1',
	client_id: ['1', '2'],
	lawyer_id: '3',
	interviewee_id: '4',
	case_id: '5',
	date: new Date('2024-04-01T10:00:00Z'),
	natureOfRequest: ['Legal advice', 'Contract review'],
	type: 'request'
},
{
	_id: '2',
	client_id: ['2'],
	lawyer_id: '4',
	date: new Date('2024-04-02T11:00:00Z'),
	natureOfRequest: ['Complaint about service'],
	type: 'complaint'
},
{
	_id: '3',
	client_id: ['3'],
	lawyer_id: '5',
	case_id: '6',
	date: new Date('2024-04-03T12:00:00Z'),
	natureOfRequest: ['General inquiry'],
	type: 'inquiry'
},
{
	_id: '4',
	client_id: ['1', '3'],
	lawyer_id: '6',
	date: new Date('2024-04-04T13:00:00Z'),
	natureOfRequest: ['Other request'],
	type: 'other'
}]

const seedClients = [{
	_id: '1',
	name: 'John Doe',
	firstName: 'John',
	middleName: 'Michael',
	lastName: 'Doe',
	age: 30,
	sex: 'male',
	address: '123 Main St, City, Country',
	email: 'john.doe@example.com',
	contactNumber: '1234567890',
	civilStatus: 'single',
	religion: 'Christian',
	citizenship: 'American',
	educationalAttainment: 'Bachelor\'s Degree',
	language: 'English',
	individualMonthlyIncome: 5000,
	detained: false,
	spouseName: 'Jane Doe',
	spouseAddress: '456 Elm St, City, Country',
	spouseContactNumber: '0987654321',
	classification: ['Senior Citizen'],
	status: 'archived',
	proofOfIndigency: 'Proof123'
},
{
	_id: '2',
	name: 'Jane Smith',
	firstName: 'Jane',
	lastName: 'Smith',
	age: 25,
	sex: 'female',
	address: '456 Elm St, City, Country',
	civilStatus: 'married',
	citizenship: 'British',
	educationalAttainment: 'Master\'s Degree',
	language: 'English',
	detained: true,
	detainedAt: 'Detention Center',
	detainedSince: new Date('2024-01-01'),
	classification: ['Woman Client', 'Victim of Trafficking (R.A. No. 9208)'],
	foreignNational: 'Yes',
	pwd: 'Yes'
},
{
	_id: '3',
	name: 'Michael Johnson',
	firstName: 'Michael',
	lastName: 'Johnson',
	age: 40,
	sex: 'male',
	address: '789 Oak St, City, Country',
	email: 'michael.johnson@example.com',
	contactNumber: '1122334455',
	civilStatus: 'widowed',
	religion: 'Muslim',
	citizenship: 'Filipino',
	educationalAttainment: 'High School Graduate',
	language: 'Filipino',
	individualMonthlyIncome: 3000,
	detained: false,
	classification: ['OFW (Land-Based)'],
	foreignNational: 'Yes',
	urbanPoor: 'Yes'
},
{
	_id: '4',
	name: 'Emily Brown',
	firstName: 'Emily',
	middleName: 'Anne',
	lastName: 'Brown',
	age: 60,
	sex: 'female',
	address: '101 Pine St, City, Country',
	email: 'emily.brown@example.com',
	contactNumber: '5544332211',
	civilStatus: 'widowed',
	citizenship: 'Canadian',
	educationalAttainment: 'Doctorate Degree',
	language: 'English',
	individualMonthlyIncome: 8000,
	detained: false,
	classification: ['Senior Citizen', 'Refugee or Evacuee'],
	status: 'archived'
}]

const seedCases = [{
	_id: '1',
	dateFiled: new Date('2024-03-15T00:00:00Z'),
	dateResolved: undefined,
	natureOfTheCase: ['Civil', 'Property Dispute'],
	status: 'pending',
	lawId: ['1', '2'],
	clientInvolvement: 'Plaintiff',
	adverseParty: ['John Doe', 'Jane Doe'],
	adverseParty_id: ['3', '4'],
	factsOfTheCase: 'Property boundary dispute between neighbors',
	natureOfOffence: 'Property Trespass',
	titleOfCase: 'Smith vs Doe',
	docketNumber: '2024-123',
	courtBody: 'Regional Trial Court'
},
{
	_id: '2',
	dateFiled: new Date('2023-07-20T00:00:00Z'),
	dateResolved: new Date('2024-01-10T00:00:00Z'),
	natureOfTheCase: ['Criminal', 'Fraud'],
	status: 'resolved',
	lawId: ['5'],
	clientInvolvement: 'Defendant',
	adverseParty: ['Michael Johnson'],
	adverseParty_id: ['5'],
	factsOfTheCase: 'Accused of financial fraud',
	natureOfOffence: 'Financial Fraud',
	titleOfCase: 'People vs Johnson',
	docketNumber: '2023-456',
	courtBody: 'Municipal Trial Court'
},
{
	_id: '3',
	dateFiled: new Date('2024-01-05T00:00:00Z'),
	dateResolved: undefined,
	natureOfTheCase: ['Family', 'Divorce'],
	status: 'ongoing',
	lawId: ['6', '7'],
	clientInvolvement: 'Petitioner',
	adverseParty: ['Emily Brown'],
	adverseParty_id: ['6'],
	factsOfTheCase: 'Seeking divorce due to irreconcilable differences',
	natureOfOffence: 'Divorce Petition',
	titleOfCase: 'Brown vs Brown',
	docketNumber: '2024-789',
	courtBody: 'Family Court'
},
{
	_id: '4',
	dateFiled: new Date('2023-12-10T00:00:00Z'),
	dateResolved: new Date('2024-03-01T00:00:00Z'),
	natureOfTheCase: ['Labor', 'Wrongful Termination'],
	status: 'resolved',
	lawId: ['8'],
	clientInvolvement: 'Plaintiff',
	adverseParty: ['Jane Smith'],
	adverseParty_id: ['7'],
	factsOfTheCase: 'Unlawful termination from employment',
	natureOfOffence: 'Wrongful Termination',
	titleOfCase: 'Doe vs Company XYZ',
	docketNumber: '2023-101',
	courtBody: 'National Labor Relations Commission'
}]

for (const branch of seedBranches) branches.updateOne({ _id: branch._id }, { $set: branch }, { upsert: true })
for (const user of seedUsers) users.updateOne({ _id: user._id }, { $set: user }, { upsert: true });
for (const request of seedRequests) requests.updateOne({ _id: request._id }, { $set: request }, { upsert: true });
for (const client of seedClients) clients.updateOne({ _id: client._id }, { $set: client }, { upsert: true });
for (const caseData of seedCases) cases.updateOne({ _id: caseData._id }, { $set: caseData }, { upsert: true });
