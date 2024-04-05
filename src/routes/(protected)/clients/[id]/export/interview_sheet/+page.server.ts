import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { generateInterviewSheet } from '$lib/server/interview_sheet';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', '/clients/' + event.params.id, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	const client = await db.clients.findOne({ _id: event.params.id });
	if (!client) {
		redirect('/clients', { type: 'warning', message: 'Client not found!' }, event);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/clients', text: 'Clients' },
			{
				href: '/clients/' + event.params.id,
				text: client.name
			},
			{ href: '/clients/' + event.params.id + '/export', text: `Export ${client.name}` }
		],
		client
	};
};

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', '/clients/' + event.params.id, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const data = await db.requests.aggregate([{
			$match: { _id: event.params.id },
			$lookup: {
				from: 'clients',
				localField: 'client_id',
				foreignField: '_id',
				as: 'clients'
			}
		}]);

		// branch data
		// region,
		// districtProvince,
		// district,
		// province,
		// controlNo,

		// // client data
		// religion,
		// citizenship,
		// name,
		// age,
		// address,
		// email,
		// individualMonthlyIncome,
		// detainedSince,
		// civilStatus,
		// sex,
		// educationalAttainment,
		// languageDialect,
		// contactNo,
		// spouse,
		// addressOfSpouse,
		// spouseContactNo,
		// placeOfDetention,
		// proofOfIndigency,

		// // interviewee data
		// intervieweeName,
		// intervieweeAddress,
		// relationshipToClient,
		// intervieweeAge,
		// intervieweeSex,
		// intervieweeCivilStatus,
		// intervieweeContactNo,
		// intervieweeEmail,

		// // nature of request
		// natureOfRequest,
		// otherNatureOfRequest,
		// PDLStatus, // from client.detained
		// natureOfTheCase,
		// caseSpecs,

		// // client class
		// clientClasses,
		// clientInvolvement,

		// adverseParty,
		// adversePartyName,
		// factsOfTheCase,
		// natureOfOffence,
		// courtPendingStatus,
		// titleOfCaseDocketNum,
		// courtBodyTribunal,

		if (!data) return fail(404);

		return { interview_sheet: await generateInterviewSheet(data) };
	}
} satisfies Actions;
