import z from 'zod';

export const nature = [
	'Legal Advice',
	'Legal Documentation',
	'Representation in Court or Quasi-Judicial Bodies',
	'Inquest Legal Assistance',
	'Mediation or Conciliation',
	'Administration of Oath',
	'Others'
] as const;

export const relationshipToClient = [
	'Client',
	'Parent',
	'Sibling',
	'Spouse',
	'Child',
	'Other Relative',
	'Friend',
	'Neighbor',
	'Co-Worker',
	'Others'
] as const;

export const classification = [
	'Beneficiary of Hernan Ruling (R.A. No. 10951)',
	'Child Client',
	'Child in Conflict with the Law',
	'Drug-Related Duty',
	'FRs and FVEs',
	'Law Enforcer',
	'OFW (Land-Based)',
	'OFW (Sea-Based)',
	'Petitioner for Voluntary Rehabilitation',
	'Refugee or Evacuee',
	'Senior Citizen',
	'Special Legal Services (R.A. No. 9406 and MOAs)',
	'Tenant in Agrarian Case',
	'VAWC Victim',
	'Victim of Terrorism (R.A. No. 9372)',
	'Victim of Torture (R.A. No. 9745)',
	'Victim of Trafficking (R.A. No. 9208)',
	'Woman Client'
] as const;

export const sex = [
	'Male',
	'Female'
] as const;

export const civilStatus = [
	'Single',
	'Married',
	'Separated',
	'Widowed'
] as const;

export const educationalAttainment = [
	'No Formal Schooling',
	'Elementary Level',
	'Elementary Graduate',
	'High School Level',
	'High School Graduate',
	'College Level',
	'College Graduate',
	"With Master's Units",
	"Master's Graduate",
	'With Doctoral Units',
	'Doctorate Graduate'
] as const;

export const formSchema = z.object({
	_id: z.string(),
	date: z.date(),
	client_id: z.array(z.string()).min(1, 'Client is required!'),
	lawyer_id: z.string().min(1, 'Lawyer is required!'),
	interviwee_id: z.string().min(1, 'Interviewee is required!'),
	relationshipToClient: z.enum(relationshipToClient),
	nature: z.array(z.enum(nature)).min(1, 'Nature of Request is required!'),
});

export type FormSchema = typeof formSchema;
