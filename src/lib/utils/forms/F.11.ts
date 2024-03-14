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

// F.11 - Precinct/Jail Visitation Report

export const addRow = async (worksheet: ExcelJS.Worksheet | undefined, clients: ClientWithRequestAndCase[]) => {
  if (!worksheet) return;

  for (let l = 0; l < clients.length; l++) {
    const basic = clients[l];
    const request = clients[l].request;
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
