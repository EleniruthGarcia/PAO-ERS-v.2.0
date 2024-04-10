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

export const logs = db.collection<Log>('logs');
export const branches = db.collection<Branch>('branches');

export const users = db.collection<User>('users');
export const sessions = db.collection<Session>('sessions');

export const clients = db.collection<Client>('clients');
export const requests = db.collection<Request>('requests');
export const cases = db.collection<Case>('cases');
export const outreaches = db.collection<Outreach>('outreaches');

export default { users, sessions, branches, clients, requests, cases, logs, outreaches };

export interface Branch {
	_id: string;
	name: string;
	region: string;
	province: string;
	district: string;
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
	name: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	nameSuffix?: string;
	email: string;
	contactNumber: number;
	address: string;
	status: { type: 'New' | 'Updated' | 'Archived' | 'Restored', date: Date }[];
}

export interface Session {
	_id: string;
	user_id: string;
	expires_at: Date;
}

export interface Request {
	_id?: string;
	districtProvince: ('Abra' | 'Apayao' | 'Benguet' | 'Ifugao' | 'Kalinga' | 'Mountain Province')[];
	client_id: string[];
	lawyer_id: string;
	interviewee_id: string;
	relationshipToClient: string;
	case_id?: string;
	date: Date;
	natureOfRequest: ('Legal Advice' | 'Legal Documentation' | 'Representation in Court or Quasi-Judicial Bodies' | 'Inquest Legal Assistance' | 'Mediation or Conciliation' | 'Administration of Oath' | 'Others')[];
	status: { type: 'New' | 'Pending' | 'Ongoing' | 'Resolved' | 'Passed', date: Date, from?: string, to?: string }[];
}

export interface Client {
	_id?: string;
	name: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	nameSuffix?: string;
	age: number;
	sex: 'Male' | 'Female';
	address: string;
	email?: string;
	contactNumber?: string;
	civilStatus: 'Single' | 'Married' | 'Widowed' | 'Separated';
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
	classification?: ('Beneficiary of Hernan Ruling (R.A. No. 10951)' | 'Child Client' | 'Child in Conflict with the Law' | 'Woman Client' | 'VAWC Victim' | 'Law Enforcer' | 'Drug-Related Duty' | 'OFW (Land-Based)' | 'OFW (Sea-Based)' | 'FRs and FVEs' | 'Senior Citizen' | 'Refugee or Evacuee' | 'Tenant in Agrarian Case' | 'Victim of Terrorism (R.A. No. 9372)' | 'Victim of Torture (R.A. 9745)' | 'Victim of Trafficking (R.A. No. 9208)' | 'Petitioner for Voluntary Rehabilitation' | 'Special Legal Services (R.A. No. 9406 and MOAs)')[];
	foreignNational?: string;
	pwd?: string;
	indigenousPeople?: string;
	urbanPoor?: string;
	ruralPoor?: string;
	proofOfIndigency?: ('Income Tax Return' | 'Certification from Barangay' | 'Certification from DSWD' | { 'Others': string })[];
	status: { type: 'New' | 'Updated' | 'Archived' | 'Restored', date: Date }[];
}

interface Case {
	_id?: string;
	dateFiled: Date;
	dateResolved?: Date;
	natureOfTheCase: string[];
	status: { type: 'Pending' | 'Ongoing' | 'Resolved', date: Date }[];
	lawId: string[];
	clientInvolvement: string[];
	adversePartyInvolvement: string[];
	adversePartyName: string[];
	adversePartyAddress: string[];
	factsOfTheCase: string;
	natureOfOffence: string;
	titleOfCase: string;
	docketNumber: string;
	courtBody: string;
}

export interface Outreach {
	_id?: string;
	lawyer_id: string;
	title: string;
	date: Date;
	venue: string;
	problemsPresented: string;
	activitiesUndertaken: string;
	attendees: {
		name: string;
		sex: 'M' | 'F';
		remarks: string;
	}[];
}

