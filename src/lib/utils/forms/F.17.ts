import type { Client } from '@prisma/client';

import ExcelJS from 'exceljs';

// F.17 - Monthly Inventory of Clients Served

export const addRow = async (worksheet: ExcelJS.Worksheet | undefined, clients: Client[]) => {
	if (!worksheet) return;

	const client = await prisma.client.findMany({
    where: {
        // createdAt: { gte, lt }
    },
    include: {
        request: {
            include:{
                case: true
            }
        }
    }
  });

	for (let l = 0; l < client.length; l++) {
    const basic = client[l];
    const request = client[l].request;
    for (let m = 0; m < request.length; m++) {
      const cases = request[m].case;
      for (let n = 0; n < cases.length; n++) {
        const info = cases[n];
        worksheet.insertRow(15, [
					`${basic.id}`,
					`${basic.lastName} ${basic.nameSuffix ? basic.nameSuffix : ''}, ${basic.firstName} ${basic.middleName ? basic.middleName : ''}`,
					basic.address,
					basic.age,
					basic.sex,
					basic.contactNumber ? basic.contactNumber : '',
					basic.email ? basic.email : '',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					`${info.lastActionTaken ? info.lastActionTaken : ''}`,
					`${info.title ? info.title : ''}`,
					`${info.id ? info.id : ''}`,
					`${info.status ? info.status : ''}`,
					`${info.nature ? info.nature : ''}`
				], 'o+');
      }
    }

  }

	for (let i = 0; i < clients.length; i++) {
		const client = clients[i];
		worksheet.insertRow(15, [
			`${client.id}`,
			`${client.firstName} ${client.middleName ? client.middleName : ''} ${client.lastName} ${client.nameSuffix ? client.nameSuffix : ''}`,
			client.address,
			client.age,
			client.sex,
			client.contactNumber ? client.contactNumber : '',
			client.email ? client.email : '',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			''
		], 'o');
	}
};
