import z from 'zod';

export const nature = [
	'Administration of Oath',
	'Barangay Outreach',
	'Home Visitation',
	'Inquest Legal Assistance',
	'Jail Visitation Release',
	'Legal Advice',
	'Legal Documentation',
	'Limited Services',
	'Mediation or Conciliation',
	'Representation in Court or Quasi-Judicial Bodies',
	'Others'
] as const;


export const typeOfService = [
	'Judicial',
	'Quasi-Judicial',
	'Non-Judicial'
] as const;

// other nature of cases possible
export const otherNature = [
	'Document/Pleadings Prepared',
	'Assisted During Custodial Interrogation',
	'Assisted During Inquest Investigation'
];

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
	'BENECO-Waiver',
	'Cohabitation (PDL)',
	'Cohabitation',
	'Confirmation (PNP)',
	'Consent (PMA)',
	'Consent to Travel',
	'Delayed Registration of Birth',
	'Legitimation',
	'Loss (ATM)',
	'Loss (Books)',
	'Loss (General)',
	'Loss (Passport)',
	'Loss (Plate Number)',
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

export const sex = ['Male', 'Female'] as const;

export const formSchema = z.object({
	_id: z.string(),
	title: z.string().min(1, 'Title is required.'),
	client_id: z.array(z.string()).min(1, 'Client is required.'),
	lawyer_id: z.string().min(1, 'Lawyer is required.'),
	case_id: z.array(z.string()).optional(),
	limitedName: z.string(),
	limitedSex: z.enum(sex),
	limitedCases: z.array(z.string()),
	interviewee_id: z.string().min(1, 'Interviewee is required.'),
	relationshipToClient: z.enum(relationshipToClient),
	nature: z.array(z.enum(nature)).min(1, 'Nature of Service is required.'),
	otherNature: z.array(z.string()).optional(),
	typeOfAssistance: z.enum(typeOfAssistance).optional(),
	typeOfRelease: z.enum(typeOfRelease).optional(),
	typeOfService: z.enum(typeOfService, {
		required_error: 'Type of Service is required.'
	}),
	currentStatus: z.enum(status),
	beneficiary: z.array(z.object({
		name: z.string(),
		address: z.string(),
		gender: z.string(),
		age: z.number().int(),
		ethnicity: z.string()})),
	dateOfVisit: z
		.date()
		.or(z.literal(''))
		.transform((e) => (e === '' ? undefined : e))
		.optional(),
	recommendation: z.string().optional(),
	status: z.array(
		z.object({
			type: z.enum(status),
			date: z.date()
		})
	),
	natureOfInstrument: z.array(z.enum(natureOfInstrument)),
	witness: z.string().optional(),
	duringOffice: z.boolean().default(false)
});

export type FormSchema = typeof formSchema;
export type Service = z.infer<typeof formSchema>;