const seedBranches: Branch[] = [
	{
		_id: '1',
		name: 'Branch A',
		region: 'Region 1',
		province: 'Province 1',
		district: 'District 1',
	},
	{
		_id: '2',
		name: 'Branch B',
		region: 'Region 2',
		province: 'Province 2',
		district: 'District 2',
	},
	{
		_id: '3',
		name: 'Branch C',
		region: 'Region 1',
		province: 'Province 3',
		district: 'District 3',
	},
	{
		_id: '4',
		name: 'Branch D',
		region: 'Region 2',
		province: 'Province 4',
		district: 'District 4',
	}
]

const seedUsers: User[] = [
	{
		_id: '1',
		branch_id: '1',
		username: 'admin1',
		hashedPassword: 'hashedPassword1',
		role: 'Administrator',
		title: 'Mr',
		name: 'John Doe Smith Jr',
		firstName: 'John',
		middleName: 'Doe',
		lastName: 'Smith',
		nameSuffix: 'Jr',
		email: 'john.doe@example.com',
		contactNumber: 1234567890,
		address: '123 Main St, City, Country',
		status: [{ type: 'New', date: new Date() }]
	},
	{
		_id: '2',
		branch_id: '1',
		username: 'lawyer1',
		hashedPassword: 'hashedPassword2',
		role: 'Lawyer',
		title: 'Ms',
		name: 'Jane Doe',
		firstName: 'Jane',
		lastName: 'Doe',
		email: 'jane.doe@example.com',
		contactNumber: 9876543210,
		address: '456 Elm St, City, Country',
		status: [{ type: 'New', date: new Date() }]
	},
	{
		_id: '3',
		branch_id: '2',
		username: 'staff1',
		hashedPassword: 'hashedPassword3',
		role: 'Staff',
		title: 'Dr',
		name: 'Emily Anne Brown',
		firstName: 'Emily',
		middleName: 'Anne',
		lastName: 'Brown',
		email: 'emily.brown@example.com',
		contactNumber: 1122334455,
		address: '789 Oak St, City, Country',
		status: [{ type: 'New', date: new Date() }]
	},
	{
		_id: '4',
		branch_id: '2',
		username: 'lawyer2',
		hashedPassword: 'hashedPassword4',
		role: 'Lawyer',
		title: 'Mr',
		name: 'Michael Johnson',
		firstName: 'Michael',
		lastName: 'Johnson',
		email: 'michael.johnson@example.com',
		contactNumber: 5544332211,
		address: '101 Pine St, City, Country',
		status: [{ type: 'New', date: new Date() }]
	}
]

const seedRequests: Request[] = [{
	_id: '1',
	client_id: ['1', '2'],
	lawyer_id: '3',
	interviewee_id: '4',
	relationshipToClient: 'Spouse',
	case_id: '1',
	date: new Date('2024-04-01T10:00:00Z'),
	natureOfRequest: ['Legal Advice'],
	status: [{ type: 'New', date: new Date() }]
},
{
	_id: '2',
	client_id: ['2', '1'],
	lawyer_id: '4',
	case_id: '2',
	interviewee_id: '2',
	relationshipToClient: 'Self',
	date: new Date('2024-04-02T11:00:00Z'),
	natureOfRequest: ['Representation in Court or Quasi-Judicial Bodies'],
	status: [{ type: 'Pending', date: new Date() }]
},
{
	_id: '3',
	client_id: ['3'],
	lawyer_id: '2',
	case_id: '3',
	interviewee_id: '3',
	relationshipToClient: 'Child',
	date: new Date('2024-04-03T12:00:00Z'),
	natureOfRequest: ['Legal Documentation'],
	status: [{ type: 'Ongoing', date: new Date() }]
},
{
	_id: '4',
	client_id: ['1', '3'],
	lawyer_id: '4',
	interviewee_id: '1',
	relationshipToClient: 'Parent',
	date: new Date('2024-04-04T13:00:00Z'),
	natureOfRequest: ['Inquest Legal Assistance'],
	status: [{ type: 'Resolved', date: new Date() }]
}]

