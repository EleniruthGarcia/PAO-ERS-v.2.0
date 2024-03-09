<script lang="ts">
	import ExcelJS from 'exceljs';
	import { saveAs, addHeader } from '$lib/utils';

	import type { PageServerData } from './$types';
	import { mdiBorderNone } from '@mdi/js';
	import { addRow, addRowTitle } from '$lib/utils/forms/F.017';

	// export let data: PageServerData;
	const workbook = new ExcelJS.Workbook();

	async function fetchRecord() {
		const worksheet = workbook.addWorksheet('F.10');
		worksheet.columns = [
			{ key: 'date', width: 10 },
			{ key: 'name', width: 15 },
			{ key: 'gender', width: 8 },
			{ key: 'problem', width: 15 },
			{ key: 'action', width: 18 },
			{ key: 'remarks', width: 10 },
			{ key: 'id', width: 8 }
		];

		// worksheet.insertRow(20, {address: "lala lala"});

		for (let i = 1; i <= worksheet.columns.length - 1; i++) {
			const allCol = worksheet.getColumn(i);
			allCol.font = {
				name: 'Arial',
				size: 11,
				bold: true
			};
			allCol.alignment = {
				vertical: 'middle',
				horizontal: 'center',
				wrapText: true
			};
			allCol.border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' }
			};
		}

		for (let n = 9; n <= 25; n++) {
			worksheet.getRow(n).height = 40;
		}

		// const imageId = workbook.addImage({
		// 	filename: '$lib/images/Logo.png',
		// 	extension: 'png',
		// });

		// worksheet.addImage(imageId, 'E2:F4');

		// worksheet.addImage(imageId, {tl: { col: 4.5, row: 1.5 }, br: { col: 6, row: 3 }, ext: {width: 50, height: 50}});

		addHeader(
			worksheet,
			'BRGY. Service Day Outreach Program',
			'CAR',
			'Baguio City',
			'AS OF ' +
				Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric' })
					.format(new Date())
					.toUpperCase(),
			6
		);

		for (let l = 1; l <= 8; l++) {
			worksheet.getRow(l).border = {
				top: {},
				left: {},
				bottom: {},
				right: {}
			};
		}

		addRowTitle(worksheet);

		const clientArray = await prisma.client.findMany({});
		// console.log(clientArray);
		// let j = 13;

		// addRow(worksheet, clientArray);

	}

	fetchRecord()
		.catch((error) => {
			console.error('Error fetching record:', error);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
</script>

<main>
	<button on:click={async () => saveAs(workbook, 'Monthly Report.xlsx')}>Generate Report</button>
</main>