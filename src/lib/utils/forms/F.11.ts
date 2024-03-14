import type { Client } from '@prisma/client';

import ExcelJS from 'exceljs';

// F.10 - BRGY. Service Day Outreach Program

export const addRow = async (worksheet: ExcelJS.Worksheet | undefined, clients: Client[]) => {
	if (!worksheet) return;

  // const join = await prisma.client.findMany{
  //   where: {
  //   }
  //   include: {
  //     request: {
  //       include: {
  //         case: true
  //       }
  //     }
  //   },
  // };

	for (let i = 0; i < clients.length; i++) {
		const client = clients[i];
		worksheet.insertRow(13, [
			'',
			`${client.firstName} ${client.middleName ? client.middleName : ''} ${client.lastName} ${client.nameSuffix ? client.nameSuffix : ''}`,
			client.sex,
			client.detainedSince,
      '',
			'',
      '',
      client.detainedAt,
      '',
			''
		], 'o');
	}
};
