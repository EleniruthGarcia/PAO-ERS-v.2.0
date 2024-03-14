import ExcelJS from 'exceljs';
import type { Client } from "@prisma/client"

import * as F10 from './F.10';


export const generateReports = async (clients: Client[]) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('src/lib/utils/forms/reports.xlsx');

    await F10.addRow(workbook.getWorksheet('F.10'), clients);

    return await workbook.xlsx.writeBuffer() as Buffer;
};