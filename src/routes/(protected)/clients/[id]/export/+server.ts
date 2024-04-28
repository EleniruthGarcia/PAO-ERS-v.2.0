import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { RequestHandler } from './$types';
import { generateInterviewSheet } from '$lib/server/interview_sheet';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	const branch = await db.branches.findOne({ _id: event.locals.user.branch_id });
	const client = await db.clients
		.aggregate([
			{
				$match: { _id: event.params.id }
			},
			{
				$addFields: {
					age: { $dateDiff: { startDate: '$dateOfBirth', endDate: '$$NOW', unit: 'year' } }
				}
			}
		])
		.next();
	const requests = await db.requests.find({ client_id: event.params.id }).toArray();

	let data = await db.requests
		.aggregate([
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
				$match: { 'client._id': event.params.id }
			},
			{
				$lookup: {
					from: 'users',
					localField: 'lawyer_id',
					foreignField: '_id',
					as: 'lawyer'
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
					languageDialect: { $ifNull: ['$client.language', 'N/A'] },
					contactNo: { $ifNull: ['$client.contactNumber', 'N/A'] },
					spouse: { $ifNull: ['$client.spouseName', ''] },
					addressOfSpouse: { $ifNull: ['$client.spouseAddress', ''] },
					spouseContactNo: { $ifNull: ['$client.spouseContactNumber', ''] },
					placeOfDetention: '$client.detainedAt',
					proofOfIndigency: { $ifNull: ['$client.proofOfIndigency', []] },
					clientClasses: { $ifNull: ['$client.classification', []] },
					PDLStatus: '$client.detained',
					intervieweeName: '$interviewee.name',
					intervieweeAddress: '$interviewee.address',
					intervieweeAge: '$interviewee.age',
					intervieweeSex: '$interviewee.sex',
					intervieweeCivilStatus: '$interviewee.civilStatus',
					intervieweeContactNo: { $ifNull: ['$interviewee.contactNumber', 'N/A'] },
					intervieweeEmail: { $ifNull: ['$interviewee.email', ''] },
					relationshipToClient: '$relationshipToClient',
					natureOfRequest: '$natureOfRequest',
					natureOfTheCase: { $ifNull: ['$case.natureOfTheCase', ''] },
					caseSpecs: { $ifNull: ['$case._id', ''] },
					factsOfTheCase: { $ifNull: ['$case.factsOfTheCase', ''] },
					clientInvolvement: { $ifNull: ['$case.clientInvolvement', ''] },
					adverseParty: { $ifNull: ['$case.adversePartyInvolvement', ''] },
					adversePartyName: { $ifNull: ['$case.adversePartyName', 'N/A'] },
					adversePartyAddress: { $ifNull: ['$case.adversePartyAddress', 'N/A'] },
					// adversePartyName: {
					// 	$reduce: {
					// 		input: '$case.adversePartyName',
					// 		initialValue: '',
					// 		in: { $concat: ['$$value', '$$this'] }
					// 	}
					// },
					// adversePartyAddress: {
					// 	$reduce: {
					// 		input: '$case.adversePartyAddress',
					// 		initialValue: '',
					// 		in: { $concat: ['$$value', ', ', '$$this'] }
					// 	}
					// },
					natureOfOffence: { $ifNull: ['$case.natureOfOffence', ''] },
					courtPendingStatus: { $ifNull: ['$case.status', ''] },
					titleOfCaseDocketNum: {
						$cond: [
							{
								$and: [
									{ $eq: [{ $ifNull: ['$case.titleOfCase', ''] }, ''] },
									{ $eq: [{ $ifNull: ['$case.docketNumber', ''] }, ''] }
								]
							},
							'',
							{ $concat: ['$case.titleOfCase', ' (', '$case.docketNumber', ')'] }
						]
					},
					courtBodyTribunal: { $ifNull: ['$case.courtBody', ''] }
				}
			}
		])
		.toArray();

	if (!data) {
		redirect('/clients', { type: 'warning', message: 'Client not found!' }, event);
	}

	if (data.length === 0) {
		if (!branch || !client) {
			redirect('/clients', { type: 'warning', message: 'Client not found!' }, event);
		}

		data = [
			{
				monthYear: '',
				region: branch.region,
				districtProvince: `${branch.district}, ${branch.province}`,
				district: branch.district,
				province: branch.province,
				controlNo: '',
				religion: client?.religion || 'N/A',
				citizenship: client?.citizenship || 'N/A',
				name: client?.name,
				age: client?.age,
				address: client?.address,
				email: client?.email || '',
				individualMonthlyIncome: client?.individualMonthlyIncome?.toString() || 'N/A',
				detainedSince: client?.detainedSince,
				civilStatus: client?.civilStatus || 'N/A',
				sex: client?.sex,
				educationalAttainment: client?.educationalAttainment,
				languageDialect: client.language || 'N/A',
				contactNo: client?.contactNumber || 'N/A',
				spouse: client?.spouseName || '',
				addressOfSpouse: client?.spouseAddress || '',
				spouseContactNo: client?.spouseContactNumber || '',
				placeOfDetention: client?.detainedAt,
				proofOfIndigency: client?.proofOfIndigency || [],
				clientClasses: client?.classification || [],
				PDLStatus: client?.detained,
				intervieweeName: '',
				intervieweeAddress: '',
				intervieweeAge: '',
				intervieweeSex: '',
				intervieweeCivilStatus: '',
				intervieweeContactNo: '',
				intervieweeEmail: '',
				relationshipToClient: '',
				natureOfRequest: '',
				natureOfTheCase: '',
				caseSpecs: '',
				factsOfTheCase: '',
				clientInvolvement: '',
				adverseParty: '',
				adversePartyName: 'N/A',
				adversePartyAddress: 'N/A',
				natureOfOffence: '',
				courtPendingStatus: '',
				titleOfCaseDocketNum: '',
				courtBodyTribunal: ''
			}
		];
	}

	const interviewSheet = await generateInterviewSheet(data);

	return new Response(interviewSheet.blob, {
		headers: {
			'Content-Type': interviewSheet.type,
			'Content-Disposition': `attachment; filename*=UTF-8''${interviewSheet.name}`
		}
	});
};