const seedClients: Client[] = [{
	_id: '1',
	name: 'John Doe',
	firstName: 'John',
	middleName: 'Michael',
	lastName: 'Doe',
	age: 30,
	sex: 'Male',
	address: '123 Main St, City, Country',
	email: 'john.doe@example.com',
	contactNumber: '1234567890',
	civilStatus: 'Single',
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
	proofOfIndigency: ['Income Tax Return', 'Certification from Barangay'],
	status: [{ type: 'New', date: new Date() }]
},
{
	_id: '2',
	name: 'Jane Smith',
	firstName: 'Jane',
	lastName: 'Smith',
	age: 25,
	sex: 'Female',
	address: '456 Elm St, City, Country',
	civilStatus: 'Married',
	citizenship: 'British',
	educationalAttainment: 'Master\'s Degree',
	language: 'English',
	detained: true,
	detainedAt: 'Detention Center',
	detainedSince: new Date('2024-01-01'),
	classification: ['Woman Client', 'Victim of Trafficking (R.A. No. 9208)'],
	foreignNational: 'Yes',
	pwd: 'Yes',
	proofOfIndigency: [{ 'Others': 'Student' }],
	status: [{ type: 'New', date: new Date() }]
},
{
	_id: '3',
	name: 'Michael Johnson',
	firstName: 'Michael',
	lastName: 'Johnson',
	age: 40,
	sex: 'Male',
	address: '789 Oak St, City, Country',
	email: 'michael.johnson@example.com',
	contactNumber: '1122334455',
	civilStatus: 'Widowed',
	religion: 'Muslim',
	citizenship: 'Filipino',
	educationalAttainment: 'High School Graduate',
	language: 'Filipino',
	individualMonthlyIncome: 3000,
	detained: false,
	classification: ['OFW (Land-Based)'],
	foreignNational: 'Yes',
	urbanPoor: 'Yes',
	status: [{ type: 'New', date: new Date() }]
},
{
	_id: '4',
	name: 'Emily Brown',
	firstName: 'Emily',
	middleName: 'Anne',
	lastName: 'Brown',
	age: 60,
	sex: 'Female',
	address: '101 Pine St, City, Country',
	email: 'emily.brown@example.com',
	contactNumber: '5544332211',
	civilStatus: 'Widowed',
	citizenship: 'Canadian',
	educationalAttainment: 'Doctorate Degree',
	language: 'English',
	individualMonthlyIncome: 8000,
	detained: false,
	classification: ['Senior Citizen', 'Refugee or Evacuee'],
	status: [{ type: 'New', date: new Date() }]
}]

const seedCases: Case[] = [{
	_id: '1',
	dateFiled: new Date('2024-03-15T00:00:00Z'),
	dateResolved: undefined,
	natureOfTheCase: ['Civil', 'Property Dispute'],
	status: [{ type: 'Ongoing', date: new Date() }],
	lawId: ['1', '2'],
	clientInvolvement: ['Plaintiff'],
	adversePartyInvolvement: ['Defendant'],
	adversePartyName: ['Jane Smith'],
	adversePartyAddress: ['456 Elm St, City, Country'],
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
	status: [{ type: 'Resolved', date: new Date() }],
	lawId: ['5'],
	clientInvolvement: ['Defendant'],
	adversePartyInvolvement: ['Plaintiff'
	],
	adversePartyName: ['Michael Johnson'],
	adversePartyAddress: ['789 Oak St, City, Country'],
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
	status: [{ type: 'Ongoing', date: new Date() }],
	lawId: ['6', '7'],
	clientInvolvement: ['Petitioner'],
	adversePartyInvolvement: ['Respondent'],
	adversePartyName: ['John Doe'],
	adversePartyAddress: ['123 Main St, City, Country'],
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
	status: [{ type: 'Resolved', date: new Date() }],
	lawId: ['8'],
	clientInvolvement: ['Plaintiff'],
	adversePartyInvolvement: ['Defendant'],
	adversePartyName: ['Company XYZ'],
	adversePartyAddress: ['101 Pine St, City, Country'],
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