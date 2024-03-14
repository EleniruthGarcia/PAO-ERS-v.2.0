import type { Client } from '@prisma/client';

import ExcelJS from 'exceljs';

// F.11 - Precinct/Jail Visitation Report

export const addRow = async (worksheet: ExcelJS.Worksheet | undefined, clients: Client[]) => {
	if (!worksheet) return;

<<<<<<< HEAD
  const client = await prisma.client.findMany({
    where: {

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
        worksheet.insertRow(13, [
          '',
          `${basic.firstName} ${basic.middleName ? basic.middleName : ''} ${basic.lastName} ${basic.nameSuffix ? basic.nameSuffix : ''}`,
          basic.sex,
          basic.detainedSince,
          info.title,
          '',
          info.nature,
          basic.detainedAt,
          info.court,
          info.lastActionTaken
        ], 'o+');
      }
    }

  }
=======
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
		worksheet.insertRow(
			13,
			[
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
			],
			'o'
		);
	}
>>>>>>> fe01fda9571d6cbf77379ffa8fdba17360750c9f
};
