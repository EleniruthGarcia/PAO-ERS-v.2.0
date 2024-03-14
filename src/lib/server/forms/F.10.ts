import type { Client } from '@prisma/client';

import ExcelJS from 'exceljs';

// F.10 - BRGY. Service Day Outreach Program

export const addRow = async (worksheet: ExcelJS.Worksheet | undefined, clients: Client[]) => {
	if (!worksheet) return;

	for (let i = 0; i < clients.length; i++) {
		const client = clients[i];
		worksheet.insertRow(14, [
			client.createdAt,
			`${client.lastName} ${client.nameSuffix ? client.nameSuffix : ''}, ${client.firstName} ${client.middleName ? client.middleName : ''}`,
			client.sex,
			'',
			'',
			''
		], 'o+');
	}
};
