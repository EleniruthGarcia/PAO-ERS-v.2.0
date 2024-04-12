import { read } from '$app/server';
import templateFile from './template.xlsx?url';
import XlsxTemplate from 'xlsx-template';

export const generateReport = async (data: any) => {
	const file = await read(templateFile).arrayBuffer();
	const template = new XlsxTemplate(Buffer.from(file));

	template.substitute('F.10', { ...data, num: data.f10.length });
	template.substitute('F.011', { ...data, num: data.f11.length });
	template.substitute('F.012', { ...data, num: data.f12.length });
	template.substitute('F.013', { ...data, num: data.f13.length });
	template.substitute('F.014', { ...data, num: data.f14.length });
	template.substitute('F.015', { ...data, num: data.f15.length });
	template.substitute('F.016', { ...data, num: data.f16.length });
	template.substitute('F.017', { ...data, num: data.f17.length });
	template.substitute('F.018', { ...data, num: data.f18.length });
	template.substitute('F.19', { ...data, num: data.f19.length });
	template.substitute('F.020', { ...data, num: data.f20.length });
	template.substitute('F.021', { ...data, num: data.f21.length });
	template.substitute('F.022', { ...data, num: data.f22.length });
	template.substitute('F.023', { ...data, num: data.f23.length });
	template.substitute('F.024', { ...data, num: data.f24.length });
	template.substitute('F.025', { ...data, num: data.f25.length });
	template.substitute('F.026', { ...data, num: data.f26.length });
	template.substitute('F.027', { ...data, num: data.f27.length });
	template.substitute('F.028', { ...data, num: data.f28.length });
	template.substitute('F.029', { ...data, num: data.f29.length });
	template.substitute('F.031', { ...data, num: data.f31.length });
	template.substitute('F.032', { ...data, num: data.f32.length });
	template.substitute('F.033', { ...data, num: data.f33.length });
	template.substitute('F.034', { ...data, num: data.f34.length });
	template.substitute('F.35', { ...data, num: data.f35.length });

	return { name: `Report_${data.month}.xlsx`, dataUri: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + template.generate({ type: 'base64' }) };
};
