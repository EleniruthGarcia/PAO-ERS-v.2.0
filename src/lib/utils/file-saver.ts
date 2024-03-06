import ExcelJS from 'exceljs';

export const saveAs = async (workbook: ExcelJS.Workbook, filename?: string) => {
	const buffer = await workbook.xlsx.writeBuffer();

	const blob = new Blob([buffer], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	});

	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = filename || 'file.xlsx';
	a.click();
	URL.revokeObjectURL(url);
};
