import { dev } from '$app/environment';
import { MongoClient, ServerApiVersion } from 'mongodb';

import type { User, Client, Service, Case } from '$lib/schema';

export const client = new MongoClient(
	process.env['DATABASE_URL'] ??
		'mongodb://admin:password@localhost:27017/pao?maxPoolSize=20&w=majority&authSource=admin',
	{
		serverApi: {
			version: ServerApiVersion.v1,
			strict: !dev
		}
	}
);

export const db = client.db();

export const logs = db.collection<Log>('logs');
export const branches = db.collection<Branch>('branches');

export const users = db.collection<User>('users');
export const sessions = db.collection<Session>('sessions');
export const counters = db.collection<Counter>('counters');

export const clients = db.collection<Client>('clients');
export const services = db.collection<Service>('services');
export const cases = db.collection<Case>('cases');
export const outreaches = db.collection<Outreach>('outreaches');

export default { users, sessions, counters, branches, clients, services, cases, logs, outreaches };

interface Counter {
	_id: string;
	branch_id: string;
	year: number;
	count: number;
}

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

export interface Session {
	_id: string;
	user_id: string;
	expires_at: Date;
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
		_id: 'car',
		name: 'Regional Office - CAR',
		region: 'Cordillera Administrative Region',
		province: 'Benguet',
		district: 'Baguio City'
	},
	{
		_id: 'baguio',
		name: 'Baguio City District Office',
		region: 'Cordillera Administrative Region',
		province: 'Benguet',
		district: 'Baguio City'
	}
	// {
	// 	_id: '1',
	// 	name: 'Branch A',
	// 	region: 'Region 1',
	// 	province: 'Province 1',
	// 	district: 'District 1'
	// },
	// {
	// 	_id: '2',
	// 	name: 'Branch B',
	// 	region: 'Region 2',
	// 	province: 'Province 2',
	// 	district: 'District 2'
	// },
	// {
	// 	_id: '3',
	// 	name: 'Branch C',
	// 	region: 'Region 1',
	// 	province: 'Province 3',
	// 	district: 'District 3'
	// },
	// {
	// 	_id: '4',
	// 	name: 'Branch D',
	// 	region: 'Region 2',
	// 	province: 'Province 4',
	// 	district: 'District 4'
	// }
];

