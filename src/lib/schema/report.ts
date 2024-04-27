import z from 'zod';

export const reports = [
	'Age And Sex Disaggregated Report on Released Pdls',
	'Brgy. Service Day Outreach Program',
	'Consolidated Gender-Related Cases Handled',
	'Consolidated List of Clients Who Benefitted From R.A. 10951',
	'Consolidated Report',
	'Consolidated Report on Clients Assisted on Drug Cases (Involving Voluntary Submission For Confinement And Rehabilitation)',
	'Deadline For Action on Cases / Assignment Monthly Report',
	'For Philippines Statistic Authority (Census) For Pao Legal Assistance',
	'Individual Performance Report',
	'Individual Report on Children In Conflict With The Law, Women, Torture, Rape Case, and Other Specific Mandates',
	'Individual Report on Status of Special And Appealed Cases',
	'Innovation Report',
	'List of Assisted Law Enforcement officers Who Were Sued In The Performance of Their Duties Involving Drug Related Cases',
	'List of Detainees Represented In Court',
	'List of Favorable Decisions/Dispositions',
	'Monthly Inventory of Cases',
	'Monthly Inventory of Clients Served',
	'Monthly Report on Legal Assistance Extended To Non-Filipino Citizens',
	'Monthly Report on Legal Assistance Extended To Taiwanese Nationals',
	'Monthly Report on Persons With Disability (PWD)',
	'On Legal Assistance Rendered To Former Rebels (FRS) And Former Violent Extremists (FVES)',
	'Precinct/Jail Visitation Report',
	'Report on Documents Notarized/Oaths Administered',
	'Report on Documents Notarized/Oaths Administered For Philippines Statistic Authority (Census)',
	'Report on Home Visit',
	'Report on The Assistance of Detainees In the Execution of Waiver/Manifestation In Relation to R.A. 10592',
	'Report on The Rendition of Free Legal Assistance To Children In Conflict With The Law',
	'Report on Victim’s Cases Handled',
	'Summary Report on Legal Outreach Activities Related To Illegal Drugs And Gad',
	'Year End Inventory of Clients Served',
	'Year-End Inventory of Cases'
] as const;

export const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
] as const;

export const formSchema = z.object({
	month: z.string().min(1, 'Month is required!'),
	// month: z.enum(months, {
	// 	required_error: 'Month is required!'
	// }),
	year: z.number().min(1, 'Year is required!'),
	notedBy: z.string().min(1, 'Noted by is required!'),
	reports: z.array(z.enum(reports))
});

export type FormSchema = typeof formSchema;
