import { read } from '$app/server';
import templateFile from './template.xlsx?url';
import XlsxTemplate from 'xlsx-template';

export const generateInterviewSheet = async (data: any) => {
	const file = await read(templateFile).arrayBuffer();
	const template = new XlsxTemplate(Buffer.from(file));

	template.substitute(1, data);

	return template.generate({ type: 'base64' });
};
