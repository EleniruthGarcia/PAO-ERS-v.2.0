import z from 'zod';

export const classification = [
	'Agrarian Case Client',
	'Beneficiary of Hernan Ruling (R.A. No. 10951)',
	'Child Client',
	'Child in Conflict with the Law',
	'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)',
	'Denied or Disqualified',
	'Drug-Related Duty',
	'Former Rebels (FRs) and Former Violent Extremists (FVEs)',
	'OFW (Land-Based)',
	'OFW (Sea-Based)',
	'Petitioner for Voluntary Rehabilitation (Drugs)',
	'Rape Victim',
	'Refugee or Evacuee',
	'Senior Citizen',
	'Special Legal Services (R.A. No. 9406 and MOAs)',
	'Tenant in Agrarian Case',
	'VAWC Victim',
	'Victim of Terrorism (R.A. No. 9372)',
	'Victim of Torture (R.A. No. 9745)',
	'Victim of Trafficking (R.A. No. 9208)',
	'Woman Client',
	'Woman Client (Non-VAWC Victim)'
] as const;

export const pwd = [
	'Intellectual',
	'Vision',
	'Hearing',
	'Speech',
	'Psychiatric or Mental Illness',
	'Acquired Disability',
	'Others'
] as const;

export const sex = ['MALE', 'FEMALE'] as const;

export const religion = [
	'ROMAN CATHOLIC',
	'ISLAM',
	'IGLESIA NI CRISTO',
	'SEVENTH DAY ADVENTIST',
	'AGLIPAY',
	'IGLESIA FILIPINA',
	'BIBLE BAPTIST CHURCH',
	'UCC OF THE PHILIPPINES',
	'OTHER RELIGIOUS AFFILIATIONS',
	'NONE'
] as const;

export const languages = [
	
	'ENGLISH',
	'TAGALOG',
	'ILOCANO',
	'OTHERS',
	
] as const;

export const proofOfIndigency = [
	'INCOME TAX RETURN',
	'CERTIFICATION FROM BARANGAY',
	'CERTIFICATION FROM DSWD'
] as const;

export const citizenship = [
'FILIPINO', 'TAIWANESE', 'OTHERS'
] as const;

export const civilStatus = ['SINGLE', 'MARRIED', 'WIDOW/WIDOWER', 'LEGALLY SEPARATED'] as const;

export const educationalAttainment = [
	'NO FORMAL SCHOOLING',
	'ELEMENTARY LEVEL',
	'ELEMENTARY GRADUATE',
	'HIGH SCHOOL LEVEL',
	'HIGH SCHOOL GRADUATE',
	'COLLEGE LEVEL',
	'COLLEGE DEGREE',
	'VOCATIONAL/TECHNICAL',
	"WITH MASTER'S UNITS",
	"MASTER'S DEGREE",
	'WITH DOCTORAL UNITS',
	'DOCTORATE DEGREE'
] as const;

export const netMonthlyIncome = [
	"0 - 10,000",
	"10,001 - 20,000",
	"20,001 - 22,000",
	"22,001 - 50,000",
	"50,001 - 100,000",
	"100,001 AND ABOVE"
] as const;
export const suffix = ['JR.', 'SR.', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] as const;

export const status = ['New', 'Updated', 'Archived', 'Restored'] as const;

export const formSchema = z.object({
	_id: z.string().optional(),
	name: z.string().min(1, 'Name is required.'),
	firstName: z.string()
	.min(1, 'First name is required.')
	.transform((val) => val.toUpperCase()),

	middleName: z.string()
	.min(1, 'Middle name is required.')
	.transform((val) => val.toUpperCase()),


	lastName: z.string()
	.min(1, 'Last name is required.')
	.transform((val) => val.toUpperCase()),

	suffix: z.union([z.enum(suffix), z.literal('')])
  	.transform((val) => (val === '' ? undefined : val))
  	.optional(),
	// dateOfBirth: z.date({
	// 	invalid_type_error: 'Date of birth is required.',
	// 	required_error: 'Date of birth is required.'
	// }),
	 age: z.union([
    z.number().min(1, 'Invalid Input').max(115, 'Invalid input'),
    z.literal('')
	])
	.transform((e) => (e === '' ? undefined : e))
	.optional(),
	sex: z.enum(sex).optional(),
	address: z
		.string()
		.min(1, 'Address is required.')
		.max(40, 'Maximum Characters must be less than 40.'),
	email: z
		.union([
			z.literal(''),
			z.string().email('Please include "@" and ".com" in a valid email address.').optional()])
		.transform((e) => (e === '' ? undefined : e)),
	contactNumber: z.string(),
	civilStatus: z.enum(civilStatus),
	religion: z.enum(religion).optional(),
	citizenship: z.enum(citizenship),
	educationalAttainment: z.enum(educationalAttainment),
	language: z.array(z.enum(languages)).optional(),
	netMonthlyIncome: z.enum(netMonthlyIncome),
	detained: z.boolean().default(false),
	detainedAt: z.string().optional(),
	detainedSince: z
		.date()
		.or(z.literal(''))
		.transform((e) => (e === '' ? undefined : e))
		.optional(),
	detainedUntil: z
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
	spouseEmail: z
		.union([z.literal(''), z.string().email().optional()])
		.transform((e) => (e === '' ? undefined : e)),
	spouseContactNumber: z
		.string()
		// .regex(/^(?=\s*$)|(09|\+639)\d{9}$/, 'Invalid contact number.')
		.optional(),
	classification: z.array(z.enum(classification)).optional(),
	lawEnforcer: z.string().optional(),
	foreignNational: z.string().optional(),
	pwd: z
		.union([z.enum(pwd).optional(), z.string().optional()])
		.transform((e) => (e === '' ? undefined : e)),
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
	proofOfIndigency: z
		.union([z.enum(proofOfIndigency).optional(), z.string().optional()])
		.transform((e) => (e === '' ? undefined : e))
});

export type FormSchema = typeof formSchema;
export type Client = z.infer<typeof formSchema>;
