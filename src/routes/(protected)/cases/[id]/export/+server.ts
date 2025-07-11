import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { ServiceHandler } from './$types';
import { generateInterviewSheet } from '$lib/server/interview_sheet';

export const GET: ServiceHandler = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	let data = await db.services
		.aggregate([
			{
				$match: { _id: event.params.id }
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
					// monthYear: {
					// 	$dateToString: {
					// 		date: '$date',
					// 		format: '%B %Y',
					// 		timezone: '+08:00',
					// 		onNull: 'N/A'
					// 	}
					// },
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
					// age: { $dateDiff: { startDate: '$client.dateOfBirth', endDate: '$$NOW', unit: 'year' } },
					age: '$client.age',
					address: '$client.address',
					email: { $ifNull: ['$client.email', ''] },
					individualMonthlyIncome: {
						$toString: { $ifNull: ['$client.individualMonthlyIncome', 'N/A'] }
					},
					detainedSince: {
						$dateToString: {
							date: '$client.detainedSince',
							format: '%B %d, %Y',
							timezone: '+08:00',
							onNull: 'N/A'
						}
					},
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
					lawEnforcer: '$client.lawEnforcer',
					foreignNational: '$client.foreignNational',
					pwd: '$client.pwd',
					indigenousPeople: '$client.indigenousPeople',
					urbanPoor: '$client.urbanPoor',
					ruralPoor: '$client.ruralPoor',
					PDLStatus: '$client.detained',
					intervieweeName: { $ifNull: ['$interviewee.name', '$client.name'] },
					intervieweeAddress: { $ifNull: ['$interviewee.address', '$client.address'] },
					intervieweeAge: {
						$ifNull: [
							'$interviewee.age',
							{ $dateDiff: { startDate: '$client.dateOfBirth', endDate: '$$NOW', unit: 'year' } },
							'N/A'
						]
					},
					intervieweeSex: { $ifNull: ['$interviewee.sex', '$client.sex'] },
					intervieweeCivilStatus: { $ifNull: ['$interviewee.civilStatus', '$client.civilStatus'] },
					intervieweeContactNo: { $ifNull: ['$interviewee.contactNumber', 'N/A'] },
					intervieweeEmail: { $ifNull: ['$interviewee.email', ''] },
					relationshipToClient: '$relationshipToClient',
					natureOfService: '$nature',
					natureOfTheCase: { $ifNull: ['$case.natureOfTheCase', ''] },
					otherNature: { $ifNull: ['$case.otherNature', ''] },
					caseSpecs: { $ifNull: ['$case._id', ''] },
					factsOfTheCase: {
						$concat: [
							{ $ifNull: ['$additionalNotes', ''] },
							'\n',
							{ $ifNull: ['$case.factsOfTheCase', ''] }
						]
					},
					causeOfActionOrNatureOfOffence: { $ifNull: ['$case.causeOfActionOrNatureOfOffence', ''] },
					clientInvolvement: { $ifNull: ['$case.clientInvolvement', ''] },
					adversePartyInvolvement: { $ifNull: ['$case.adversePartyInvolvement', ''] },
					adversePartyName: { $ifNull: ['$case.adversePartyName', 'N/A'] },
					adversePartyAddress: { $ifNull: ['$case.adversePartyAddress', 'N/A'] },
					pendingInCourt: { $ifNull: ['$case.pendingInCourt', ''] },
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
						$ifNull: [
							{
								$cond: [
									{
										$and: [
											{ $eq: [{ $ifNull: ['$case.titleOfTheCase', ''] }, ''] },
											{ $eq: [{ $ifNull: ['$case.docketNumber', ''] }, ''] }
										]
									},
									'',
									{ $concat: ['$case.titleOfTheCase', ' (', '$case.docketNumber', ')'] }
								]
							},
							''
						]
					},
					court: { $ifNull: ['$case.court', ''] }
				}
			}
		])
		.toArray();

	if (!data) {
		redirect('/services', { type: 'warning', message: 'Service not found!' }, event);
	}

	const interviewSheet = await generateInterviewSheet(data);

	return new Response(interviewSheet.blob, {
		headers: {
			'Content-Type': interviewSheet.type,
			'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(interviewSheet.name)
				.replace(/['()]/g, escape)
				.replace(/\*/g, '%2A')
				.replace(/%(?:7C|60|5E)/g, unescape)}`
		}
	});
};
