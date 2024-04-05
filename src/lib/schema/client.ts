import z from 'zod';

export const classification = [
	{ id: 'childInConflictWithTheLaw', label: 'Child in Conflict with the Law' },
	{ id: 'womanClient', label: 'Woman Client' },
	{ id: 'vawcVictim', label: 'VAWC Victim' },
	{ id: 'lawEnforcer', label: 'Law Enforcer' },
	{ id: 'drugRelatedDuty', label: 'Drug-Related Duty' },
	{ id: 'ofwLandBased', label: 'OFW (Land-Based)' },
	{ id: 'ofwSeaBased', label: 'OFW (Sea-Based)' },
	{ id: 'frs', label: 'FRs and FVEs' },
	{ id: 'seniorCitizen', label: 'Senior Citizen' },
	{ id: 'refugeeOrEvacuee', label: 'Refugee or Evacuee' },
	{ id: 'tenantInAgrarianCase', label: 'Tenant in Agrarian Case' },
	{ id: 'victimOfTerrorism', label: 'Victim of Terrorism (R.A. No. 9372)' },
	{ id: 'victimOfTorture', label: 'Victim of Torture (R.A. 9745)' },
	{ id: 'victimOfTrafficking', label: 'Victim of Trafficking (R.A. No. 9208)' },
	{ id: 'foreignNational', label: 'Foreign National' },
	{ id: 'urbanPoor', label: 'Urban Poor' },
	{ id: 'ruralPoor', label: 'Rural Poor' },
	{ id: 'indigenousPeople', label: 'Indigenous People' },
	{ id: 'pwd', label: 'PWD' },
	{ id: 'petitionerForVoluntaryRehabilitation', label: 'Petitioner for Voluntary Rehabilitation' }
];

export const educationalAttainment = [
	{ label: 'No Formal Schooling', value: 'noFormalSchooling' },
	{ label: 'Elementary Level', value: 'elementaryLevel' },
	{ label: 'Elementary Graduate', value: 'elementaryGraduate' },
	{ label: 'High School Level', value: 'highSchoolLevel' },
	{ label: 'High School Graduate', value: 'highSchoolGraduate' },
	{ label: 'College Level', value: 'collegeLevel' },
	{ label: 'College Graduate', value: 'collegeGraduate' },
	{ label: 'With Master\'s Units', value: 'withMastersUnits' },
	{ label: 'Master\'s Graduate', value: 'mastersGraduate' },
	{ label: 'With Doctoral Units', value: 'withDoctoralUnits' },
	{ label: 'Doctorate Graduate', value: 'doctorateGraduate' }
];

export const formSchema = z.object({
	_id: z.string().optional(),
	firstName: z.string().min(1).max(50),
	middleName: z.string().max(50).optional(),
	lastName: z.string().min(1).max(50),
	nameSuffix: z.string().optional(),
	age: z.number().positive(),
	sex: z.enum(['male', 'female']),
	address: z.string().max(100),
	email: z.string().email().optional(),
	contactNumber: z.string().regex(/^(09|\+639)\d{9}$/, 'Invalid contact number!'),
	civilStatus: z.enum(['single', 'married', 'widowed', 'separated']),
	religion: z.string().max(50).optional(),
	citizenship: z.string().max(50),
	educationalAttainment: z.string().refine((string) => educationalAttainment.map(
		({ value }) => value
	).includes(string), {
		message: 'Invalid educational attainment!'
	}),
	language: z.string().max(50),
	individualMonthlyIncome: z.number().optional(),
	detained: z.boolean(),
	detainedAt: z.string().max(100).optional(),
	detainedSince: z.date().optional(),
	spouseName: z.string().max(100).optional(),
	spouseFirstName: z.string().max(50).optional(),
	spouseMiddleName: z.string().max(50).optional(),
	spouseLastName: z.string().max(50).optional(),
	spouseNameSuffix: z.string().max(50).optional(),
	spouseAddress: z.string().max(100).optional(),
	spouseEmail: z.string().email().optional(),
	spouseContactNumber: z.string().regex(/^(09|\+639)\d{9}$/, 'Invalid contact number!').optional(),
	classification: z.array(z.string().refine((string) => Object.keys(classification.map(
		({ id }) => id
	)).includes(string), {
		message: 'Invalid classification!'
	})),
});

export type FormSchema = typeof formSchema;
