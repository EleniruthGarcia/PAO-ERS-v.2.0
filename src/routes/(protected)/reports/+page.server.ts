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
		event.cookies.set('redirect', '/dashboard', { path: '/' });
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
		form: await superValidate(zod(formSchema))
	};
};

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', '/reports', { path: '/' });
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

		const outreaches = await db.outreaches.aggregate([]).toArray();

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
				{
					$match: { 'lawyer._id': event.locals.user.id }
				},
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
						lawyer: { $arrayElemAt: ['$lawyer', 0] },
						interviewee: { $arrayElemAt: ['$interviewee', 0] },
						case: { $arrayElemAt: ['$case', 0] }
					}
				},
				{
					$project: {
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
						adversePartyName: {
							$reduce: {
								input: '$case.adversePartyName',
								initialValue: '',
								in: { $concat: ['$$value', '$$this'] }
							}
						},
						adversePartyAddress: {
							$reduce: {
								input: '$case.adversePartyAddress',
								initialValue: '',
								in: { $concat: ['$$value', ', ', '$$this'] }
							}
						},
						natureOfOffence: { $ifNull: ['$case.natureOfOffence', ''] },
						courtPendingStatus: { $ifNull: ['$case.status', ''] },
						titleOfCaseDocketNum: {
							$concat: ['$case.titleOfCase', ' (', '$case.docketNumber', ')']
						},
						courtBodyTribunal: { $ifNull: ['$case.courtBody', ''] }
					}
				}
			])
			.toArray();

		const f11 = requests.filter((d) => d.natureOfRequest.contains('Jail Visitation'));
		const f12 = '';
		const f13 = requests.filter((d) => d.client.classifcation.contains('Child Client'));
		const f14 = '';
		const f15 = requests.filter((d) =>
			d.client.classification.contains('Petitioner for Voluntary Rehabilitation')
		);
		const f16 = requests.filter((d) => d.client.foreignNational.contains('Taiwanese'));
		const f18 = requests.filter(
			(d) =>
				d.client.classification.contains('OFW') &&
				d.requests.nature.contains('Inquest Legal Assistance')
		);
		const f19 = '';
		const f20 = requests.filter((d) => d.client.PWD.contains(true));
		const f21 = requests.filter((d) =>
			d.request.natureOfRequest.contains('Administration of Oath')
		);

		return {
			form,
			report: await generateReport({
				...branch,
				lawyer,
				month: form.data.months,
				year: form.data.year,
				notedBy: form.data.notedBy,
				f10: outreaches,
				f11,
				f13,
				f15,
				f16,
				f17: { ...requests, ...outreaches },
				f18,
				f20,
				f21
			})
		};
	}
} satisfies Actions;
