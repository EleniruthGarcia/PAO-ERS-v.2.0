import z from 'zod';

export const nature = [
	'Administration of Oath', //
	'Barangay Outreach', //
	'Home Visitation',
	'Inquest Legal Assistance',//
	'Jail Visitation',
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
	'Affidavit of Loss (General)',
	'BENECO Waiver',
	'Cohabitation (PDL)',
	'Cohabitation',
	'Confirmation (PNP)',
	'Consent (PMA)',
	'Consent to Travel',
	'Delayed Registration of Birth',
	"Detainee's Manifestation",
	'Legitimation',
	'Low Income (Both Parents)',
	'Low Income (Single Parent/Widow/Guardian',
	'No Pending Case',
	'No/Low Income (Simple)',
	'Non-employment (For petition for correction with LCP)',
	'Omnibus Certification',
	'Paternity & Filation',
	'Personal Data Sheet',
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
	'Undertaking (TESDA)',
	'Others'
] as const;

export const terminationMediaCon = [
	'Disputes settled (compromised agreement)',
	'Disputes closed without settlement'
] as const;

export const limitedServices = [
	'For Arraignment Only',
	'For Pre-trial Only',
	'For Promulgation of Judgment Only',
	'Others'
] as const;

export const sex = ['Male', 'Female'] as const;

export const formSchema = z.object({
	// base
	_id: z.string({ required_error: 'ID is required.' }),
	lawyer_id: z.string({ required_error: 'Lawyer is required.' }),
	typeOfService: z.enum(typeOfService, { required_error: 'Type of Service is required.' }),
	nature: z.array(z.enum(nature)).nonempty({ message: 'Nature of Service is required.' }),
	otherNature: z.array(z.string()).optional(),
	date: z.date({ required_error: 'Date is required.' }),
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

	// common to all services except limited services and barangay outreach 
	client_id: z.array(z.string()).optional(),

	// common to all services except barangay outreach, Jail Visitation, and limited services
	interviewee_id: z.string().optional(),
	relationshipToClient: z.enum(relationshipToClient).optional(),

	// adminisration of oath
	natureOfInstrument: z.array(z.string()).optional(),
	witness: z.string().optional(),

	// barangay outreach
	barangay: z.string().optional(),
	problemsPresented: z.string().optional(),
	activitiesUndertaken: z.string().optional(),
	beneficiary: z.array(
		z.object({
			name: z.string().optional(),
			address: z.string().optional(),
			sex: z.enum(sex).optional(),
			age: z.number().optional(),
			ethnicity: z.string().optional(),
		})
	).optional(),

	// inquest legal assistance
	typeOfAssistance: z.enum(typeOfAssistance).optional(),
	duringOffice: z.boolean().optional(),

	// common to Jail Visitation and representation in court or quasi-judicial bodies
	case_id: z.string().optional(),

	// Jail Visitation
	typeOfRelease: z.enum(typeOfRelease).optional(),
	recommendation: z.string().optional(),

	// limited services
	limitedName: z.string().optional(),
	limitedService: z.string().optional(),

	// common to legal advice and mediation or conciliation
	additionalNotes: z.string().optional(),

	// legal advice
	legalAdviceMode: z.enum(legalAdviceMode).optional(),

	// mediation or conciliation
	settlementDate: z.date().optional(),
	mediationDates: z.array(z.date()).optional(),
	terminationMediaCon: z.enum(terminationMediaCon).optional(),

	// representation in court or quasi-judicial bodies
	hearingDates: z.array(z.date()).optional(),
}).superRefine((data, ctx) => {
	if (!data.nature.includes('Barangay Outreach') && !data.nature.includes('Limited Services')) {
		if (!data.client_id || data.client_id.length < 1)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Client is required.',
				path: ['client_id']
			});
	}

	if (data.nature.includes('Administration of Oath')) {
		if (!data.natureOfInstrument || data.natureOfInstrument.length < 1)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Nature of Instrument is required.',
				path: ['natureOfInstrument']
			});
	}

	if (data.nature.includes('Barangay Outreach')) {
		if (data.nature.length > 1)
			ctx.addIssue({
				code: z.ZodIssueCode.too_big,
				maximum: 1,
				type: 'array',
				inclusive: true,
				message: 'Barangay Outreach cannot be combined with other natures of service.',
				exact: true,
				path: ['nature']
			});

		if (!data.beneficiary || data.beneficiary.length < 1)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Beneficiary is required.',
				path: ['beneficiary']
			});
		else {
			data.beneficiary.forEach((b, i) => {
				if (!b.name)
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Name is required.',
						path: ['beneficiary', i, 'name']
					});

				if (!b.address)
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Address is required.',
						path: ['beneficiary', i, 'address']
					});

				if (!b.sex)
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Sex is required.',
						path: ['beneficiary', i, 'sex']
					});
			});
		}

		if (!data.problemsPresented)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Problems Presented is required.',
				path: ['problemsPresented']
			});

		if (!data.activitiesUndertaken)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Activities Undertaken is required.',
				path: ['activitiesUndertaken']
			});

		if (!data.barangay)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Barangay is required.',
				path: ['barangay']
			});
	}

	if (data.nature.includes('Inquest Legal Assistance')) {
		if (!data.typeOfAssistance)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Type of Assistance is required.',
				path: ['typeOfAssistance']
			});

		if (data.duringOffice === undefined)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'During Office is required.',
				path: ['duringOffice']
			});
	}

	if (data.nature.includes('Jail Visitation') || data.nature.includes('Representation in Court or Quasi-Judicial Bodies')) {
		if (!data.case_id)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Case is required.',
				path: ['case_id']
			});

		if (data.nature.includes('Jail Visitation')) {
			if (!data.typeOfRelease)
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Type of Release is required.',
					path: ['typeOfRelease']
				});
		}
	}

	if (data.nature.includes('Limited Services')) {
		if (data.nature.length > 1)
			ctx.addIssue({
				code: z.ZodIssueCode.too_big,
				maximum: 1,
				type: 'array',
				inclusive: true,
				message: 'Limited Services cannot be combined with other natures of service.',
				exact: true,
			});

		if (!data.limitedService || data.limitedService.length < 1)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Limited Service is required.',
				path: ['limitedService']
			});

		if (!data.limitedName)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Name is required.',
				path: ['limitedName']
			});

	}

	if (data.nature.includes('Legal Advice')) {
		if (!data.legalAdviceMode)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Legal Advice Mode is required.',
				path: ['legalAdviceMode']
			});
	}

	if (data.nature.includes('Representation in Court or Quasi-Judicial Bodies')) {
		if (!data.hearingDates || data.hearingDates.length < 1)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Hearing Dates is required.',
				path: ['hearingDates']
			});
	}
});

export type FormSchema = typeof formSchema;
export type Service = z.infer<typeof formSchema>;