import type { Client } from '@prisma/client';

import ExcelJS from 'exceljs';

// F.17 - Monthly Inventory of Clients Served

export const addRowTitle = async (
    worksheet: ExcelJS.Worksheet
) => {

}


export const addRow = async (
    worksheet: ExcelJS.Worksheet,
    clients: Client[]
) => {
    for (const client of clients) {
        const row = worksheet.addRow([
            client.id,
            `${client.firstName} ${client.middleName ? client.middleName : ''} ${client.lastName} ${client.nameSuffix ? client.nameSuffix : ''}`,
            client.address,
            client.age,
            client.sex,
            client.contactNumber ? client.contactNumber : '',
            client.email ? client.email : '',
        ]);
        row.font = { bold: false };
    }

    return worksheet;
};
