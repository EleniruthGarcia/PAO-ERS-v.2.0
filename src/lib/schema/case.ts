import z from 'zod';

export const natureOfTheCase = [
	'Criminal',
	'Civil',
	'Administrative',
	'Appealed',
	"Prosecutor's office cases",
	'Labor'
] as const;

export const clientInvolvement = [
	'Accused',
	'Complainant',
	'Defendant',
	'Oppositor',
	'Petitioner',
	'Plaintiff',
	'Respondent',
	'Others'
] as const;

export const adversePartyInvolvement = [
	'Plaintiff or Complainant',
	'Defendant, Respondent, or Accused',
	'Oppositor or Others'
] as const;

export const status = [
	'New',
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
	'Cases referred to SACS'
] as const;

export const terminated = [
	'Favorable Dispositions to Clients',
	'Unfavorable Dispositions to Clients',
	'Other dispositions',
	'Cases for filing',
	'Cases considered closed and terminated'
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
] as const;

export const favorableCriminalPreliminary = [
	'Case filed in court (complainant)',
	'Dismissed (respondent)'
] as const;

export const pretrialAndOtherDispositions = [
	'Bail (Non-bailable offense)',
	'Recognizance',
	'Diversion proceedings / Intervention',
	'Suspended sentence',
	'Maximum imposable penalty served'
] as const;

export const hernanStatus = [
	'Clients are already released by virtue of Petition filed',
	'Petition is already filed',
	'PAO is awaiting records from the court',
	'Petition by PAO is not applicable (e.g. PDL was already released, deceased, has a private lawyer, application is not favorable, etc.)',
	'No. of cases which are already for filing of petition',
	'Motion/ other remedies are filed/ undertaken'
] as const;

export const unfavorable = [
	'Convicted as charged',
	'Lost (civil, administrative & labor)',
	'Dismissed (civil, administrative & labor)',
	'Criminal cases for preliminary investigation'
] as const;

export const unfavorableCriminalPreliminary = [
	'Dismissed (complainant)',
	'Dismissed (respondent (Filed in Court)'
] as const;

export const genderCaseSubject = [
	'VAWC',
	'Rape',
	'Acts of Lasciviousness',
	'Sexual Harassment'
] as const;

export const causeOfTermination = ['MOA', 'AUQNA'] as const;

export const formSchema = z.object({
	_id: z.string().optional(),
	controlNo: z.string().min(1, 'Control No. is required.'),
	natureOfTheCase: z.string(),
	caseSpecs: z.string(),
	clientInvolvement: z.array(z.enum(clientInvolvement)).min(1, 'Client Involvement is required.'),
	adversePartyInvolvement: z
		.array(z.enum(adversePartyInvolvement))
		.min(1, 'Adverse Party Involvement is required.'),
	adversePartyName: z.string().min(1, 'Adverse Party Name is required.'),
	adversePartyAddress: z.string().min(1, 'Adverse Party Address is required.'),
	factsOfTheCase: z.string().optional(),
	causeOfActionOrNatureOfOffence: z.string().optional(),
	pendingInCourt: z.boolean(),
	titleOfTheCase: z.string().optional(),
	docketNumber: z.string().optional(),
	court: z.string().optional(),
	currentStatus: z.enum(status),
	status: z.array(
		z.object({
			type: z.enum(status),
			date: z.date()
		})
	),
	actionTaken: z.string(),
	transferredTo: z.string().optional(),
	transferredFrom: z.string().optional(),
	genderCaseSubject: z.enum(genderCaseSubject).optional(),
	dateOfBirth: z
		.date()
		.or(z.literal(''))
		.transform((e) => (e === '' ? undefined : e))
		.optional(),
	dateOfCommission: z
		.date()
		.or(z.literal(''))
		.transform((e) => (e === '' ? undefined : e))
		.optional(),
	judge: z.string().optional(),
	causeOfTermination: z.enum(causeOfTermination).optional()
});

export type FormSchema = typeof formSchema;
export type Case = z.infer<typeof formSchema>;
