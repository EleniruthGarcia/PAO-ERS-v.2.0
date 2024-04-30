import z from 'zod';

export const nature = [
	'Administration of Oath',
	'Home Visitation',
	'Inquest Legal Assistance',
	'Jail Visitation Release',
	'Legal Advice',
	'Legal Documentation',
	'Mediation or Conciliation',
	'Representation in Court or Quasi-Judicial Bodies',
	'Others'
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

export const formSchema = z.object({
	_id: z.string(),
	client_id: z.array(z.string()).min(1, 'Client is required.'),
	lawyer_id: z.string().min(1, 'Lawyer is required.'),
	case_id: z.array(z.string()).optional(),
	interviewee_id: z.string().min(1, 'Interviewee is required.'),
	relationshipToClient: z.enum(relationshipToClient),
	nature: z.array(z.enum(nature)).min(1, 'Nature of Request is required.'),
	otherNature: z.array(z.string()).optional(),
	typeOfAssistance: z.enum(typeOfAssistance).optional(),
	typeOfRelease: z.enum(typeOfRelease).optional(),
	currentStatus: z.enum(status),
	status: z.array(
		z.object({
			type: z.enum(status),
			date: z.date()
		})
	),
	natureOfInstrument: z.string().optional(),
	witness: z.string().optional(),
	duringOffice: z.boolean().default(false),
});

export type FormSchema = typeof formSchema;
export type Request = z.infer<typeof formSchema>;
