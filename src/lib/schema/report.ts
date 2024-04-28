import z from 'zod';

export const reports = [
	'F10: Brgy. Service Day Outreach Program',
	'F11: Precinct or Jail Visitation Report',
	"F12: Report on Victim's Cases Handled",
	'F13: Report on The Rendition of Free Legal Assistance To Children In Conflict With The Law',
	'F14: Report on The Assistance of Detainees In The Execution of Waiver or Manifestation In Relation to R.A. 10592',
	'F15: Report on Clients Assisted on Drug Cases (Involving Voluntary Submission For Confinement And Rehabilitation)',
	'F16: Monthly Report on Legal Assistance Extended To Taiwanese Nationals',
	'F17: Monthly Inventory of Clients Served',
	'F18: Monthly Report on Legal Assistance Extended To Non-Filipino Citizens',
	'F19: Monthly Inventory of Cases',
	'F20: Monthly Report on Persons With Disability (PWD)',
	'F21: Report on Documents Notarized or Oaths Administered',
	'F22: Report on Documents Notarized or Oaths Administered For Philippines Statistic Authority (Census)',
	'F23: Consolidated Report on Denied or Disqualified Clients For PAO Legal Assistance',
	'F24: Consolidated List of Clients Who Benefitted From R.A. 10951',
	'F25: Consolidated Gender-Related Cases Handled',
	'F26: Deadline For Action on Cases or Assignment Monthly Report',
	'F27: Individual Report on Status of Special And Appealed Cases',
	'F28: Individual Report on Children In Conflict With The Law, Women, Torture, Rape Case, and Other Specific Mandates',
	'F29: Individual Performance Report',
	'F31: List of Favorable Decisions or Dispositions',
	'F32: List of Detainees Represented In Court',
	'F33: List of Assisted Law Enforcement officers Who Were Sued In The Performance of Their Duties Involving Drug Related Cases',
	'F34: Year-End Inventory of Cases',
	'F35: Year End Inventory of Clients Served',
	'F38: Innovation Report',
	'F48: Age And Sex Disaggregated Report on Released PDLs',
	'F49: Consolidated Report On Legal Assistance Rendered To Former Rebels (FRs) And Former Violent Extremists (FVEs)',
	'F50: Summary Report on Legal Outreach Activities Related To Illegal Drugs And GAD',
	'F51: Report on Home Visit',
	'F52: Consolidated Report on Clients Assisted on Drug Cases (Involving Voluntary Submission For Confinement And Rehabilitation)'
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
	month: z.enum(months, {
		required_error: 'Month is required!',
		invalid_type_error: 'Invalid month!',
	}),
	// month: z.enum(months, {
	// 	required_error: 'Month is required!'
	// }),
	year: z.number().min(1, 'Year is required!'),
	notedBy: z.string().min(1, 'Noted by is required!'),
	reports: z.array(z.enum(reports))
});

export type FormSchema = typeof formSchema;
