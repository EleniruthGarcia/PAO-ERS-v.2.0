import prisma from "$lib/server/prisma";
import { generateReports } from "$lib/utils/forms/allReport";

import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        let month = data.get('month');

        if (!month) {
            return fail(400, { missing: true });
        }

        if (typeof month !== 'string') {
            return fail(400, { invalid: true });
        }

        const gte = new Date(`${month}-01`);
        const lt = new Date(`${month}-01`);

        const clients = await prisma.client.findMany({
            where: {
                // createdAt: { gte, lt }
            },
        });

        const report = await generateReports(clients);

        return { success: true, report: report.toString('base64') };
    }
} satisfies Actions;