const seedUsers: User[] = [
	{
		_id: 'hmfrancisco',
		branch_id: 'car',
		username: 'hmfrancisco',
		hashedPassword:
			'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4',
		role: 'Administrator',
		position: 'Regional Public Attorney',
		name: 'Henry M. Francisco',
		firstName: 'Henry',
		middleName: 'M.',
		lastName: 'Francisco',
		civilStatus: 'Married',
		dateOfBirth: new Date('1984-01-01'),
		sex: 'Male',
		contactNumber: '1234567890',
		address: '123 Main St, City, Country',
		currentStatus: 'New',
		status: [{ type: 'New', date: new Date() }],
		reportsTo: 'hmfrancisco'
	},
	{
		_id: 'rvramos',
		branch_id: 'car',
		username: 'rvramos',
		hashedPassword:
			'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4',
		role: 'Administrator',
		position: 'Administrative Officer',
		name: 'Rodel V. Ramos',
		firstName: 'Rodel',
		middleName: 'V.',
		lastName: 'Ramos',
		civilStatus: 'Married',
		dateOfBirth: new Date('1989-01-01'),
		sex: 'Male',
		contactNumber: '1234567890',
		address: '123 Main St, City, Country',
		currentStatus: 'New',
		status: [{ type: 'New', date: new Date() }],
		reportsTo: 'hmfrancisco'
	}
	// {
	// 	_id: 'ADMIN',
	// 	branch_id: '1',
	// 	username: 'admin',
	// 	hashedPassword:
	// 		'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4',
	// 	role: 'Administrator',
	// 	position: 'Administrative Officer III',
	// 	name: 'John Doe Smith Jr',
	// 	firstName: 'John',
	// 	middleName: 'Doe',
	// 	lastName: 'Smith',
	// 	nameSuffix: 'Jr',
	// 	civilStatus: 'Married',
	// 	dateOfBirth: new Date('1989-01-01'),
	// 	sex: 'Male',
	// 	email: 'john.doe@example.com',
	// 	contactNumber: '1234567890',
	// 	address: '123 Main St, City, Country',
	// 	currentStatus: 'New',
	// 	status: [{ type: 'New', date: new Date() }],
	// 	reportsTo: 'ADMIN'
	// },
	// {
	// 	_id: '1',
	// 	branch_id: '1',
	// 	username: 'admin1',
	// 	hashedPassword:
	// 		'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4',
	// 	role: 'Administrator',
	// 	position: 'Administrative Officer III',
	// 	name: 'John Doe Smith Jr',
	// 	firstName: 'John',
	// 	middleName: 'Doe',
	// 	lastName: 'Smith',
	// 	nameSuffix: 'Jr',
	// 	civilStatus: 'Married',
	// 	dateOfBirth: new Date('1989-01-01'),
	// 	sex: 'Male',
	// 	email: 'john.doe@example.com',
	// 	contactNumber: '1234567890',
	// 	address: '123 Main St, City, Country',
	// 	currentStatus: 'New',
	// 	status: [{ type: 'New', date: new Date() }],
	// 	reportsTo: 'ADMIN'
	// },
	// {
	// 	_id: '2',
	// 	branch_id: '1',
	// 	username: 'lawyer1',
	// 	hashedPassword:
	// 		'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4',
	// 	role: 'Lawyer',
	// 	position: 'Public Attorney I',
	// 	name: 'Jane Doe',
	// 	firstName: 'Jane',
	// 	lastName: 'Doe',
	// 	email: 'jane.doe@example.com',
	// 	contactNumber: '9876543210',
	// 	civilStatus: 'Single',
	// 	dateOfBirth: new Date('1994-01-01'),
	// 	sex: 'Female',
	// 	address: '456 Elm St, City, Country',
	// 	currentStatus: 'New',
	// 	status: [{ type: 'New', date: new Date() }],
	// 	reportsTo: 'admin1'
	// },
	// {
	// 	_id: '3',
	// 	branch_id: '2',
	// 	username: 'staff1',
	// 	hashedPassword:
	// 		'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4',
	// 	role: 'Staff',
	// 	position: 'Administrative Officer I',
	// 	name: 'Emily Anne Brown',
	// 	firstName: 'Emily',
	// 	middleName: 'Anne',
	// 	lastName: 'Brown',
	// 	civilStatus: 'Widowed',
	// 	dateOfBirth: new Date('1964-01-01'),
	// 	sex: 'Female',
	// 	email: 'emily.brown@example.com',
	// 	contactNumber: '1122334455',
	// 	address: '789 Oak St, City, Country',
	// 	currentStatus: 'New',
	// 	status: [{ type: 'New', date: new Date() }],
	// 	reportsTo: 'ADMIN'
	// },
	// {
	// 	_id: '4',
	// 	branch_id: '2',
	// 	username: 'lawyer2',
	// 	hashedPassword:
	// 		'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4',
	// 	role: 'Lawyer',
	// 	position: 'Public Attorney IV',
	// 	name: 'Michael Johnson',
	// 	firstName: 'Michael',
	// 	lastName: 'Johnson',
	// 	email: 'michael.johnson@example.com',
	// 	contactNumber: '5544332211',
	// 	civilStatus: 'Widowed',
	// 	dateOfBirth: new Date('1984-01-01'),
	// 	sex: 'Male',
	// 	address: '101 Pine St, City, Country',
	// 	currentStatus: 'New',
	// 	status: [{ type: 'New', date: new Date() }],
	// 	reportsTo: 'admin1'
	// }
];

const seedServices: Service[] = [
	{
		_id: '1',
		client_id: ['1', '2'],
		lawyer_id: '3',
		interviewee_id: '4',
		relationshipToClient: 'Spouse',
		case_id: ['1'],
		nature: ['Legal Advice'],
		currentStatus: 'New',
		status: [{ type: 'New', date: new Date() }]
	},
	{
		_id: '2',
		client_id: ['2', '1'],
		lawyer_id: '4',
		case_id: ['2'],
		interviewee_id: '2',
		relationshipToClient: 'Client',
		nature: ['Representation in Court or Quasi-Judicial Bodies'],
		currentStatus: 'Pending',
		status: [{ type: 'Pending', date: new Date() }]
	},
	{
		_id: '3',
		client_id: ['3'],
		lawyer_id: '2',
		case_id: ['3'],
		interviewee_id: '3',
		relationshipToClient: 'Child',
		nature: ['Legal Documentation'],
		currentStatus: 'Pending',
		status: [{ type: 'Pending', date: new Date() }]
	},
	{
		_id: '4',
		client_id: ['1', '3'],
		lawyer_id: '4',
		case_id: ['4'],
		interviewee_id: '1',
		relationshipToClient: 'Parent',
		nature: ['Inquest Legal Assistance'],
		currentStatus: 'Resolved',
		status: [{ type: 'Resolved', date: new Date() }]
	}
];

