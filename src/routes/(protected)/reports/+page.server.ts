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

		const outreaches = await db.outreaches.find().toArray();

		const requests = await db.requests.aggregate([
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
					lawyer: { $arrayElemAt: ['$lawyer', 0] },
				}
			},
			{
				$match: { 'lawyer._id': event.locals.user.role === 'Administrator' ? '' : event.locals.user.id }
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
				$unwind: '$client',
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
					individualMonthlyIncome: { $toString: { $ifNull: ['$client.individualMonthlyIncome', 'N/A'] } },
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
					adversePartyName: { $ifNull: ["$case.adversePartyName", "N/A"] },
					adversePartyAddress: { $ifNull: ["$case.adversePartyAddress", "N/A"] },
					natureOfOffence: { $ifNull: ['$case.natureOfOffence', ''] },
					courtPendingStatus: { $ifNull: ['$case.status', ''] },
					titleOfCaseDocketNum: { $concat: ['$case.titleOfCase', ' (', '$case.docketNumber', ')'] },
					court: { $ifNull: ['$case.court', ''] },
					status: '$case.status',
					titleOfCase: '$case.titleOfCase',
					caseNo: '$case.docketNumber',
					assistance: '$request.typeOfAssistance',
					actionTaken: { $ifNull: ['$case.actionTaken', ''] },
					CICL: { $cond: [ {$in: ['Child in Conflict with the Law', '$client.classification'] }, 'X', '']},
					Women: { $cond: [ {$in:['Women', '$client.classification'] }, 'X', ''] },
					IG: { $ifNull: ['$client.indigenousPeople', ''] },
					PWD: { $ifNull: ['$client.pwd', ''] },
					UP: { $ifNull: ['$client.urbanPoor', ''] },
					RP: { $ifNull: ['$client.ruralPoor', ''] },
					Senior: { $cond: [ {$in: ['Senior Citizen', '$client.classification']}, 'X', ''] },
					OFW: { $cond: [ {$in: ['OFW (Land-Based)', '$client.classification', 'OFW (Sea-Based)', '$client.classification']}, 'X', ''] },
					Judi: '',
					Quasi: '',
					NonJudi: ''
				}
			}
		]).toArray();

		const f11 = requests.filter((d) => d.natureOfRequest?.includes('Jail Visitation'));
		const f12 = '';
		const f13 = requests.filter((d) => d.client?.classification?.includes('Child in Conflict with the Law'));
		const f14 = '';
		const f15 = requests.filter((d) => d.client?.classification?.includes('Petitioner for Voluntary Rehabilitation'));
		const f16 = requests.filter((d) => d.client?.foreignNational?.contains('Taiwanese'));
		const f18 = requests.filter((d) => d.client?.classification?.includes('OFW') && d.requests?.nature?.contains('Inquest Legal Assistance'));
		const f19 = {
			criminal: requests.filter((d) => d.case?.natureOfTheCase?.contains('Criminal')),
			civil: requests.filter((d) => d.case?.natureOfTheCase?.contains('Civil')),
			administrative: requests.filter((d) => d.case?.natureOfTheCase?.contains('Administrative')),
			prosecutor: requests.filter((d) => d.case?.natureOfTheCase?.contains('Administrative')),
			labor: requests.filter((d) => d.case?.natureOfTheCase?.contains('Labor')),
		};
		const f20 = requests.filter((d) => d.client?.PWD?.contains(true));
		const f21 = requests.filter((d) => d.request?.natureOfRequest?.includes('Administration of Oath'));
		const f22 = requests.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));

		const f28 = {
			i: {
				a: {
					total: f13.length,
					cr: f13.filter((d) => d.case?.natureOfTheCase?.includes('Criminal')).length,
					cv: f13.filter((d) => d.case?.natureOfTheCase?.includes('Civil')).length,
					ad1: f13.filter((d) => d.case?.natureOfTheCase?.includes('Administrative')).length,
					ad2: f13.filter((d) => d.case?.natureOfTheCase?.includes('Prosecutor')).length,
					ad3: f13.filter((d) => d.case?.natureOfTheCase?.includes('Labor')).length,
					5: {
						a: {
							total: f13.length,
							cr: f13.filter((d) => d.case?.pendingStatus?.includes('') && d.case?.natureOfTheCase?.includes('Criminal')).length,
							cv: f13.filter((d) => d.case?.natureOfTheCase?.includes('Civil')).length,
							ad1: f13.filter((d) => d.case?.natureOfTheCase?.includes('Administrative')).length,
							ad2: f13.filter((d) => d.case?.natureOfTheCase?.includes('Prosecutor')).length,
							ad3: f13.filter((d) => d.case?.natureOfTheCase?.includes('Labor')).length,
						}
					},
					2: f13.filter((d) => d.case?.natureOfTheCase?.includes('Civil')).length,
					3: requests.filter((d) => d.case?.natureOfTheCase?.includes('Others (PSA)')).length,
				}
			} // ${f28.i.a.5.a.cr}
		};
		const f29 = requests.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));

		const f38 = requests.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));
		const f48 = requests.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));
		const f49 = requests.filter((d) => d.request?.natureOfRequest?.includes('Others (PSA)'));
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
				f17: [...requests, ...outreaches],
				f18,
				f19,
				f20,
				f21,
				f28,
				f29,
				f38,
				f48,
				f49
			})
		};
	}
} satisfies Actions;
