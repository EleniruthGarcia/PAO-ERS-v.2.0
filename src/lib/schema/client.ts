import z from 'zod';

export const classification = [
	'Child in Conflict with the Law',
	'Woman Client',
	'VAWC Victim',
	'Law Enforcer',
	'Drug-Related Duty',
	'OFW (Land-Based)',
	'OFW (Sea-Based)',
	'FRs and FVEs',
	'Senior Citizen',
	'Refugee or Evacuee',
	'Tenant in Agrarian Case',
	'Victim of Terrorism (R.A. No. 9372)',
	'Victim of Torture (R.A. 9745)',
	'Victim of Trafficking (R.A. No. 9208)',
	'Petitioner for Voluntary Rehabilitation'
] as const;

export const sex = {
	'': '',
	male: 'Male',
	female: 'Female'
} as const;
type Sex = keyof typeof sex;

export const civilStatus = {
	'': '',
	single: 'Single',
	married: 'Married',
	separated: 'Separated',
	widowed: 'Widowed',
} as const;
type CivilStatus = keyof typeof civilStatus;

export const educationalAttainment = {
	'': '',
	noFormalSchooling: 'No Formal Schooling',
	elementaryLevel: 'Elementary Level',
	elementaryGraduate: 'Elementary Graduate',
	highSchoolLevel: 'High School Level',
	highSchoolGraduate: 'High School Graduate',
	collegeLevel: 'College Level',
	collegeGraduate: 'College Graduate',
	withMastersUnits: "With Master's Units",
	mastersGraduate: "Master's Graduate",
	withDoctoralUnits: 'With Doctoral Units',
	doctorateGraduate: 'Doctorate Graduate'
} as const;
type EducationalAttainment = keyof typeof educationalAttainment;

export const formSchema = z.object({
	_id: z.string().optional(),
	name: z.string().min(1, 'Name is required!'),
	firstName: z.string().min(1, 'First name is required!'),
	middleName: z.string().optional(),
	lastName: z.string().min(1, 'Last name is required!'),
	nameSuffix: z.string().optional(),
	dateOfBirth: z.date().optional(),
	age: z.number({
		invalid_type_error: 'Age is required!',
	}).positive().min(1, 'Age is required!'),
	sex: z.enum(Object.keys(sex) as [Sex, ...Sex[]]),
	address: z.string().min(1, 'Address is required!'),
	email: z.string().email().optional(),
	contactNumber: z
		.string()
		.regex(/^(?=\s*$)|(09|\+639)\d{9}$/, 'Invalid contact number!')
		.refine((value) => value !== '', { message: 'Contact number is required!' }),
	civilStatus: z.enum(Object.keys(civilStatus) as [CivilStatus, ...CivilStatus[]]),
	religion: z.string().optional(),
	citizenship: z.string(),
	educationalAttainment: z.enum(
		Object.keys(educationalAttainment) as [EducationalAttainment, ...EducationalAttainment[]]
	),
	language: z.string(),
	individualMonthlyIncome: z.number().optional(),
	detained: z.boolean(),
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
	spouseContactNumber: z.string().regex(/^(?=\s*$)|(09|\+639)\d{9}$/, 'Invalid contact number!'),
	classification: z.array(z.enum(classification)).optional(),
	foreignNational: z.string().optional(),
	pwd: z.string().optional(),
	indigenousPeople: z.string().optional(),
	urbanPoor: z.string().optional(),
	ruralPoor: z.string().optional(),
});

export type FormSchema = typeof formSchema;
