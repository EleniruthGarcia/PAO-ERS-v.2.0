import type { Client } from '@prisma/client';

import ExcelJS from 'exceljs';

// F.10 - BRGY. Service Day Outreach Program

export const addRowTitle = async (worksheet: ExcelJS.Worksheet) => {
	worksheet.getCell('A9').value = 'DATE';
	worksheet.getCell('B9').value = 'NAME OF BENEFICIARIES';
	worksheet.getCell('C9').value = 'GENDER/SEX';
	worksheet.getCell('D9').value = 'PROBLEM/S PRESENTED';
	worksheet.getCell('E9').value = 'ACTIVITIES UNDERTAKEN/ACTION TAKEN';
	worksheet.getCell('F9').value = 'REMARKS';
};

export const addRow = async (worksheet: ExcelJS.Worksheet, clients: Client[]) => {
	// console.log(clients);
	for (let i = 0; i < clients.length; i++) {
		const client = clients[i];
		console.log(client.id);
		const row = worksheet.insertRow(i + 13, [
			{
				id: `${client.id}`,
				name: `${client.firstName} ${client.middleName ? client.middleName : ''} ${client.lastName} ${client.nameSuffix ? client.nameSuffix : ''}`,
				address: client.address,
				age: client.age,
				gender: client.sex,
				contact: client.contactNumber ? client.contactNumber : '',
				email: client.email ? client.email : '',
				cicl: '',
				women: '',
				ig: '',
				pwd: '',
				upoor: '',
				rpoor: '',
				senior: '',
				ofw: '',
				judi: '',
				quasi: '',
				nonjudi: '',
				action: '',
				title: '',
				case: '',
				status: '',
				nature: ''
			}
		]);
		row.font = { bold: false };
	}

	return worksheet;
};
