import { read } from '$app/server';
import templateFile from './template.xlsx?url';
import XlsxTemplate from 'xlsx-template';

export const generateReport = async (data: any) => {
	const file = await read(templateFile).arrayBuffer();
	const template = new XlsxTemplate(Buffer.from(file));

	template.substitute('F.10', { ...data, num: data.f10 ? data.f10.length : 0 });
	template.substitute('F.011', { ...data, num: data.f10 ? data.f11.length : 0 });
	template.substitute('F.012', { ...data, num: data.f12 ? data.f12.length : 0 });
	template.substitute('F.013', { ...data, num: data.f13 ? data.f13.length : 0 });
	template.substitute('F.014', { ...data, num: data.f14 ? data.f14.length : 0 });
	template.substitute('F.015', { ...data, num: data.f15 ? data.f15.length : 0 });
	template.substitute('F.016', { ...data, num: data.f16 ? data.f16.length : 0 });
	template.substitute('F.017', { ...data, num: data.f17 ? data.f17.length : 0 });
	template.substitute('F.018', { ...data, num: data.f18 ? data.f18.length : 0 });
	template.substitute('F.19', { ...data, num: data.f19 ? data.f19.length : 0 });
	template.substitute('F.020', { ...data, num: data.f20 ? data.f20.length : 0 });
	template.substitute('F.021', { ...data, num: data.f21 ? data.f21.length : 0 });
	template.substitute('F.022', { ...data, num: data.f22 ? data.f22.length : 0 });
	template.substitute('F.023', { ...data, num: data.f23 ? data.f23.length : 0 });
	template.substitute('F.024', { ...data, num: data.f24 ? data.f24.length : 0 });
	template.substitute('F.025', { ...data, num: data.f25 ? data.f25.length : 0 });
	template.substitute('F.026', { ...data, num: data.f26 ? data.f26.length : 0 });
	template.substitute('F.027', { ...data, num: data.f27 ? data.f27.length : 0 });

	template.substitute('F.028', { ...data, num: data.f28 ? data.f28.length : 0 });
	template.substitute('F.029', { ...data, num: data.f29 ? data.f29.length : 0 });

	template.substitute('F.031', { ...data, num: data.f31 ? data.f31.length : 0 });
	template.substitute('F.032', { ...data, num: data.f32 ? data.f32.length : 0 });
	template.substitute('F.033', { ...data, num: data.f33 ? data.f33.length : 0 });
	template.substitute('F.034', { ...data, num: data.f34 ? data.f34.length : 0 });
	template.substitute('F.35', { ...data, num: data.f35 ? data.f35.length : 0 });

	template.substitute('F.038', { ...data, num: data.f38 ? data.f38.length : 0 });
	template.substitute('F.048', { ...data, num: data.f48 ? data.f48.length : 0 });
	template.substitute('F.049', { ...data, num: data.f49 ? data.f49.length : 0 });

	template.substitute('F.050', { ...data, num: data.f50 ? data.f50.length : 0 });
	template.substitute('F.051', { ...data, num: data.f51 ? data.f51.length : 0 });
	template.substitute('F.052', { ...data, num: data.f52 ? data.f52.length : 0 });

	return {
		name: `[${data.month}, ${data.year}] Report_${data.lawyer.name}.xlsx`,
		dataUri:
			'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
			template.generate({ type: 'base64' })
	};
};
