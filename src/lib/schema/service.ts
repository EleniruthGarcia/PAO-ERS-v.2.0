import z from 'zod';

export const nature = [
	'Administration of Oath', //
	'Barangay Outreach', //
	'Home Visitation',
	'Inquest Legal Assistance',//
	'Jail Visitation Release',
	'Legal Advice',//
	'Legal Documentation', //
	'Limited Services',
	'Mediation or Conciliation', //
	'Representation in Court or Quasi-Judicial Bodies',//
	'Others'//
] as const;

export const legalAdviceMode = [
	'In person/walk-in',
	'Air mail',
	'E-mail',
	'Telephone/mobile phone',
	'Other means of communication'
] as const;

export const typeOfService = ['Judicial', 'Quasi-Judicial', 'Non-Judicial'] as const;

// other nature of cases possible
export const otherNature = [
	'Document/Pleadings Prepared',
	'Assisted During Custodial Interrogation',
	'Assisted During Inquest Investigation'
] as const;

export const relationshipToClient = [
	'Self',
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

export const typeOfAssistance = [
	'Assisted during Custodial Interrogation',
	'Assisted during Inquest Investigation',
	'Counseled during Inquest or Night Duty'
] as const;

export const typeOfRelease = [
	'Acquitted (After trial)',
	'Acquitted (On appeal)',
	'After serving the possible maximum of the prison term',
	'Due to complete service of sentence (Case is terminated)',
	'On account of preventive imprisonment equal to maximum imposable penalty',
	'On recognizance after service of minimum sentence',
	'On bail or on recognizance',
	'On inquest assistance or representation',
	'Due to provisional dismissal of case',
	'On motion to dismiss or motion to quash',
	'On pardon, executive clemency, or probation',
	'On other grounds'
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

export const natureOfInstrument = [
	'Affidavit of Indigency',
	'BENECO Waiver',
	'Cohabitation (PDL)',
	'Cohabitation',
	'Confirmation (PNP)',
	'Consent (PMA)',
	'Consent to Travel',
	'Delayed Registration of Birth',
	"Detainee's Manifestation",
	'Legitimation',
	'Loss (General)',
	'Low Income (Both Parents)',
	'Low Income (Single Parent/Widow/Guardian',
	'No Pending Case',
	'No/Low Income (Simple)',
	'Non-employment (For petition for correction with LCP)',
	'Omnibus Certification',
	'Paternity & Filation',
	'Singleness (PNP)',
	'Supplemental (Blank Entry)',
	'Supplmemental (Baby Boy, Baby Girl/Blank name',
	'Sworn Attestation (Mother)',
	"To use Father's Surname",
	'Undertaking (BFP)',
	'Undertaking (BWD - Far from Tapping point)',
	'Undertaking (BWD - Not to Install Booster Pump)',
	'Undertaking (BWD-Owner/ Not the Owner of the Lot)',
	'Undertaking (CASHBOND)',
	'Undertaking (TESDA)'
] as const;

export const terminationMediaCon = [
	'Disputes settled (compromised agreement)',
	'Disputes closed without settlement'
] as const;

export const limitedCases = [
] as const;

export const sex = ['Male', 'Female'] as const;

const base = z.object({
	_id: z.string(),
	discriminator: z.enum(['normal', 'outreach']).default('normal'),
	lawyer_id: z.string().min(1, 'Lawyer is required.'),
	typeOfService: z.enum(typeOfService, {
		required_error: 'Type of Service is required.'
	}),
	nature: z.array(z.enum(nature)).min(1, 'Nature of Service is required.'),
	otherNature: z.array(z.enum(otherNature)).optional(),
	// .union([z.enum(otherNature).optional(), z.string().optional()])
	// .transform((e) => (e === '' ? undefined : e)),
	currentStatus: z.enum(status, {
		required_error: 'Status is required.'
	}),
	status: z.array(
		z.object({
			type: z.enum(status),
			date: z.date()
		}),
		{ required_error: 'Status is required.' }
	),
});

const normal = z.object({
	// title: z.string().min(1, 'Title is required.'),
	discriminator: z.literal('normal'),
	client_id: z.array(z.string()).min(1, 'Client is required.'),
	interviewee_id: z.string().min(1, 'Interviewee is required.'),
	relationshipToClient: z.enum(relationshipToClient, {
		required_error: 'Relationship to Client is required.',
	}),
	case_id: z.string().optional(),
	typeOfAssistance: z.enum(typeOfAssistance).optional(),
	typeOfRelease: z.enum(typeOfRelease).optional(),
	dateOfVisit: z
		.date()
		.or(z.literal(''))
		.transform((e) => (e === '' ? undefined : e))
		.optional(),
	recommendation: z.string().optional(),
	limitedName: z.string(),
	limitedSex: z.enum(sex),
	limitedCases: z.array(z.string()),
	natureOfInstrument: z.array(z.enum(natureOfInstrument)),
	witness: z.string().optional(),
	duringOffice: z.boolean().default(false),
	legalAdviceMode: z.enum(legalAdviceMode),
	terminationMediaCon: z.enum(terminationMediaCon),
	additionalNotes: z.string().optional(),
	settlementDate: z.date().optional(),
	mediationDates: z.array(z.date()).optional(),
});

const outreach = z.object({
	discriminator: z.literal('outreach'),
	barangay: z.string().min(1, 'Barangay is required.'),
	problemsPresented: z.string().min(1, 'Problems Presented is required.'),
	activitiesUndertaken: z.string().min(1, 'Activities Undertaken is required.'),
	beneficiary: z.array(
		z.object({
			name: z.string(),
			address: z.string(),
			sex: z.enum(sex),
			age: z.number().int(),
			ethnicity: z.string()
		}),
		{ required_error: 'Beneficiary is required.' }
	),
});

export const formSchema = z.discriminatedUnion('discriminator', [normal, outreach]).and(base);

export type FormSchema = typeof formSchema;
export type Service = z.infer<typeof formSchema>;
