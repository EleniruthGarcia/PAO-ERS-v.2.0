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
] as const;

export const formSchema = z.object({
	_id: z.string().optional(),
	firstName: z.string().min(1).max(50),
	middleName: z.string().min(1).max(50).optional(),
	lastName: z.string().min(1).max(50),
	nameSuffix: z.string().min(1).max(50).optional(),
	age: z.number().int(),
	sex: z.enum(['male', 'female']),
	address: z.string().min(1).max(100),
	email: z.string().email().optional(),
	contactNumber: z.string().regex(/^(09|\+639)\d{9}$/),
	civilStatus: z.enum(['single', 'married', 'widowed', 'separated']),
	religion: z.string().min(1).max(50).optional(),
	citizenship: z.string().min(1).max(50),
	educationalAttainment: z.string().min(1).max(50),
	language: z.string().min(1).max(50),
	individualMonthlyIncome: z.number().optional(),
	detained: z.boolean(),
	detainedAt: z.string().min(1).max(100).optional(),
	detainedSince: z.date().optional(),
	spouseFirstName: z.string().min(1).max(50).optional(),
	spouseMiddleName: z.string().min(1).max(50).optional(),
	spouseLastName: z.string().min(1).max(50).optional(),
	spouseNameSuffix: z.string().min(1).max(50).optional(),
	spouseAddress: z.string().min(1).max(100).optional(),
	spouseEmail: z.string().email().optional(),
	spouseContactNumber: z.string().regex(/^(09|\+639)\d{9}$/).optional(),
	classification: z.array(z.string().refine((string) => Object.keys(classification.map(
		({ id }) => id
	)).includes(string), {
		message: 'Invalid classification'
	})).min(1),
});

export type FormSchema = typeof formSchema;
