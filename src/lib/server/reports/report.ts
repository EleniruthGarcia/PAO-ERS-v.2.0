import { read } from '$app/server';
import templateFile from './template.xlsx?url';
import XlsxTemplate from "xlsx-template";

export const generateReport = async (data: any) => {
    const file = await read(templateFile).arrayBuffer();
    const template = new XlsxTemplate(Buffer.from(file));
    template.substitute('F.10', { ...data, num: data.f10.length });

    template.substitute('F.28', {});
    template.substitute('F.29', {});

    return template.generate({ type: 'base64' });
};