import z from 'zod';

export const natureOfTheCase = [
	'Criminal',
	'Civil',
	'Labor',
	'Administrative',
	'Appealed',
	'Labor'
] as const;

export const clientInvolvement = [
	'Plaintiff',
	'Defendant'
] as const;

export const adversePartyInvolvement = [
	''
] as const;

export const status = [
	'New',
	'Ongoing',
	'Pending',
	'Terminated',
	'Archived',
	'Withdrawn',
	'Restored',
	'Transferred to private lawyer, IBP, etc.'
] as const;

export const pending = [
	'On trial',
	'Submitted for decision/resolution',
	'Appealed case from MTC to RTC',
	'Cases referred to SACS	',
] as const;

export const terminated = [
	'Favorable Dispositions to Clients',
	'Unfavorable Dispositions to Clients'
] as const;

export const favorable = [
	'Acquitted',
	'Dismissed with prejudice',
	'Motion to quash granted',
	'Demurrer to evidence granted',
	'Provisionally dismissed',
	'Convicted to lesser offense',
	'Probation granted',
	'Won (civil, labor, and administrative)',
	'Granted lesser award (civil, administrative & labor',
	'Dismissed cases based on compromise agreement (civil & labor)',
	'Criminal cases for preliminary investigation',
	'Pre-trial releases and other dispositions'
] as const

export const favorableCriminalPreliminary = [
	'Case filed in court (complainant)',
	'Dismissed (respondent)',
] as const

export const pretrialAndOtherDispositions = [
	'Bail (Non-bailable offense)',
	'Recognizance',
	'Diversion proceedings / Intervention',
	'Suspended sentence',
	'Maximum imposable penalty served',
] as const

export const unfavorable = [
	'Convicted as charged',
	'Lost (civil, administrative & labor)',
	'Dismissed (civil, administrative & labor)',
	'Criminal cases for preliminary investigation'
] as const

export const unfavorableCriminalPreliminary = [
	'Dismissed (complainant)',
	'Dismissed (respondent (Filed in Court)'
] as const;

export const formSchema = z.object({
	_id: z.string().optional(),
	natureOfTheCase: z.string(),
	caseSpecs: z.string(),
	clientInvolvement: z.array(z.enum(clientInvolvement)),
	adversePartyInvolvement: z.array(z.enum(adversePartyInvolvement)),
	adversePartyName: z.array(z.string()),
	adversePartyAddress: z.array(z.string()),
	factsOfTheCase: z.string().optional(),
	causeOfActionOrNatureOfOffence: z.string().optional(),
	pendingInCourt: z.boolean(),
	titleOfTheCase: z.string().optional(),
	docketNumber: z.number().optional(),
	courtOrBodyOrTribunal: z.string().optional(),
	currentStatus: z.enum(status),
	status: z.array(z.object({
		type: z.enum(status),
		date: z.date(),
	}))
});

export type FormSchema = typeof formSchema;
export type Case = z.infer<typeof formSchema>;