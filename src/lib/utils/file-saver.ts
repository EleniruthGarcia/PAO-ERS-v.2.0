import { Buffer } from 'buffer';

export const saveAs = async (bufferString: string | undefined, filename?: string) => {
	if (!bufferString) return;

	const buffer = Buffer.from(bufferString, 'base64');

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
