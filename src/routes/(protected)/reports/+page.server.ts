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
		form: await superValidate({
			month: Intl.DateTimeFormat('en', { month: 'long' }).format(new Date()),
			year: new Date().getFullYear(),
			notedBy: event.locals.user.reportsTo,
			reports: []
		}, zod(formSchema), { errors: false }),
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
						localField: 'case_id',
						foreignField: '_id',
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
						age: {
							$dateDiff: { startDate: '$client.dateOfBirth', endDate: '$$NOW', unit: 'year' }
						},
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
						CICL: { $cond: [{ $in: ['Child in Conflict with the Law', '$client.classification'] }, 'X', ''] },
						Women: { $cond: [{ $in: ['Women', '$client.classification'] }, 'X', ''] },
						IG: { $cond: [{ $ifNull: ['$client.indigenousPeople', 'true'] }, '', 'X'] },
						PWD: { $cond: [{ $ifNull: ['$client.pwd', 'true'] }, '', 'X'] },
						UP: { $cond: [{ $ifNull: ['$client.urbanPoor', 'true'] }, '', 'X'] },
						RP: { $cond: [{ $ifNull: ['$client.ruralPoor', 'true'] }, '', 'X'] },
						Senior: { $cond: [{ $in: ['Senior Citizen', '$client.classification'] }, 'X', ''] },
						// OFW: { $cond: [{ $in: ['OFW (Land-Based)', '$client.classification', 'OFW (Sea-Based)', '$client.classification'] }, 'X', ''] },
						Judi: '',
						Quasi: '',
						NonJudi: ''
					}
				}
			])
			.toArray();

		const f11 = requests.filter((d) => d.natureOfRequest?.includes('Jail Visitation'));
		const f12 = '';
		const f13 = requests.filter((d) =>
			d.client?.classification?.includes('Child in Conflict with the Law')
		);
		const f14 = '';
		const f15 = requests.filter((d) =>
			d.client?.classification?.includes('Petitioner for Voluntary Rehabilitation')
		);
		const f16 = requests.filter((d) => d.client?.foreignNational?.includes('Taiwanese'));
		const f18 = requests.filter(
			(d) =>
				d.client?.classification?.includes('OFW') &&
				d.requests?.nature?.contains('Inquest Legal Assistance')
		);
		const f19 = {
			criminal: requests.filter((d) => d.case?.natureOfTheCase?.includes('Criminal')),
			civil: requests.filter((d) => d.case?.natureOfTheCase?.includes('Civil')),
			administrative: requests.filter((d) => d.case?.natureOfTheCase?.includes('Administrative')),
			prosecutor: requests.filter((d) => d.case?.natureOfTheCase?.includes('Prosecutor\'s office cases')),
			labor: requests.filter((d) => d.case?.natureOfTheCase?.includes('Labor'))
		};
		const f20 = requests.filter((d) => d.client?.PWD?.contains(true));
		const f21 = requests.filter((d) =>
			d.request?.natureOfRequest?.includes('Administration of Oath')
		);
		const f22 = requests.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));
		const f23 = '';
		const f24 = '';
		const f25 = '';
		const f26 = '';
		const f27 = '';

		const f28 = {
			acvt : requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Favorable Dispositions to Clients') && 
					d.case?.natureOfTheCase?.contains('Criminal')
			),
			acrt : requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Favorable Dispositions to Clients') && 
					d.case?.natureOfTheCase?.contains('Civil')
			),
			aadt : requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.case?.terminated?.contains('Favorable Dispositions to Clients') && 
					d.case?.natureOfTheCase?.contains('Criminal')
			),
			adoc: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.otherNature?.contains('Document/Pleadings Prepared')
			),
			aoath: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.nature?.contains('Administration of Oath')
			),
			acoun: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.nature?.contains('Legal Advice')
			),
			acust: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.otherNature?.contains('Assisted During Custodial Interrogation')
			),
			ainqu: requests.filter(
				(d) =>
					d.client?.classification?.includes('Child in Conflict with the Law') &&
					d.request?.otherNature?.contains('Assisted During Inquest Investigation')
			),

		};
		const f29 = requests.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));
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
					d.requests?.typeOfRelease?.contains('On recognizance after service of minimum sentence') &&
					d.client?.age < 18
			),
			mr2a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On recognizance after service of minimum sentence') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr2a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On recognizance after service of minimum sentence') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr2a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On recognizance after service of minimum sentence') &&
					d.client?.age >= 60
			),
			fr2a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On recognizance after service of minimum sentence') &&
					d.client?.age < 18
			),
			fr2a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On recognizance after service of minimum sentence') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr2a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On recognizance after service of minimum sentence') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr2a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On recognizance after service of minimum sentence') &&
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
					d.requests?.typeOfRelease?.contains('On account of preventive imprisonment equal to maximum imposable penalty') &&
					d.client?.age < 18
			),
			mr4a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On account of preventive imprisonment equal to maximum imposable penalty') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr4a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On account of preventive imprisonment equal to maximum imposable penalty') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr4a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('On account of preventive imprisonment equal to maximum imposable penalty') &&
					d.client?.age >= 60
			),
			fr4a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On account of preventive imprisonment equal to maximum imposable penalty') &&
					d.client?.age < 18
			),
			fr4a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On account of preventive imprisonment equal to maximum imposable penalty') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr4a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On account of preventive imprisonment equal to maximum imposable penalty') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr4a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('On account of preventive imprisonment equal to maximum imposable penalty') &&
					d.client?.age >= 60
			),
			mr5a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('Due to complete service of sentence (Case is terminated)') &&
					d.client?.age < 18
			),
			mr5a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('Due to complete service of sentence (Case is terminated)') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			mr5a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('Due to complete service of sentence (Case is terminated)') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			mr5a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Male' &&
					d.requests?.typeOfRelease?.contains('Due to complete service of sentence (Case is terminated)') &&
					d.client?.age >= 60
			),
			fr5a1: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('Due to complete service of sentence (Case is terminated)') &&
					d.client?.age < 18
			),
			fr5a2: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('Due to complete service of sentence (Case is terminated)') &&
					d.client?.age >= 18 &&
					d.client?.age <= 21
			),
			fr5a3: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('Due to complete service of sentence (Case is terminated)') &&
					d.client?.age >= 22 &&
					d.client?.age <= 59
			),
			fr5a4: requests.filter(
				(d) =>
					d.client?.detained &&
					d.client?.sex === 'Female' &&
					d.requests?.typeOfRelease?.contains('Due to complete service of sentence (Case is terminated)') &&
					d.client?.age >= 60
			),
		};

		const f49 = requests.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));

		const f50 = '';
		const f51 = '';
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
				f38,
				f48,
				f49
			})
		};
	}
} satisfies Actions;
