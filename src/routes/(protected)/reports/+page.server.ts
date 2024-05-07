import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { generateReport } from '$lib/server/report';
import { formSchema } from '$lib/schema/report';
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
				month: Intl.DateTimeFormat('en', { month: 'long' }).format(new Date()),
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

const monthMap = {
	January: 0,
	February: 1,
	March: 2,
	April: 3,
	May: 4,
	June: 5,
	July: 6,
	August: 7,
	September: 8,
	October: 9,
	November: 10,
	December: 11
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

		const requests = await db.requests
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
				// {
				// 	$match: {
				// 		$or: [
				// 			{ 'request.status[-1].date': { $gte: new Date(form.data.year, monthMap[form.data.month], 1) } },
				// 			{ 'case.status[-1].date': { $lt: new Date(form.data.year, monthMap[form.data.month] + 1, 1) } }
				// 		]
				// 	}
				// },
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
						Judi: { $cond: [{ $in: ['$requests.nature', ['Representation', '']] }, 'X', ''] },
						Quasi: {
							$cond: [
								{ $in: ['$requests.nature', ['Representation in Court or Quasi-Judicial Bodies']] },
								'X',
								''
							]
						},
						NonJudi: {
							$cond: [
								{
									$in: [
										'$requests.nature',
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

		const f11 = requests.filter((d) => d.requests?.nature?.contains('Jail Visitation'));
		const f12 = '';
		const f13 = requests.filter((d) =>
			d.client?.classification?.includes('Child in Conflict with the Law')
		);
		const f14 = '';
		const f15 = requests.filter((d) =>
			d.client?.classification?.includes('Petitioner for Voluntary Rehabilitation')
		);
		const f16 = requests.filter((d) => d.client?.foreignNational?.contains('Taiwanese'));
		const f18 = requests.filter(
			(d) =>
				d.client?.classification?.includes('OFW') &&
				d.requests?.nature?.contains('Inquest Legal Assistance')
		);
		const f19 = {
			criminal: requests.filter((d) => d.case?.natureOfTheCase?.includes('Criminal')),
			civil: requests.filter((d) => d.case?.natureOfTheCase?.includes('Civil')),
			administrative: requests.filter((d) => d.case?.natureOfTheCase?.includes('Administrative')),
			prosecutor: requests.filter((d) =>
				d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			labor: requests.filter((d) => d.case?.natureOfTheCase?.includes('Labor'))
		};
		const f20 = requests.filter((d) => d.client?.PWD?.contains(true));
		const f21 = requests.filter((d) => d.request?.nature?.includes('Administration of Oath'));
		const f22 = requests.filter((d) => d.request?.nature?.includes('Others (PSA)'));
		const f23 = requests.filter((d) =>
			d.client?.classification?.includes('Denied or Disqualified')
		);
		const f24 = requests.filter((d) =>
			d.client?.classification?.includes('Beneficiary of Hernan Ruling (R.A. No. 10951)')
		);
		const f25 = requests.filter((d) => d.case?.genderCaseSubject?.includes(''));
		const f26 = '';
		const f27 = '';

		const f28 = {
			// (1) prev active cases from previous month
			// d.case?.natureOfTheCase?.contains('Criminal') &&

			// (2) new cases for this month
			// d.case?.natureOfTheCase?.contains('Criminal') &&
			// a_crnc:  requests.filter(
			// 	(d) =>
			// 		d.case?.natureOfTheCase?.contains('Criminal') &&
			// 		s.date?.getMonth() > form.data.month)?.length > 0,
			// (3) find the number of clients enclosed in these cases vvv, down here a_crcc
			a_crcc: requests
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.contains('Criminal')
				)
				.map((d) => d.client?.filter(Boolean))?.length,
			a_cvcc: requests
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.contains('Civil')
				)
				.map((d) => d.client?.filter(Boolean))?.length,
			a_ad1cc: requests
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.contains('Administrative')
				)
				.map((d) => d.client?.filter(Boolean))?.length,
			a_ad2cc: requests
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.contains("Prosecutor's office cases")
				)
				.map((d) => d.client?.filter(Boolean))?.length,
			a_ad3cc: requests
				.filter(
					(d) =>
						d.client?.classification?.includes('Child in Conflict with the Law') &&
						d.case?.natureOfTheCase?.contains('Labor')
				)
				.map((d) => d.client?.filter(Boolean))?.length,
			a_crp5a: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('On trial') &&
					d.case?.natureOfTheCase?.contains('Criminal')
			),
			a_cvp5a: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('On trial') &&
					d.case?.natureOfTheCase?.contains('Civil')
			),
			a_ad1p5a: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('On trial') &&
					d.case?.natureOfTheCase?.contains('Administrative')
			),
			a_ad2p5a: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('On trial') &&
					d.case?.natureOfTheCase?.contains("Prosecutor's office cases")
			),
			a_ad3p5a: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('On trial') &&
					d.case?.natureOfTheCase?.contains('Labor')
			),
			a_crp5b: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.contains('Criminal')
			),
			a_cvp5b: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.contains('Civil')
			),
			a_ad1p5b: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.contains('Administrative')
			),
			a_ad2p5b: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.contains("Prosecutor's office cases")
			),
			a_ad3p5b: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Submitted for decision/resolution') &&
					d.case?.natureOfTheCase?.contains('Labor')
			),
			a_crp5c: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.contains('Criminal')
			),
			a_cvp5c: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.contains('Civil')
			),
			a_ad1p5c: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.contains('Administrative')
			),
			a_ad2p5c: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.contains("Prosecutor's office cases")
			),
			a_ad3p5c: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Appealed case from MTC to RTC') &&
					d.case?.natureOfTheCase?.contains('Labor')
			),
			a_crp5d: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.contains('Criminal')
			),
			a_cvp5d: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.contains('Civil')
			),
			a_ad1p5d: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.contains('Administrative')
			),
			a_ad2p5d: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.contains("Prosecutor's office cases")
			),
			a_ad3p5d: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.pending?.contains('Cases referred to SACS') &&
					d.case?.natureOfTheCase?.contains('Labor')
			),
			a_cvft: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains('Criminal')
			),
			a_crft: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains('Civil')
			),
			a_ad1ft: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains('Administrative')
			),
			a_ad2ft: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains("Prosecutor's office cases")
			),
			a_ad3ft: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Favorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains('Labor')
			),
			a_cvut: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains('Criminal')
			),
			a_crut: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains('Civil')
			),
			a_ad1ut: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains('Administrative')
			),
			a_ad2ut: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains("Prosecutor's office cases")
			),
			a_ad3ut: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Unfavorable Dispositions to Clients') &&
					d.case?.natureOfTheCase?.contains('Labor')
			),
			a_cvot: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Other dispositions') &&
					d.case?.natureOfTheCase?.contains('Criminal')
			),
			a_crot: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Other dispositions') &&
					d.case?.natureOfTheCase?.contains('Civil')
			),
			a_ad1ot: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Other dispositions') &&
					d.case?.natureOfTheCase?.contains('Administrative')
			),
			a_ad2ot: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Other dispositions') &&
					d.case?.natureOfTheCase?.contains("Prosecutor's office cases")
			),
			a_ad3ot: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Other dispositions') &&
					d.case?.natureOfTheCase?.contains('Labor')
			),
			a_doc: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.otherNature?.contains('Document/Pleadings Prepared')
			),
			a_oath: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.nature?.contains('Administration of Oath')
			),
			a_coun: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.nature?.contains('Legal Advice')
			),
			a_cust: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.otherNature?.contains('Assisted During Custodial Interrogation')
			),
			a_inqu: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.otherNature?.contains('Assisted During Inquest Investigation')
			)
		};
		const f29 = requests.filter((d) => d.request?.nature?.includes('Others (PSA)'));

		const f31 = requests.filter((d) =>
			d.case?.terminated?.contains('Favorable Dispositions to Clients')
		);
		const f32 = requests.filter(
			(d) =>
				d.client?.detainedSince?.contains('') &&
				d.requests?.nature?.contains('Representation in Court or Quasi-Judicial Bodies')
		);
		const f33 = requests.filter((d) => d.case?.favorable?.contains(''));
		const f34 = {
			criminal: requests.filter((d) => d.case?.natureOfTheCase?.includes('Criminal')),
			civil: requests.filter((d) => d.case?.natureOfTheCase?.includes('Civil')),
			administrative: requests.filter((d) => d.case?.natureOfTheCase?.includes('Administrative')),
			prosecutor: requests.filter((d) =>
				d.case?.natureOfTheCase?.includes("Prosecutor's office cases")
			),
			labor: requests.filter((d) => d.case?.natureOfTheCase?.includes('Labor'))
		};
		const f35 = '';
		const f38 = requests.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));

		const f48 = {
			mr1a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On other grounds') &&
					d.client?.age < 18
			),
			mr1a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On other grounds') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr1a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On other grounds') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr1a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On other grounds') &&
					d.client?.age >= 60
			),
			fr1a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On other grounds') &&
					d.client?.age < 18
			),
			fr1a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On other grounds') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr1a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On other grounds') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr1a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On other grounds') &&
					d.client?.age >= 60
			),
			mr2a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age < 18
			),
			mr2a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr2a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr2a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 60
			),
			fr2a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age < 18
			),
			fr2a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr2a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr2a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'On recognizance after service of minimum sentence'
					) &&
					d.client?.age >= 60
			),
			mr3a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('Due to provisional dismissal of case') &&
					d.client?.age < 18
			),
			mr3a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('Due to provisional dismissal of case') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr3a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('Due to provisional dismissal of case') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr3a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('Due to provisional dismissal of case') &&
					d.client?.age >= 60
			),
			fr3a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('Due to provisional dismissal of case') &&
					d.client?.age < 18
			),
			fr3a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('Due to provisional dismissal of case') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr3a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('Due to provisional dismissal of case') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr3a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('Due to provisional dismissal of case') &&
					d.client?.age >= 60
			),
			mr4a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age < 18
			),
			mr4a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr4a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr4a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 60
			),
			fr4a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age < 18
			),
			fr4a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr4a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr4a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'On account of preventive imprisonment equal to maximum imposable penalty'
					) &&
					d.client?.age >= 60
			),
			mr5a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age < 18
			),
			mr5a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr5a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr5a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 60
			),
			fr5a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age < 18
			),
			fr5a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr5a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr5a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains(
						'Due to complete service of sentence (Case is terminated)'
					) &&
					d.client?.age >= 60
			)
		};

		const f49 = requests.filter((d) => d.request?.nature?.includes('Others (PSA)'));

		const f50 = '';
		const f51 = requests.filter((d) => d.request?.nature?.includes('Home Visitation'));
		const f52 = '';

		return {
			form,
			report: await generateReport({
				...branch,
				lawyer,
				month: form.data.month,
				year: form.data.year,
				notedBy,
				assignedCourts: new Set(requests.map((d) => d.case?.court).filter(Boolean)),
				f10: outreaches,
				f11,
				f13,
				f15,
				f16,
				f17: [...requests, ...outreaches],
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
				f35: [...requests, ...outreaches],
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
