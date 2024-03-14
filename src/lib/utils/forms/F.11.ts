import type { Client } from '@prisma/client';

import ExcelJS from 'exceljs';

// F.11 - Precinct/Jail Visitation Report

export const addRow = async (worksheet: ExcelJS.Worksheet | undefined, clients: Client[]) => {
	if (!worksheet) return;

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
};
