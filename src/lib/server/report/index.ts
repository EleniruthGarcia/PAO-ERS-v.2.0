import { read } from '$app/server';
import templateFile from './template.xlsx?url';
import XlsxTemplate from 'xlsx-template';

export const generateReport = async (data: any) => {
	const file = await read(templateFile).arrayBuffer();
	const template = new XlsxTemplate(Buffer.from(file));
	template.substitute('F.10', { ...data, num: data.f10.length });

	// template.substitute('F.028', {});
	// template.substitute('F.029', {});

	return {
		name: `Report_${data.month}.xlsx`,
		dataUri:
			'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
			template.generate({ type: 'base64' })
	};
};
