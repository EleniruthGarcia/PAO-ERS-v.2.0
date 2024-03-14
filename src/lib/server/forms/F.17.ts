import { Prisma } from '@prisma/client';

import ExcelJS from 'exceljs';

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

// F.17 - Monthly Inventory of Clients Served

export const addRow = async (worksheet: ExcelJS.Worksheet | undefined, clients: ClientWithRequestAndCase[]) => {
	if (!worksheet) return;

	for (let l = 0; l < clients.length; l++) {
		const basic = clients[l];
		const request = clients[l].request;
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
};
