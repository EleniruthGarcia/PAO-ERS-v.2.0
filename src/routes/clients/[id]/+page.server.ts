import prisma from "$lib/prisma";
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    return { client: await prisma.client.findUnique({ where: { id: Number(params.id) } }) };
};

export const actions = {
    delete: async ({ params }) => {
        const client = await prisma.client.update({
            where: { id: Number(params.id) },
            data: { deletedAt: new Date(), deleted: true }
        });

        if (!client) {
            return fail(400, { notFound: true });
        }

        return { success: true };
    },
    edit: async ({ request, params }) => {
        const data = await request.formData();

        // required fields
        let name = data.get('name');
        let age = data.get('age');
        let sex = data.get('sex');
        let address = data.get('address');

        // optional fields
        let email = data.get('email');
        let contactNumber = data.get('contactNumber');
        let civilStatus = data.get('civilStatus');
        let religion = data.get('religion');
        let citizenship = data.get('citizenship');
        let educationalAttainment = data.get('educationalAttainment');
        let language = data.get('language');
        let individualMonthlyIncome = data.get('individualMonthlyIncome');
        let detained = data.get('detained');
        let detainedSince = data.get('detainedSince');
        let detainedAt = data.get('detainedAt');
        let spouseName = data.get('spouseName');
        let spouseAddress = data.get('spouseAddress');
        let spouseContactNumber = data.get('spouseContactNumber');

        // validation
        if (!name || !age || !sex || !address) {
            return fail(400, { missing: true });
        }

        if (typeof name !== 'string' || typeof Number(age) !== 'number' || typeof sex !== 'string' || typeof address !== 'string') {
            return fail(400, { invalid: true });
        }

        if (email && typeof email !== 'string') {
            return fail(400, { invalid: true });
        }

        if (contactNumber && typeof contactNumber !== 'string') {
            return fail(400, { invalid: true });
        }

        if (civilStatus && typeof civilStatus !== 'string') {
            return fail(400, { invalid: true });
        }

        if (religion && typeof religion !== 'string') {
            return fail(400, { invalid: true });
        }

        if (citizenship && typeof citizenship !== 'string') {
            return fail(400, { invalid: true });
        }

        if (educationalAttainment && typeof educationalAttainment !== 'string') {
            return fail(400, { invalid: true });
        }

        if (language && typeof language !== 'string') {
            return fail(400, { invalid: true });
        }

        if (individualMonthlyIncome && typeof Number(individualMonthlyIncome) !== 'number') {
            return fail(400, { invalid: true });
        }

        if (detainedSince && typeof detainedSince !== 'string') {
            return fail(400, { invalid: true });
        }

        if (detainedSince && !(new Date(String(detainedSince)))) {
            return fail(400, { invalid: true });
        }

        if (detainedAt && typeof detainedAt !== 'string') {
            return fail(400, { invalid: true });
        }

        if (spouseName && typeof spouseName !== 'string') {
            return fail(400, { invalid: true });
        }

        if (spouseAddress && typeof spouseAddress !== 'string') {
            return fail(400, { invalid: true });
        }

        if (spouseContactNumber && typeof spouseContactNumber !== 'string') {
            return fail(400, { invalid: true });
        }

        // save to database
        const client = await prisma.client.update({
            where: { id: Number(params.id) },
            data: { name, age: Number(age), sex, address, email, contactNumber, civilStatus, religion, citizenship, educationalAttainment, language, individualMonthlyIncome: individualMonthlyIncome ? Number(individualMonthlyIncome) : null, detained: detained !== null, detainedSince: detainedSince ? new Date(String(detainedSince)) : null, detainedAt, spouseName, spouseAddress, spouseContactNumber }
        });

        if (!client) {
            return fail(500, { error: true });
        }

        return { success: true }
    }
} satisfies Actions;
