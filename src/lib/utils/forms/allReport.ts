import ExcelJS from 'exceljs';
import { Prisma } from '@prisma/client';

import template from '$lib/assets/reports.xlsx?url';

import * as F10 from './F.10';
import * as F11 from './F.11';
import * as F17 from './F.17';

const clientWithRequestAndCase = Prisma.validator<Prisma.ClientDefaultArgs>()({
	include: {
		request: {
			include: {
				case: true
			}
		}
	}
});

type ClientWithRequestAndCase = Prisma.ClientGetPayload<typeof clientWithRequestAndCase>;

export const generateReports = async (clients: ClientWithRequestAndCase[]) => {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.readFile(template);

	await F10.addRow(workbook.getWorksheet('F.10'), clients);
	await F11.addRow(workbook.getWorksheet('F.11'), clients);
	await F17.addRow(workbook.getWorksheet('F.17'), clients);

	return (await workbook.xlsx.writeBuffer()) as Buffer;
};
