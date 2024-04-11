import z from 'zod';

export const natureOfTheCase = [
	''
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

export const proofOfIndigency = [
	'Income Tax Return',
	'Certification from Barangay',
	'Certification from DSWD'
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
	'College Degree',
	'Bachelor\'s Degree',
	"With Master's Units",
	"Master's Degree",
	'With Doctoral Units',
	'Doctorate Degree'
] as const;

export const status = [
	'New',
	'Pending',
	'Updated',
	'Ongoing',
	'Resolved',
	'Archived',
	'Restored'
] as const;

export const formSchema = z.object({
	_id: z.string().optional(),
	dateFiled: z.date(),
	dateResolved: z.date().optional(),
	natureOfTheCase: z.array(z.string()),
	lawId: z.array(z.string()),
	clientInvolvement: z.array(z.string()),
	adversePartyInvolvement: z.array(z.string()),
	adversePartyName: z.array(z.string()),
	adversePartyAddress: z.array(z.string()),
	factsOfTheCase: z.string().optional(),
	natureOfOffence: z.string().optional(),
	titleOfCase: z.string().optional(),
	docketNumber: z.string().optional(),
	courtBody: z.string(),
	status: z.array(z.object({
		type: z.enum(status),
		date: z.date().optional(),
	})),
});

export type FormSchema = typeof formSchema;
export type Case = z.infer<typeof formSchema>;