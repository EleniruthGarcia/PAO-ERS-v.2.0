import z from 'zod';

export const classification = [
	'Agrarian Case Client',
	'Beneficiary of Hernan Ruling (R.A. No. 10951)',
	'Child Client',
	'Child in Conflict with the Law',
	'Denied or Disqualified',
	'Drug-Related Duty',
	'Former Rebels (FRs) and Former Violent Extremists (FVEs)',
	'Law Enforcer',
	'OFW (Land-Based)',
	'OFW (Sea-Based)',
	'Petitioner for Voluntary Rehabilitation (Drugs)',
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

export const pwd = [
	'Intellectual',
	'Vision',
	'Hearing',
	'Speech',
	'Psychiatric or Mental Illness',
	'Acquired Disability'
] as const;

export const sex = ['Male', 'Female'] as const;

export const proofOfIndigency = [
	'Income Tax Return',
	'Certification from Barangay',
	'Certification from DSWD'
] as const;

export const civilStatus = ['Single', 'Married', 'Widowed'] as const;

export const educationalAttainment = [
	'No Formal Schooling',
	'Elementary Level',
	'Elementary Graduate',
	'High School Level',
	'High School Graduate',
	'College Level',
	'College Degree',
	"Bachelor's Degree",
	"With Master's Units",
	"Master's Degree",
	'With Doctoral Units',
	'Doctorate Degree'
] as const;

export const status = ['New', 'Updated', 'Archived', 'Restored'] as const;

export const formSchema = z.object({
	_id: z.string().min(1, 'ID is required!'),
	name: z.string().min(1, 'Name is required.'),
	firstName: z.string().min(1, 'First name is required.'),
	middleName: z.string().optional(),
	lastName: z.string().min(1, 'Last name is required.'),
	nameSuffix: z.string().optional(),
	// dateOfBirth: z.date({
	// 	invalid_type_error: 'Date of birth is required.',
	// 	required_error: 'Date of birth is required.'
	// }),
	age: z.number({
		invalid_type_error: 'Age is required.',
		required_error: 'Age is required.'
	}).positive({
		message: 'Age must be a positive number.'
	}),
	sex: z.enum(sex),
	address: z.string().min(1, 'Address is required.').max(40,'Maximum Characters must be less than 40.'),
	email: z.string().email().optional(),
	contactNumber: z
		.string()
		// .regex(/^(?=\s*$)|(09|\+639)\d{9}$/, 'Invalid contact number.')
		.refine((value) => value !== '', {
			message: 'Contact number is required.'
		}),
	civilStatus: z.enum(civilStatus),
	religion: z.string().optional(),
	citizenship: z.string().optional(),
	educationalAttainment: z.enum(educationalAttainment),
	language: z.string().optional(),
	individualMonthlyIncome: z.string().optional(),
	detained: z.boolean().default(false),
	detainedAt: z.string().optional(),
	detainedSince: z
		.date()
		.or(z.literal(''))
		.transform((e) => (e === '' ? undefined : e))
		.optional(),
	spouseName: z.string().optional(),
	spouseFirstName: z.string().optional(),
	spouseMiddleName: z.string().optional(),
	spouseLastName: z.string().optional(),
	spouseNameSuffix: z.string().optional(),
	spouseAddress: z.string().optional(),
	spouseEmail: z.string().email().optional(),
	spouseContactNumber: z
		.string()
		// .regex(/^(?=\s*$)|(09|\+639)\d{9}$/, 'Invalid contact number.')
		.optional(),
	classification: z.array(z.enum(classification)).optional(),
	foreignNational: z.string().optional(),
	pwd: z.enum(pwd, {
		errorMap: (e) => ({ message: 'Invalid PWD type.' })
	}).optional(),
	indigenousPeople: z.string().optional(),
	urbanPoor: z.string().optional(),
	ruralPoor: z.string().optional(),
	currentStatus: z.enum(status),
	status: z.array(
		z.object({
			type: z.enum(status),
			date: z.date()
		})
	),
	proofOfIndigency: z.array(z.enum(proofOfIndigency).or(z.object({ Others: z.string() }))),

});

export type FormSchema = typeof formSchema;
export type Client = z.infer<typeof formSchema>;
