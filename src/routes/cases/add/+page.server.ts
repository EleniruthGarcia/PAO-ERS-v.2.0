import prisma from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		requests: prisma.request.findMany({ where: { deletedAt: null }, include: { client: true } })
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/');
		}

		const data = await request.formData();

		// required fields
		let requestId = data.get('requestId');

		// optional fields
		let criminal = data.get('Criminal');
		let administrative = data.get('Administrative');
		let civil = data.get('Civil');
		let appealed = data.get('Appealed');
		let labor = data.get('Labor');
		let additionalInformation = data.get('addInfo');

		let plaintiff = data.get('plaintiff');
		let defendant = data.get('defendant');
		let oppositor = data.get('oppositor');
		let advName = data.get('advName');

		let facts = data.get('facts');
		let coa = data.get('coa');

		let pending = data.get('pending');

		let caseTitle = data.get('caseTitle');
		let docketNumber = data.get('docketNumber');
		let court = data.get('court');

		let incomeTaxReturn = data.get('Income Tax Return');
		let certificateOfBarangay = data.get('Certificate of Barangay');
		let cetrificateFromDSWD = data.get('Cetrificate from DSWD');
		let others = data.get('Others');
		let otherProof = data.get('otherProof');

		// validation
		if (!requestId) {
			return fail(400, { missing: true });
		}

		if (
			typeof firstName !== 'string' ||
			typeof lastName !== 'string' ||
			typeof Number(age) !== 'number' ||
			typeof sex !== 'string' ||
			typeof address !== 'string'
		) {
			return fail(400, { invalid: true });
		}

		// save to database
		const client = await prisma.case.create({
			data: {
				requestId: Number(requestId),
				title: caseTitle,
				docketNumber,
			}
		});

		if (!client) {
			return fail(500, { error: true });
		}

		return { success: true };
	}
} satisfies Actions;