const seedClients: Client[] = [
	{
		_id: '1',
		name: 'John Doe',
		firstName: 'John',
		middleName: 'Michael',
		lastName: 'Doe',
		dateOfBirth: new Date('1994-01-01'),
		sex: 'Male',
		address: '123 Main St, City, Country',
		email: 'john.doe@example.com',
		contactNumber: '1234567890',
		civilStatus: 'Single',
		religion: 'Christian',
		citizenship: 'American',
		educationalAttainment: "Bachelor's Degree",
		language: 'English',
		individualMonthlyIncome: 5000,
		detained: false,
		spouseName: 'Jane Doe',
		spouseAddress: '456 Elm St, City, Country',
		spouseContactNumber: '0987654321',
		classification: ['Senior Citizen'],
		proofOfIndigency: ['Income Tax Return', 'Certification from Barangay'],
		currentStatus: 'New',
		status: [{ type: 'New', date: new Date() }]
	},
	{
		_id: '2',
		name: 'Jane Smith',
		firstName: 'Jane',
		lastName: 'Smith',
		dateOfBirth: new Date('1999-01-01'),
		sex: 'Female',
		address: '456 Elm St, City, Country',
		civilStatus: 'Married',
		citizenship: 'British',
		contactNumber: '3254353234',
		educationalAttainment: "Master's Degree",
		language: 'English',
		detained: true,
		detainedAt: 'Detention Center',
		detainedSince: new Date('2024-01-01'),
		classification: ['Woman Client', 'Victim of Trafficking (R.A. No. 9208)'],
		foreignNational: 'Yes',
		pwd: 'Yes',
		proofOfIndigency: [{ Others: 'Student' }],
		currentStatus: 'New',
		status: [{ type: 'New', date: new Date() }]
	},
	{
		_id: '3',
		name: 'Michael Johnson',
		firstName: 'Michael',
		lastName: 'Johnson',
		dateOfBirth: new Date('1984-01-01'),
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
		status: [{ type: 'New', date: new Date() }],
		currentStatus: 'New',
		proofOfIndigency: []
	},
	{
		_id: '4',
		name: 'Emily Brown',
		firstName: 'Emily',
		middleName: 'Anne',
		lastName: 'Brown',
		dateOfBirth: new Date('1964-01-01'),
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
		currentStatus: 'Updated',
		status: [{ type: 'Updated', date: new Date() }],
		proofOfIndigency: []
	}
];

const seedCases: Case[] = [
	{
		_id: '1',
		controlNo: '1',
		natureOfTheCase: 'Civil',
		caseSpecs: 'Property boundary dispute between neighbors',
		clientInvolvement: ['Plaintiff'],
		adversePartyInvolvement: ['Defendant, Respondent, or Accused'],
		adversePartyName: 'Jane Smith',
		adversePartyAddress: '456 Elm St, City, Country',
		factsOfTheCase: 'Property boundary dispute between neighbors',
		pendingInCourt: true,
		titleOfTheCase: 'Smith vs Doe',
		docketNumber: '2024-123',
		court: 'Regional Trial Court',
		currentStatus: 'Pending',
		status: [{ type: 'Pending', date: new Date() }]
	},
	{
		_id: '2',
		controlNo: '2',
		natureOfTheCase: 'Criminal',
		caseSpecs: 'Accused of financial fraud',
		clientInvolvement: ['Defendant'],
		adversePartyInvolvement: ['Plaintiff or Complainant'],
		adversePartyName: 'Michael Johnson',
		adversePartyAddress: '789 Oak St, City, Country',
		factsOfTheCase: 'Accused of financial fraud',
		pendingInCourt: true,
		titleOfTheCase: 'People vs Johnson',
		docketNumber: '2023-456',
		court: 'Municipal Trial Court',
		currentStatus: 'Terminated',
		status: [{ type: 'Terminated', date: new Date() }]
	},
	{
		_id: '3',
		controlNo: '3',
		natureOfTheCase: 'Family',
		caseSpecs: 'Divorce Petition',
		clientInvolvement: ['Petitioner'],
		adversePartyInvolvement: ['Defendant, Respondent, or Accused'],
		adversePartyName: 'John Doe',
		adversePartyAddress: '123 Main St, City, Country',
		factsOfTheCase: 'Seeking divorce due to irreconcilable differences',
		pendingInCourt: true,
		titleOfTheCase: 'Brown vs Brown',
		docketNumber: '2024-789',
		court: 'Family Court',
		currentStatus: 'Pending',
		status: [{ type: 'Pending', date: new Date() }]
	},
	{
		_id: '4',
		controlNo: '4',
		natureOfTheCase: 'Criminal',
		caseSpecs: 'Accused of financial fraud',
		clientInvolvement: ['Defendant'],
		adversePartyInvolvement: ['Plaintiff or Complainant'],
		adversePartyName: 'Michael Johnson',
		adversePartyAddress: '789 Oak St, City, Country',
		factsOfTheCase: 'Accused of financial fraud',
		pendingInCourt: true,
		titleOfTheCase: 'People vs Johnson',
		docketNumber: '2023-456',
		court: 'Municipal Trial Court',
		currentStatus: 'Terminated',
		status: [{ type: 'Terminated', date: new Date() }]
	}
];

// for (const branch of seedBranches)
// 	branches.updateOne({ _id: branch._id }, { $set: branch }, { upsert: true });
// for (const user of seedUsers) users.updateOne({ _id: user._id }, { $set: user }, { upsert: true });
// for (const service of seedServices)
// 	services.updateOne({ _id: service._id }, { $set: service }, { upsert: true });
// for (const client of seedClients)
// 	clients.updateOne({ _id: client._id }, { $set: client }, { upsert: true });
// for (const caseData of seedCases)
// 	cases.updateOne({ _id: caseData._id }, { $set: caseData }, { upsert: true });
