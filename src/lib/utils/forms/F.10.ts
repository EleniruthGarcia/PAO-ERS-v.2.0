import type { Client } from '@prisma/client';

import ExcelJS from 'exceljs';

// F.10 - BRGY. Service Day Outreach Program
export const addRow = async (worksheet: ExcelJS.Worksheet | undefined, clients: Client[]) => {
	if (!worksheet) return;

	for (let i = 0; i < clients.length; i++) {
		const client = clients[i];
		worksheet.insertRow(14, [
			`${client.id}`,
			`${client.firstName} ${client.middleName ? client.middleName : ''} ${client.lastName} ${client.nameSuffix ? client.nameSuffix : ''}`,
			client.address,
			client.age,
			client.sex,
			client.contactNumber ? client.contactNumber : '',
			client.email ? client.email : '',
		], 'o');
	}
};
