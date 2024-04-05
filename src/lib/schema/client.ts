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
	'Foreign National',
	'Urban Poor',
	'Rural Poor',
	'Indigenous People',
	'PWD',
	'Petitioner for Voluntary Rehabilitation'
] as const;

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
	firstName: z.string().min(1, 'First name is required!').max(50),
	middleName: z.string().max(50).optional(),
	lastName: z.string().min(1, 'Last name is required!').max(50),
	nameSuffix: z.string().optional(),
	dateOfBirth: z.date(),
	age: z.number().int().min(1, 'Age is required!').max(120),
	sex: z.enum(['male', 'female']),
	address: z.string().max(100),
	email: z.string().email().optional(),
	contactNumber: z
		.string()
		.regex(/^(?=\s*$)|(09|\+639)\d{9}$/, 'Invalid contact number!')
		.refine((value) => value !== '', { message: 'Contact number is required!' }),
	civilStatus: z.enum(['single', 'married', 'widowed', 'separated']),
	religion: z.string().max(50).optional(),
	citizenship: z.string().max(50),
	educationalAttainment: z.enum(
		Object.keys(educationalAttainment) as [EducationalAttainment, ...EducationalAttainment[]]
	),
	language: z.string().max(50),
	individualMonthlyIncome: z.number().optional(),
	detained: z.boolean(),
	detainedAt: z.string().max(100).optional(),
	detainedSince: z
		.date()
		.or(z.literal(''))
		.transform((e) => (e === '' ? undefined : e))
		.optional(),
	spouseName: z.string().max(100).optional(),
	spouseFirstName: z.string().max(50).optional(),
	spouseMiddleName: z.string().max(50).optional(),
	spouseLastName: z.string().max(50).optional(),
	spouseNameSuffix: z.string().max(50).optional(),
	spouseAddress: z.string().max(100).optional(),
	spouseEmail: z.string().email().optional(),
	spouseContactNumber: z.string().regex(/^(?=\s*$)|(09|\+639)\d{9}$/, 'Invalid contact number!'),
	classification: z.array(z.enum(classification)).optional()
});

export type FormSchema = typeof formSchema;
