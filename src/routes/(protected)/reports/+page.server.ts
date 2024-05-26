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
			])
			.toArray();

		const pendingCasesFromPreviousMonth = services.filter(
			(d) =>
				d.case?.status?.filter(
					(s: any) =>
						s.type !== 'Terminated' &&
						(s.date?.getMonth() + 1 < 12
							? months[s.date?.getMonth() + 1] === form.data.month &&
								s.date?.getFullYear() === form.data.year
							: s.date?.getMonth() === 11 && s.date?.getFullYear() === form.data.year - 1)
				).length > 0
		);

		const newCasesForThisMonth = services.filter(
			(d: any) =>
				d.case?.status?.filter(
					(s: any) =>
						s.type === 'New' &&
						months[s.date?.getMonth()] === form.data.month &&
						s.date?.getFullYear() === form.data.year
				).length > 0
		);

		const endedCasesForThisMonth = services.filter(
			(d: any) =>
				d.case?.status?.filter(
					(s: any) =>
						s.type === 'Terminated' &&
						months[s.date?.getMonth()] === form.data.month &&
						s.date?.getFullYear() === form.data.year
				).length > 0
		);

		console.log(
			'CICL',

			'\n\tNew Case:',
			newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,

			'\n\t# of Clients Involved sa New Case',
			newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			'\n\tPending Case:',
			pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,

			'\n\t# of Clients Involved sa Pending Case',
			pendingCasesFromPreviousMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0)
		);

		const f28 = {
			// Pending cases from previous months
			a_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,
			a_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,
			a_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,
			a_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,
			a_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,

			// New Cases/Clients this month
			a_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,
			a_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			a_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,
			a_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			a_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,
			a_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			a_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,
			a_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			a_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Child in Conflict with the Law'))
			).length,
			a_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			a_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			a_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			a_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			a_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			a_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Child in Conflict with the Law')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
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
			// 6 --> 10
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
			),
			// Pending cases from previous months
			b1_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,
			b1_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,
			b1_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,
			b1_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,
			b1_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,

			// New Cases/Clients this month
			b1_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,
			b1_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Woman Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			b1_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,
			b1_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Woman Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			b1_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,
			b1_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Woman Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			b1_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,
			b1_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Woman Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			b1_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Woman Client')
					)
			).length,
			b1_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Woman Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Case Disposition
			b1_cvfi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			b1_crfi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			b1_ad1fi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			b1_ad2fi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			b1_ad3fi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			b1_cvte: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			b1_crte: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			b1_ad1te: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			b1_ad2te: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			b1_ad3te: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			b1_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			b1_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			b1_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Woman Client') &&
					d.request?.nature?.includes('Legal Advice')
			),
			// Pending cases from previous months
			b2_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,
			b2_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,
			b2_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,
			b2_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,
			b2_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,

			// New Cases/Clients this month
			b2_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,
			b2_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Child Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			b2_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,
			b2_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Child Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			b2_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,
			b2_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Child Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			b2_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,
			b2_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Child Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			b2_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter(
						(c: any) =>
							c.classification?.includes('VAWC Victim') &&
							d.client?.classification?.includes('Child Client')
					)
			).length,
			b2_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter(
							(c: any) =>
								c.classification?.includes('VAWC Victim') &&
								d.client?.classification?.includes('Child Client')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Case Disposition
			b2_cvfi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			b2_crfi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			b2_ad1fi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			b2_ad2fi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			b2_ad3fi: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			b2_cvte: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			b2_crte: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			b2_ad1te: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			b2_ad2te: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			b2_ad3te: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			b2_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			b2_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			b2_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('VAWC Victim') &&
					d.client?.classification?.includes('Child Client') &&
					d.request?.nature?.includes('Legal Advice')
			),
			// Pending cases from previous months
			c_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,
			c_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,
			c_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,
			c_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,
			c_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,

			// New Cases/Clients this month
			c_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,
			c_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			c_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,
			c_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			c_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,
			c_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			c_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,
			c_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			c_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Woman Client (Non-VAWC Victim)'))
			).length,
			c_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			c_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			c_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			c_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			c_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			c_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Woman Client (Non-VAWC Victim)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			c_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			c_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			c_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			c_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			c_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			c_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			c_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			c_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			c_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			c_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			c_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			c_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			c_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			c_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			c_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			c_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			c_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			c_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			c_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			c_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			c_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			c_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			c_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			c_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			c_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			c_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			c_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			c_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			c_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			c_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			c_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			c_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			c_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			c_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			c_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			c_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			c_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			c_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.request?.nature?.includes('Legal Advice')
			),
			c_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			c_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('Woman Client (Non-VAWC Victim)') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			d_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.indigenousPeople)
			).length,
			d_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.indigenousPeople)
			).length,
			d_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.indigenousPeople)
			).length,
			d_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.indigenousPeople)
			).length,
			d_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.indigenousPeople)
			).length,

			// New Cases/Clients this month
			d_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.indigenousPeople)
			).length,
			d_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			d_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.indigenousPeople)
			).length,
			d_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			d_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.indigenousPeople)
			).length,
			d_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			d_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.indigenousPeople)
			).length,
			d_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			d_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.indigenousPeople)
			).length,
			d_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			d_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			d_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			d_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			d_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			d_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.indigenousPeople)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			d_crp5a: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			d_cvp5a: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			d_ad1p5a: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			d_ad2p5a: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			d_ad3p5a: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			d_crp5b: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			d_cvp5b: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			d_ad1p5b: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			d_ad2p5b: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			d_ad3p5b: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			d_crp5c: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			d_cvp5c: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			d_ad1p5c: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			d_ad2p5c: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			d_ad3p5c: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			d_crp5d: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			d_cvp5d: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			d_ad1p5d: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			d_ad2p5d: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			d_ad3p5d: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			d_cvft: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			d_crft: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			d_ad1ft: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			d_ad2ft: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			d_ad3ft: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			d_cvut: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			d_crut: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			d_ad1ut: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			d_ad2ut: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			d_ad3ut: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			d_cvot: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			d_crot: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			d_ad1ot: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			d_ad2ot: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			d_ad3ot: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			d_doc: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			d_oath: services.filter(
				(d) => d.client?.indigenousPeople && d.request?.nature?.includes('Administration of Oath')
			),
			d_coun: services.filter(
				(d) => d.client?.indigenousPeople && d.request?.nature?.includes('Legal Advice')
			),
			d_cust: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			d_inqu: services.filter(
				(d) =>
					d.client?.indigenousPeople &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			e_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.pwd)
			).length,
			e_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.pwd)
			).length,
			e_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' && d.client?.filter((c: any) => c.pwd)
			).length,
			e_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.pwd)
			).length,
			e_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.pwd)
			).length,

			// New Cases/Clients this month
			e_crneca: newCasesForThisMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.pwd)
			).length,
			e_crnecl: newCasesForThisMonth
				.filter(
					(d: any) => d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			e_cvneca: newCasesForThisMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.pwd)
			).length,
			e_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) => d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			e_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' && d.client?.filter((c: any) => c.pwd)
			).length,
			e_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' && d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			e_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.pwd)
			).length,
			e_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			e_ad3neca: newCasesForThisMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.pwd)
			).length,
			e_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) => d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			e_crencl: endedCasesForThisMonth
				.filter(
					(d: any) => d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			e_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) => d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			e_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' && d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			e_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			e_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) => d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.pwd)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			e_crp5a: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			e_cvp5a: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			e_ad1p5a: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			e_ad2p5a: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			e_ad3p5a: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			e_crp5b: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			e_cvp5b: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			e_ad1p5b: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			e_ad2p5b: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			e_ad3p5b: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			e_crp5c: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			e_cvp5c: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			e_ad1p5c: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			e_ad2p5c: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			e_ad3p5c: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			e_crp5d: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			e_cvp5d: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			e_ad1p5d: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			e_ad2p5d: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			e_ad3p5d: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			e_cvft: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			e_crft: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			e_ad1ft: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			e_ad2ft: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			e_ad3ft: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			e_cvut: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			e_crut: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			e_ad1ut: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			e_ad2ut: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			e_ad3ut: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			e_cvot: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			e_crot: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			e_ad1ot: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			e_ad2ot: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			e_ad3ot: services.filter(
				(d) =>
					d.client?.pwd &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			e_doc: services.filter(
				(d) => d.client?.pwd && d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			e_oath: services.filter(
				(d) => d.client?.pwd && d.request?.nature?.includes('Administration of Oath')
			),
			e_coun: services.filter((d) => d.client?.pwd && d.request?.nature?.includes('Legal Advice')),
			e_cust: services.filter(
				(d) =>
					d.client?.pwd &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			e_inqu: services.filter(
				(d) =>
					d.client?.pwd && d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			f_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.urbanPoor)
			).length,
			f_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.urbanPoor)
			).length,
			f_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' && d.client?.filter((c: any) => c.urbanPoor)
			).length,
			f_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.urbanPoor)
			).length,
			f_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.urbanPoor)
			).length,

			// New Cases/Clients this month
			f_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.urbanPoor)
			).length,
			f_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			f_cvneca: newCasesForThisMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.urbanPoor)
			).length,
			f_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			f_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' && d.client?.filter((c: any) => c.urbanPoor)
			).length,
			f_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			f_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.urbanPoor)
			).length,
			f_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			f_ad3neca: newCasesForThisMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.urbanPoor)
			).length,
			f_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			f_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			f_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			f_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			f_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			f_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.urbanPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			f_crp5a: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			f_cvp5a: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			f_ad1p5a: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			f_ad2p5a: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			f_ad3p5a: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			f_crp5b: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			f_cvp5b: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			f_ad1p5b: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			f_ad2p5b: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			f_ad3p5b: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			f_crp5c: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			f_cvp5c: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			f_ad1p5c: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			f_ad2p5c: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			f_ad3p5c: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			f_crp5d: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			f_cvp5d: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			f_ad1p5d: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			f_ad2p5d: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			f_ad3p5d: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			f_cvft: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			f_crft: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			f_ad1ft: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			f_ad2ft: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			f_ad3ft: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			f_cvut: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			f_crut: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			f_ad1ut: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			f_ad2ut: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			f_ad3ut: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			f_cvot: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			f_crot: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			f_ad1ot: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			f_ad2ot: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			f_ad3ot: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			f_doc: services.filter(
				(d) =>
					d.client?.urbanPoor && d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			f_oath: services.filter(
				(d) => d.client?.urbanPoor && d.request?.nature?.includes('Administration of Oath')
			),
			f_coun: services.filter(
				(d) => d.client?.urbanPoor && d.request?.nature?.includes('Legal Advice')
			),
			f_cust: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			f_inqu: services.filter(
				(d) =>
					d.client?.urbanPoor &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			g_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.ruralPoor)
			).length,
			g_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.ruralPoor)
			).length,
			g_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' && d.client?.filter((c: any) => c.ruralPoor)
			).length,
			g_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.ruralPoor)
			).length,
			g_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.ruralPoor)
			).length,

			// New Cases/Clients this month
			g_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.ruralPoor)
			).length,
			g_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			g_cvneca: newCasesForThisMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.ruralPoor)
			).length,
			g_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			g_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' && d.client?.filter((c: any) => c.ruralPoor)
			).length,
			g_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			g_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.ruralPoor)
			).length,
			g_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			g_ad3neca: newCasesForThisMonth.filter(
				(d: any) => d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.ruralPoor)
			).length,
			g_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			g_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			g_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			g_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			g_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			g_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.ruralPoor)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			g_crp5a: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			g_cvp5a: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			g_ad1p5a: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			g_ad2p5a: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			g_ad3p5a: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			g_crp5b: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			g_cvp5b: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			g_ad1p5b: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			g_ad2p5b: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			g_ad3p5b: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			g_crp5c: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			g_cvp5c: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			g_ad1p5c: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			g_ad2p5c: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			g_ad3p5c: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			g_crp5d: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			g_cvp5d: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			g_ad1p5d: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			g_ad2p5d: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			g_ad3p5d: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			g_cvft: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			g_crft: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			g_ad1ft: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			g_ad2ft: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			g_ad3ft: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			g_cvut: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			g_crut: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			g_ad1ut: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			g_ad2ut: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			g_ad3ut: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			g_cvot: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			g_crot: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			g_ad1ot: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			g_ad2ot: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			g_ad3ot: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			g_doc: services.filter(
				(d) =>
					d.client?.ruralPoor && d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			g_oath: services.filter(
				(d) => d.client?.ruralPoor && d.request?.nature?.includes('Administration of Oath')
			),
			g_coun: services.filter(
				(d) => d.client?.ruralPoor && d.request?.nature?.includes('Legal Advice')
			),
			g_cust: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			g_inqu: services.filter(
				(d) =>
					d.client?.ruralPoor &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			h1_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,
			h1_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,
			h1_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,
			h1_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,
			h1_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,

			// New Cases/Clients this month
			h1_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,
			h1_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h1_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,
			h1_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h1_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,
			h1_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h1_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,
			h1_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h1_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
			).length,
			h1_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			h1_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h1_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h1_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h1_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h1_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Land-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			h1_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h1_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h1_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h1_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h1_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h1_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h1_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h1_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h1_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h1_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h1_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h1_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h1_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h1_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h1_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h1_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h1_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h1_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h1_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h1_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h1_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h1_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h1_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h1_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h1_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h1_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h1_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h1_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h1_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h1_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h1_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h1_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h1_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h1_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h1_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			h1_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			h1_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			h1_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.request?.nature?.includes('Legal Advice')
			),
			h1_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			h1_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Land-Based)') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			h2_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,
			h2_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,
			h2_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,
			h2_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,
			h2_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,

			// New Cases/Clients this month
			h2_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,
			h2_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h2_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,
			h2_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h2_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,
			h2_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h2_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,
			h2_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h2_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
			).length,
			h2_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			h2_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h2_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h2_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h2_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			h2_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('OFW (Sea-Based)'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			h2_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h2_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h2_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h2_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h2_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h2_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h2_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h2_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h2_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h2_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h2_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h2_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h2_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h2_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h2_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h2_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h2_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h2_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h2_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h2_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h2_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h2_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h2_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h2_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h2_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h2_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h2_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h2_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h2_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h2_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			h2_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			h2_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			h2_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			h2_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			h2_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			h2_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			h2_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			h2_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.request?.nature?.includes('Legal Advice')
			),
			h2_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			h2_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('OFW (Sea-Based)') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			i_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,
			i_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,
			i_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,
			i_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,
			i_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,

			// New Cases/Clients this month
			i_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,
			i_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			i_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,
			i_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			i_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,
			i_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			i_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,
			i_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			i_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
			).length,
			i_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			i_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			i_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			i_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			i_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			i_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('Senior Citizen'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			i_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			i_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			i_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			i_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			i_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			i_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			i_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			i_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			i_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			i_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			i_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			i_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			i_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			i_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			i_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			i_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			i_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			i_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			i_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			i_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			i_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			i_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			i_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			i_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			i_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			i_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			i_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			i_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			i_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			i_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			i_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			i_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			i_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			i_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			i_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			i_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			i_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			i_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.request?.nature?.includes('Legal Advice')
			),
			i_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			i_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('Senior Citizen') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			j_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,
			j_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,
			j_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,
			j_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,
			j_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,

			// New Cases/Clients this month
			j_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,
			j_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			j_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,
			j_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			j_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,
			j_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			j_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,
			j_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			j_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
					)
			).length,
			j_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			j_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			j_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			j_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			j_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			j_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Terrorism (R.A. No. 9372)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			j_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			j_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			j_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			j_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			j_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			j_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			j_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			j_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			j_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			j_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			j_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			j_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			j_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			j_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			j_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			j_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			j_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			j_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			j_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			j_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			j_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			j_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			j_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			j_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			j_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			j_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			j_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			j_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			j_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			j_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			j_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			j_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			j_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			j_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			j_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			j_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			j_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			j_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.request?.nature?.includes('Legal Advice')
			),
			j_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			j_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Terrorism (R.A. No. 9372)') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			k_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,
			k_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,
			k_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,
			k_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,
			k_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,

			// New Cases/Clients this month
			k_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,
			k_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			k_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,
			k_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			k_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,
			k_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			k_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,
			k_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			k_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Torture (R.A. No. 9745)')
					)
			).length,
			k_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			k_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			k_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			k_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			k_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			k_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Torture (R.A. No. 9745)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			k_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			k_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			k_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			k_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			k_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			k_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			k_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			k_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			k_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			k_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			k_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			k_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			k_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			k_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			k_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			k_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			k_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			k_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			k_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			k_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			k_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			k_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			k_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			k_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			k_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			k_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			k_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			k_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			k_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			k_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			k_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			k_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			k_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			k_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			k_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			k_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			k_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			k_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.request?.nature?.includes('Legal Advice')
			),
			k_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			k_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Torture (R.A. No. 9745)') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			l_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,
			l_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,
			l_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,
			l_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,
			l_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,

			// New Cases/Clients this month
			l_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,
			l_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			l_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,
			l_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			l_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,
			l_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			l_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,
			l_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			l_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
			).length,
			l_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('Rape Victim'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Case Disposition
			l_cvfi: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			l_crfi: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			l_ad1fi: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			l_ad2fi: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			l_ad3fi: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases for filing') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			l_cvte: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			l_crte: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			l_ad1te: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			l_ad2te: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			l_ad3te: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.case?.terminated?.includes('Cases considered closed and terminated') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			l_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			l_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			l_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Rape Victim') &&
					d.request?.nature?.includes('Legal Advice')
			),
			// Pending cases from previous months
			m_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,
			m_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,
			m_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,
			m_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,
			m_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,

			// New Cases/Clients this month
			m_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,
			m_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			m_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,
			m_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			m_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,
			m_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			m_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,
			m_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			m_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
					)
			).length,
			m_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			m_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			m_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			m_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			m_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			m_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Victim of Trafficking (R.A. No. 9208)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			m_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			m_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			m_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			m_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			m_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			m_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			m_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			m_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			m_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			m_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			m_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			m_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			m_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			m_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			m_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			m_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			m_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			m_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			m_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			m_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			m_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			m_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			m_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			m_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			m_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			m_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			m_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			m_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			m_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			m_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			m_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			m_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			m_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			m_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			m_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			m_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			m_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			m_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.request?.nature?.includes('Legal Advice')
			),
			m_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			m_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('Victim of Trafficking (R.A. No. 9208)') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			n_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,
			n_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,
			n_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,
			n_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,
			n_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,

			// New Cases/Clients this month
			n_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,
			n_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			n_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,
			n_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			n_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,
			n_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			n_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,
			n_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			n_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) =>
						c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
					)
			).length,
			n_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			n_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			n_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			n_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			n_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			n_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) =>
							c.classification?.includes('Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)')
						)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			n_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			n_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			n_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			n_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			n_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			n_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			n_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			n_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			n_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			n_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			n_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			n_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			n_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			n_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			n_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			n_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			n_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			n_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			n_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			n_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			n_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			n_crft: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			n_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			n_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			n_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			n_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			n_crut: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			n_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			n_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			n_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			n_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			n_crot: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			n_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			n_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			n_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			n_doc: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) && d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			n_oath: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) && d.request?.nature?.includes('Administration of Oath')
			),
			n_coun: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) && d.request?.nature?.includes('Legal Advice')
			),
			n_cust: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) && d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			n_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes(
						'Comprehensive Danngerous Drugs Act of 2002 (R.A. 9165)'
					) && d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			o_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,
			o_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,
			o_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,
			o_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,
			o_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,

			// New Cases/Clients this month
			o_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,
			o_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			o_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,
			o_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			o_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,
			o_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			o_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,
			o_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			o_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
			).length,
			o_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			o_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			o_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			o_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			o_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			o_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('Drug-Related Duty'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			o_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			o_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			o_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			o_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			o_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			o_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			o_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			o_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			o_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			o_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			o_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			o_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			o_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			o_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			o_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			o_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			o_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			o_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			o_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			o_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			o_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			o_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			o_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			o_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			o_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			o_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			o_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			o_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			o_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			o_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			o_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			o_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			o_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			o_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			o_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			o_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			o_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			o_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.request?.nature?.includes('Legal Advice')
			),
			o_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			o_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('Drug-Related Duty') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			p_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,
			p_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,
			p_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,
			p_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,
			p_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,

			// New Cases/Clients this month
			p_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,
			p_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			p_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,
			p_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			p_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,
			p_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			p_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,
			p_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			p_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
			).length,
			p_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			p_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			p_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			p_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			p_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			p_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('Agrarian Case Client'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			p_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			p_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			p_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			p_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			p_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			p_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			p_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			p_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			p_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			p_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			p_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			p_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			p_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			p_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			p_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			p_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			p_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			p_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			p_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			p_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			p_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			p_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			p_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			p_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			p_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			p_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			p_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			p_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			p_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			p_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			p_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			p_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			p_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			p_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			p_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			p_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			p_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			p_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.request?.nature?.includes('Legal Advice')
			),
			p_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			p_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('Agrarian Case Client') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			q_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,
			q_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,
			q_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,
			q_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,
			q_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,

			// New Cases/Clients this month
			q_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,
			q_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			q_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,
			q_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			q_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,
			q_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			q_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,
			q_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			q_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' &&
					d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
			).length,
			q_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			q_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			q_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			q_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			q_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			q_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' &&
						d.client?.filter((c: any) => c.classification?.includes('Refugee or Evacuee'))
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			q_crp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			q_cvp5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			q_ad1p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			q_ad2p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			q_ad3p5a: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			q_crp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			q_cvp5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			q_ad1p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			q_ad2p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			q_ad3p5b: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			q_crp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			q_cvp5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			q_ad1p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			q_ad2p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			q_ad3p5c: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			q_crp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			q_cvp5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			q_ad1p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			q_ad2p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			q_ad3p5d: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			q_cvft: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			q_crft: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			q_ad1ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			q_ad2ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			q_ad3ft: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			q_cvut: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			q_crut: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			q_ad1ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			q_ad2ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			q_ad3ut: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			q_cvot: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			q_crot: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			q_ad1ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			q_ad2ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			q_ad3ot: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			q_doc: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			q_oath: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.request?.nature?.includes('Administration of Oath')
			),
			q_coun: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.request?.nature?.includes('Legal Advice')
			),
			q_cust: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			q_inqu: services.filter(
				(d) =>
					d.client?.classification?.includes('Refugee or Evacuee') &&
					d.request?.otherNature?.includes('Assisted During Inquest Investigation')
			),
			// Pending cases from previous months
			r_crpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.foreignNational)
			).length,
			r_cvpen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.foreignNational)
			).length,
			r_ad1pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.foreignNational)
			).length,
			r_ad2pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.foreignNational)
			).length,
			r_ad3pen: pendingCasesFromPreviousMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.foreignNational)
			).length,

			// New Cases/Clients this month
			r_crneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Criminal' && d.client?.filter((c: any) => c.foreignNational)
			).length,
			r_crnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			r_cvneca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.foreignNational)
			).length,
			r_cvnecl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			r_ad1neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Administrative' &&
					d.client?.filter((c: any) => c.foreignNational)
			).length,
			r_ad1necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			r_ad2neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === "Prosecutor's office cases" &&
					d.client?.filter((c: any) => c.foreignNational)
			).length,
			r_ad2necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			r_ad3neca: newCasesForThisMonth.filter(
				(d: any) =>
					d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.foreignNational)
			).length,
			r_ad3necl: newCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),

			// Terminated Case
			r_crencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Criminal' &&
						d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			r_cvencl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Civil' && d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			r_ad1encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Administrative' &&
						d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			r_ad2encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === "Prosecutor's office cases" &&
						d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			r_ad3encl: endedCasesForThisMonth
				.filter(
					(d: any) =>
						d.case?.natureOfTheCase === 'Labor' && d.client?.filter((c: any) => c.foreignNational)
				)
				.map((d: any) => d.client.length)
				.reduce((a: any, b: any) => a + b, 0),
			// Cases pending, end
			r_crp5a: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			r_cvp5a: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			r_ad1p5a: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			r_ad2p5a: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			r_ad3p5a: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('On trial') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			r_crp5b: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			r_cvp5b: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			r_ad1p5b: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			r_ad2p5b: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			r_ad3p5b: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			r_crp5c: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			r_cvp5c: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			r_ad1p5c: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			r_ad2p5c: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			r_ad3p5c: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			r_crp5d: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			r_cvp5d: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			r_ad1p5d: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			r_ad2p5d: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			r_ad3p5d: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.pending?.includes('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			r_cvft: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			r_crft: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			r_ad1ft: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			r_ad2ft: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			r_ad3ft: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			r_cvut: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			r_crut: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			r_ad1ut: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			r_ad2ut: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			r_ad3ut: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			r_cvot: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Criminal')
			),
			r_crot: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Civil')
			),
			r_ad1ot: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Administrative')
			),
			r_ad2ot: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			r_ad3ot: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.case?.terminated?.includes('Other dispositions') &&
					d.case?.natureOfTheCase?.includes('Labor')
			),
			// 6 --> 10
			r_doc: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.request?.otherNature?.includes('Document/Pleadings Prepared')
			),
			r_oath: services.filter(
				(d) => d.client?.foreignNational && d.request?.nature?.includes('Administration of Oath')
			),
			r_coun: services.filter(
				(d) => d.client?.foreignNational && d.request?.nature?.includes('Legal Advice')
			),
			r_cust: services.filter(
				(d) =>
					d.client?.foreignNational &&
					d.request?.otherNature?.includes('Assisted During Custodial Interrogation')
			),
			r_inqu: services.filter(
				(d) =>
					d.client?.foreignNational &&
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
