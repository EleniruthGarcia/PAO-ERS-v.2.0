import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { generateReport } from '$lib/server/report';
import { formSchema, months } from '$lib/schema/report';
import { superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/reports', text: 'Reports' }
		],
		form: await superValidate(
			{
				month: months[new Date().getMonth()],
				year: new Date().getFullYear(),
				notedBy: event.locals.user.reportsTo,
				reports: []
			},
			zod(formSchema),
			{ errors: false }
		),
		lawyers: await db.users.find().toArray()
	};
};

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', event.url.pathname, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const lawyer = await db.users.findOne({ _id: event.locals.user.id });
		const branch = await db.branches.findOne({ _id: lawyer?.branch_id });
		const notedBy = await db.users.findOne({ _id: form.data.notedBy });

		const outreaches = await db.outreaches.find().toArray();
		let services = await db.services
			.aggregate([
				{
					$lookup: {
						from: 'users',
						localField: 'lawyer_id',
						foreignField: '_id',
						as: 'lawyer'
					}
				},
				{
					$addFields: {
						lawyer: { $arrayElemAt: ['$lawyer', 0] }
					}
				},
				// {
				// 	$match: { 'lawyer._id': event.locals.user.role === 'Administrator' ? '' : event.locals.user.id }
				// },
				{
					$lookup: {
						from: 'clients',
						localField: 'client_id',
						foreignField: '_id',
						as: 'client'
					}
				},
				{
					$unwind: '$client'
				},
				{
					$lookup: {
						from: 'clients',
						localField: 'interviewee_id',
						foreignField: '_id',
						as: 'interviewee'
					}
				},
				{
					$lookup: {
						from: 'cases',
						localField: '_id',
						foreignField: 'controlNo',
						as: 'case'
					}
				},
				{
					$lookup: {
						from: 'branches',
						localField: 'lawyer.branch_id',
						foreignField: '_id',
						as: 'branch'
					}
				},
				{
					$addFields: {
						branch: { $arrayElemAt: ['$branch', 0] },
						interviewee: { $arrayElemAt: ['$interviewee', 0] },
						case: { $arrayElemAt: ['$case', 0] }
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'case.transferredFrom',
						foreignField: '_id',
						as: 'case.transferredFrom'
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'case.transferredTo',
						foreignField: '_id',
						as: 'case.transferredTo'
					}
				},
				{
					$addFields: {
						'case.transferredFrom': { $arrayElemAt: ['$case.transferredFrom', 0] },
						'case.transferredTo': { $arrayElemAt: ['$case.transferredTo', 0] }
					}
				},
				{
					$project: {
						client: '$client',
						interviewee: '$interviewee',
						case: '$case',
						branch: '$branch',
						request: '$$ROOT',
						lawyer: '$lawyer',
						monthYear: {
							$dateToString: {
								date: '$date',
								format: '%B %Y',
								timezone: '+08:00',
								onNull: 'N/A'
							}
						},
						region: '$branch.region',
						districtProvince: {
							$concat: ['$branch.district', ', ', '$branch.province']
						},
						district: '$branch.district',
						province: '$branch.province',
						controlNo: '$_id',
						religion: { $ifNull: ['$client.religion', 'N/A'] },
						citizenship: { $ifNull: ['$client.citizenship', 'N/A'] },
						name: '$client.name',
						birthday: { $ifNull: ['$case.dateOfBirth', ''] },
						age: '$client.age',
						address: '$client.address',
						email: { $ifNull: ['$client.email', ''] },
						individualMonthlyIncome: {
							$toString: { $ifNull: ['$client.individualMonthlyIncome', 'N/A'] }
						},
						detainedSince: '$client.detainedSince',
						civilStatus: { $ifNull: ['$client.civilStatus', 'N/A'] },
						sex: '$client.sex',
						educationalAttainment: '$client.educationalAttainment',
						languageDialect: '$client.language',
						contactNo: { $ifNull: ['$client.contactNumber', 'N/A'] },
						spouse: { $ifNull: ['$client.spouse', ''] },
						addressOfSpouse: { $ifNull: ['$client.addressOfSpouse', ''] },
						spouseContactNo: { $ifNull: ['$client.spouseContactNumber', ''] },
						placeOfDetention: '$client.detainedAt',
						proofOfIndigency: { $ifNull: ['$client.proofOfIndigency', []] },
						intervieweeName: '$interviewee.name',
						intervieweeAddress: '$interviewee.address',
						intervieweeAge: '$interviewee.age',
						intervieweeSex: '$interviewee.sex',
						intervieweeCivilStatus: '$interviewee.civilStatus',
						intervieweeContactNo: { $ifNull: ['$interviewee.contactNumber', 'N/A'] },
						intervieweeEmail: { $ifNull: ['$interviewee.email', ''] },
						relationshipToClient: '$relationshipToClient',
						natureOfRequest: '$natureOfRequest',
						PDLStatus: '$client.detained',
						natureOfTheCase: { $ifNull: ['$case.natureOfTheCase', ''] },
						caseSpecs: { $ifNull: ['$case._id', ''] },
						factsOfTheCase: { $ifNull: ['$case.factsOfTheCase', ''] },
						clientClasses: { $ifNull: ['$client.classification', []] },
						clientInvolvement: { $ifNull: ['$case.clientInvolvement', ''] },
						adverseParty: { $ifNull: ['$case.adversePartyInvolvement', ''] },
						adversePartyName: { $ifNull: ['$case.adversePartyName', 'N/A'] },
						adversePartyAddress: { $ifNull: ['$case.adversePartyAddress', 'N/A'] },
						natureOfOffence: { $ifNull: ['$case.natureOfOffence', ''] },
						courtPendingStatus: { $ifNull: ['$case.status', ''] },
						titleOfCaseDocketNum: {
							$concat: ['$case.titleOfCase', ' (', '$case.docketNumber', ')']
						},
						court: { $ifNull: ['$case.court', ''] },
						status: '$case.status.type',
						date: '$case.status.date',
						titleOfCase: '$case.titleOfCase',
						caseNo: '$case.docketNumber',
						judge: { $ifNull: ['$case.actionTaken', ''] },
						assistance: '$request.typeOfAssistance',
						actionTaken: { $ifNull: ['$case.actionTaken', ''] },
						CICL: {
							$cond: [
								{ $in: ['$client.classification', ['Child in Conflict with the Law']] },
								'X',
								''
							]
						},
						Women: { $cond: [{ $in: ['$client.classification', ['Women']] }, 'X', ''] },
						Senior: { $cond: [{ $in: ['$client.classification', ['Senior Citizen']] }, 'X', ''] },
						OFW: {
							$cond: [
								{ $in: ['$client.classification', ['OFW (Land-Based)', 'OFW (Sea-Based)']] },
								'X',
								''
							]
						},
						IG: { $cond: [{ $ifNull: ['$client.indigenousPeople', 'true'] }, '', 'X'] },
						PWD: { $cond: [{ $ifNull: ['$client.pwd', 'true'] }, '', 'X'] },
						UP: { $cond: [{ $ifNull: ['$client.urbanPoor', 'true'] }, '', 'X'] },
						RP: { $cond: [{ $ifNull: ['$client.ruralPoor', 'true'] }, '', 'X'] },
						Judi: { $cond: [{ $in: ['$services.nature', ['Representation', '']] }, 'X', ''] },
						Quasi: {
							$cond: [
								{ $in: ['$services.nature', ['Representation in Court or Quasi-Judicial Bodies']] },
								'X',
								''
							]
						},
						NonJudi: {
							$cond: [
								{
									$in: [
										'$services.nature',
										[
											'Legal Advice',
											'Administration of Oath',
											'Outreach',
											'Inquest Legal Assistance',
											'Mediation or Conciliation'
										]
									]
								},
								'X',
								''
							]
						},
						genderCase: { $ifNull: ['$case.genderCaseSubject', []] },
						typePWD: { $ifNull: ['$client.pwd', []] },
						termination: { $ifNull: ['$case.causeOfTermination', ''] },
						dateCommission: { $ifNull: ['$case.dateOfCommission', ''] },
						natureOfInstrument: { $ifNull: ['$request.natureOfInstrument', []] }
					}
				},
				{
					$addFields: {}
				}
			])
			.toArray();

		const f11 = services.filter((d) => d.services?.nature?.includes('Jail Visitation'));
		const f12 = '';
		const f13 = services.filter((d) =>
			d.client?.classification?.includes('Child in Conflict with the Law')
		);
		const f14 = '';
		const f15 = services.filter((d) =>
			d.client?.classification?.includes('Petitioner for Voluntary Rehabilitation')
		);
		const f16 = '';
		// services.filter((d) => d.client?.foreignNational?.contains('Taiwanese'));
		const f18 = services.filter(
			(d) =>
				d.client?.classification?.includes('OFW') &&
				d.services?.nature?.includes('Inquest Legal Assistance')
		);
		const f19 = {
			criminal: services.filter((d) => d.case?.natureOfTheCase?.includes('Criminal')),
			civil: services.filter((d) => d.case?.natureOfTheCase?.includes('Civil')),
			administrative: services.filter((d) => d.case?.natureOfTheCase?.includes('Administrative')),
			prosecutor: services.filter((d) =>
				d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			labor: services.filter((d) => d.case?.natureOfTheCase?.includes('Labor'))
		};
		const f20 = services.filter((d) => d.client?.PWD?.includes(true));
		const f21 = services.filter((d) => d.request?.nature?.includes('Administration of Oath'));
		const f22 = services.filter((d) => d.request?.nature?.includes('Others (PSA)'));
		const f23 = services.filter((d) =>
			d.client?.classification?.includes('Denied or Disqualified')
		);
		const f24 = services.filter((d) =>
			d.client?.classification?.includes('Beneficiary of Hernan Ruling (R.A. No. 10951)')
		);
		const f25 = services.filter((d) => d.case?.genderCaseSubject?.includes(''));
		const f26 = '';
		const f27 = '';

		const f29 = services.filter((d) => d.request?.nature?.includes('Others (PSA)'));

		const f31 = services.filter((d) =>
			d.case?.terminated?.includes('Favorable Dispositions to Clients')
		);
		const f32 = services.filter(
			(d) =>
				// d.client?.detainedSince?.contains('') &&
				d.services?.nature?.includes('Representation in Court or Quasi-Judicial Bodies')
		);
		const f33 = services.filter((d) => d.case?.favorable?.includes(''));
		const f34 = {
			criminal: services.filter((d) => d.case?.natureOfTheCase?.includes('Criminal')),
			civil: services.filter((d) => d.case?.natureOfTheCase?.includes('Civil')),
			administrative: services.filter((d) => d.case?.natureOfTheCase?.includes('Administrative')),
			prosecutor: services.filter((d) =>
				d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			labor: services.filter((d) => d.case?.natureOfTheCase?.includes('Labor'))
		};
		const f35 = '';
		const f38 = services.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));

		const f49 = services.filter((d) => d.request?.nature?.includes('Others (PSA)'));

		const f50 = '';
		const f51 = services.filter((d) => d.request?.nature?.includes('Home Visitation'));
		const f52 = '';

		services = await db.services
			.aggregate([
				{
					$lookup: {
						from: 'users',
						localField: 'lawyer_id',
						foreignField: '_id',
						as: 'lawyer'
					}
				},
				{
					$addFields: {
						lawyer: { $arrayElemAt: ['$lawyer', 0] }
					}
				},
				// {
				// 	$match: { 'lawyer._id': event.locals.user.role === 'Administrator' ? '' : event.locals.user.id }
				// },
				{
					$lookup: {
						from: 'clients',
						localField: 'client_id',
						foreignField: '_id',
						as: 'client'
					}
				},
				{
					$lookup: {
						from: 'clients',
						localField: 'interviewee_id',
						foreignField: '_id',
						as: 'interviewee'
					}
				},
				{
					$lookup: {
						from: 'cases',
						localField: '_id',
						foreignField: 'controlNo',
						as: 'case'
					}
				},
				{
					$lookup: {
						from: 'branches',
						localField: 'lawyer.branch_id',
						foreignField: '_id',
						as: 'branch'
					}
				},
				{
					$addFields: {
						branch: { $arrayElemAt: ['$branch', 0] },
						interviewee: { $arrayElemAt: ['$interviewee', 0] },
						case: { $arrayElemAt: ['$case', 0] }
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'case.transferredFrom',
						foreignField: '_id',
						as: 'case.transferredFrom'
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'case.transferredTo',
						foreignField: '_id',
						as: 'case.transferredTo'
					}
				},
				{
					$addFields: {
						'case.transferredFrom': { $arrayElemAt: ['$case.transferredFrom', 0] },
						'case.transferredTo': { $arrayElemAt: ['$case.transferredTo', 0] }
					}
				}
			]).toArray();

		const pendingCasesFromPreviousMonth = services.filter(
			(d) => d.case?.status?.filter(
				(s: any) =>
					s.type !== 'Terminated' &&
					(s.date?.getMonth() + 1 < 12
						? (months[s.date?.getMonth() + 1] === form.data.month && s.date?.getFullYear() === form.data.year)
						: (s.date?.getMonth() === 11 && s.date?.getFullYear() === form.data.year - 1))
			).length > 0
		);

		const newCasesForThisMonth = services.filter(
			(d: any) => d.case?.status?.filter(
				(s: any) =>
					s.type === "New" && months[s.date?.getMonth()] === form.data.month &&
					s.date?.getFullYear() === form.data.year
			).length > 0
		);

		console.log(
			'CICL',

			'\n\tNew Case:', newCasesForThisMonth.filter((d: any) =>
				d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,

			'\n\t# of Clients Involved sa New Case', newCasesForThisMonth.filter((d: any) =>
				d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).map((d: any) => d.client.length).reduce((a: any, b: any) => a + b, 0),

			'\n\tPending Case:', pendingCasesFromPreviousMonth.filter((d: any) =>
				d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,

			'\n\t# of Clients Involved sa Pending Case', pendingCasesFromPreviousMonth.filter((d: any) =>
				d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).map((d: any) => d.client.length).reduce((a: any, b: any) => a + b, 0),
		)

		const f28 = {
			// (1) prev active cases from previous month
			// d.case?.natureOfTheCase?.includes('Criminal') &&

			// (2) new cases for this month
			// d.case?.natureOfTheCase?.includes('Criminal') &&
			// a_crnc:  services.filter(
			// 	(d) =>
			// 		d.case?.natureOfTheCase?.includes('Criminal') &&
			// 		s.date?.getMonth() > form.data.month)?.length > 0,
			// (3) find the number of clients enclosed in these cases vvv, down here a_crcc
			a_crcc: services
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.includes('Criminal')
				)?.length,
			a_cvcc: services
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.includes('Civil')
				)?.length,
			a_ad1cc: services
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.includes('Administrative')
				)?.length,
			a_ad2cc: services
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
				)?.length,
			a_ad3cc: services
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.includes('Labor')
				)?.length,
			a_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			a_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			a_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			a_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			a_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			a_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			a_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			a_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			a_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			a_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			a_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			a_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			a_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			a_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			a_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			a_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			a_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			a_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			a_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			a_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			a_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			a_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			a_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			a_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			a_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			a_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			a_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			a_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			a_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			a_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			a_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			a_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			a_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			a_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			a_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			a_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			a_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			a_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.nature?.includes('Legal Advice')
			),
			a_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			a_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			)
		};

		const quarterlyRequests = services.filter(
			(d) =>
				d.date?.getMonth() + 1 >= 1 &&
				d.date?.getMonth() + 1 <= 3 &&
				d.date?.getFullYear() === form.data.year
		);

		const f48 = {
			mr1a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes('On other grounds') &&
					d.client?.age < 18
			),
			mr1a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes('On other grounds') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr1a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes('On other grounds') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr1a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes('On other grounds') &&
					d.client?.age >= 60
			),
			fr1a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes('On other grounds') &&
					d.client?.age < 18
			),
			fr1a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes('On other grounds') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr1a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes('On other grounds') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr1a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes('On other grounds') &&
					d.client?.age >= 60
			),
			mr2a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age < 18
			),
			mr2a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr2a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr2a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 60
			),
			fr2a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age < 18
			),
			fr2a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr2a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr2a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 60
			),
			mr3a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes('Due to provisional dismissal of case') &&
					d.client?.age < 18
			),
			mr3a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes('Due to provisional dismissal of case') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr3a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes('Due to provisional dismissal of case') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr3a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes('Due to provisional dismissal of case') &&
					d.client?.age >= 60
			),
			fr3a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes('Due to provisional dismissal of case') &&
					d.client?.age < 18
			),
			fr3a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes('Due to provisional dismissal of case') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr3a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes('Due to provisional dismissal of case') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr3a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes('Due to provisional dismissal of case') &&
					d.client?.age >= 60
			),
			mr4a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age < 18
			),
			mr4a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr4a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr4a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 60
			),
			fr4a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age < 18
			),
			fr4a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr4a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr4a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 60
			),
			mr5a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age < 18
			),
			mr5a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr5a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr5a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.services?.typeOfRelease?.includes(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 60
			),
			fr5a1: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age < 18
			),
			fr5a2: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr5a3: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr5a4: services.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.services?.typeOfRelease?.includes(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 60
			)
		};


		return {
			form,
			report: await generateReport({
				...branch,
				lawyer,
				month: form.data.month,
				year: form.data.year,
				notedBy,
				assignedCourts: new Set(services.map((d) => d.case?.court).filter(Boolean)),
				f10: outreaches,
				f11,
				f13,
				f15,
				f16,
				f17: [...services, ...outreaches],
				f18,
				f19,
				f20,
				f21,
				f22,
				f23,
				f24,
				f25,
				f26,
				f27,
				f28,
				f29,
				f31,
				f32,
				f33,
				f34,
				f35: [...services, ...outreaches],
				f38,
				f48,
				f49,
				f50,
				f51,
				f52
			})
		};
	}
} satisfies Actions;
