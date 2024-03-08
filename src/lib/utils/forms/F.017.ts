import type { Client } from '@prisma/client';

import ExcelJS from 'exceljs';

// F.17 - Monthly Inventory of Clients Served

export const addRowTitle = async (
    worksheet: ExcelJS.Worksheet
) => {
    worksheet.mergeCells('A9:B12');
	worksheet.getCell('A9').value = 'Name of Client/s';
	worksheet.mergeCells('C9:C12');
	worksheet.getCell('C9').value = 'Address';
	worksheet.mergeCells('D11:D12');
	worksheet.getCell('D11').value = 'Age';
	worksheet.mergeCells('E11:E12');
	worksheet.getCell('E11').value = 'Gender/Sex';
	worksheet.getCell('F11').value = 'Contact Nos.';
	worksheet.getCell('F12').value = 'If any';
	worksheet.mergeCells('G11:G12');
	worksheet.getCell('G11').value = 'Email Address';
	worksheet.mergeCells('D9:W9');
	worksheet.mergeCells('D10:G10');
	worksheet.getCell('D10').value = 'Clients Information';

	worksheet.mergeCells('H11:H12');
	worksheet.getCell('H11').value = 'CICL';
	worksheet.mergeCells('I11:I12');
	worksheet.getCell('I11').value = 'Women';
	worksheet.mergeCells('J11:J12');
	worksheet.getCell('J11').value = 'Indigenous Group';
	worksheet.mergeCells('K11:K12');
	worksheet.getCell('K11').value = 'Person with Disability';
	worksheet.mergeCells('L11:L12');
	worksheet.getCell('L11').value = 'Urban Poor';
	worksheet.mergeCells('M11:M12');
	worksheet.getCell('M11').value = 'Rural Poor';
	worksheet.mergeCells('N11:N12');
	worksheet.getCell('N11').value = 'Senior Citizen';
	worksheet.mergeCells('O11:O12');
	worksheet.getCell('O11').value = 'OFW';

	worksheet.mergeCells('H10:O10');
	worksheet.getCell('H10').value = 'Mandated Clients (pls. mark with "x")';

	worksheet.mergeCells('P11:P12');
	worksheet.getCell('P11').value = 'Judicial1';
	worksheet.mergeCells('Q11:Q12');
	worksheet.getCell('Q11').value = 'Quasi-Judicial2';
	worksheet.mergeCells('R11:R12');
	worksheet.getCell('R11').value = 'Non-Judicial3';

	worksheet.mergeCells('P10:R10');
	worksheet.getCell('P10').value = 'Assistance';

	worksheet.mergeCells('S10:S12');
	worksheet.getCell('S10').value = 'Action Taken*';

	worksheet.mergeCells('T11:T12');
	worksheet.getCell('T11').value = 'Title of the Case';
	worksheet.mergeCells('U11:U12');
	worksheet.getCell('U11').value = 'Case No.';
	worksheet.mergeCells('V11:V12');
	worksheet.getCell('V11').value = 'Status of the Case';

	worksheet.mergeCells('T10:V10');
	worksheet.getCell('T10').value = 'If Represented in Court (Regular , Limited , Provisional)';

	worksheet.mergeCells('W10:W12');
	worksheet.getCell('W10').value = 'Nature of Case4';

    const rowNum = worksheet.getRow(11);
	for(let m = 8; m <= 18; m++) {
		rowNum.getCell(m).font = {
			name: 'Arial',
			size: 7,
			bold: true
		};
	};

	const rowNum2 = worksheet.getRow(11);
	for(let m = 4; m <= 6; m++) {
		rowNum.getCell(m).font = {
			name: 'Arial',
			size: 7,
			bold: true
		};
	};
	worksheet.getRow(12).getCell(6).font = {
		name: 'Arial',
		size: 7,
		bold: true
	};
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
