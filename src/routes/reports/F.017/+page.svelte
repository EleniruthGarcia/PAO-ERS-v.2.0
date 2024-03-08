<script lang="ts">
	import ExcelJS from 'exceljs';
	import { saveAs, addHeader } from '$lib/utils';

	import type { PageServerData } from './$types';
	import { mdiBorderNone } from '@mdi/js';
	import { addRow, addRowTitle } from '$lib/utils/forms/F.017';

	// export let data: PageServerData;
	const workbook = new ExcelJS.Workbook();

	async function fetchRecord() {
		const worksheet = workbook.addWorksheet('F.017');
		worksheet.columns = [
			{key: "id", width: 4},
			{key: "name", width: 15}, 
			{key: "address", width: 17},
			{key: "age", width: 5}, 
			{key: "gender", width: 8}, 
			{key: "contact", width: 10}, 
			{key: "email", width: 8},
			{key: "cicl", width: 5}, 
			{key: "women", width: 5}, 
			{key: "ig", width: 5},
			{key: "pwd", width: 5}, 
			{key: "upoor", width: 5}, 
			{key: "rpoor", width: 5}, 
			{key: "senior", width: 5}, 
			{key: "ofw", width: 5}, 
			{key: "judi", width: 5}, 
			{key: "quasi", width: 5}, 
			{key: "nonjudi", width: 5},
			{key: "action", width: 10},  
			{key: "title", width: 13}, 
			{key: "case", width: 8},
			{key: "status", width: 8},  
			{key: "nature", width: 10}
		];

		// worksheet.insertRow(20, {address: "lala lala"});

		for(let i = 1; i <= worksheet.columns.length; i++) {
			const allCol = worksheet.getColumn(i);
			allCol.font = {
				name: 'Arial',
				size: 9,
				bold: true
			}
			allCol.alignment = {
				vertical: 'middle',
				horizontal: 'center',
				wrapText: true
			}
			allCol.border = {
				top: {style: 'thin'},
				left: {style: 'thin'},
				bottom: {style: 'thin'},
				right: {style: 'thin'}
			}
		}

		for(let n = 9; n <= 12; n++) {
			worksheet.getRow(n).height = 25;
		}

		// const imageId = workbook.addImage({
		// 	filename: '$lib/images/Logo.png', 
		// 	extension: 'png',
		// });

		// worksheet.addImage(imageId, 'E2:F4');

		// worksheet.addImage(imageId, {tl: { col: 4.5, row: 1.5 }, br: { col: 6, row: 3 }, ext: {width: 50, height: 50}});

		addHeader(
			worksheet,
			'Monthly Inventory of Clients Served',
			'CAR',
			'Baguio City',
			'AS OF ' +
				Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric' })
					.format(new Date())
					.toUpperCase(),
			23
		);

		for(let l = 1; l <= 8; l++) {
			worksheet.getRow(l).border = {
				top: {},
				left: {},
				bottom: {},
				right: {}
			};
		};

		addRowTitle(worksheet);

		const clientArray = await prisma.client.findMany({});
		// console.log(clientArray);
		// let j = 13;
		
		addRow(worksheet, clientArray);

		// for(let i = 0; i <= clientArray.length; i++) {
			
			// if(element.cicl == true) {
			// 	element.cicl = 'X';
			// }
			// else {
			// 	element.cicl = '';
			// }

			// if(element.women == true) {
			// 	element.women = 'X';
			// }
			// else {
			// 	element.women = '';
			// }

			// if(element.ip == true) {
			// 	element.ip = 'X';
			// }
			// else {
			// 	element.ip = '';
			// }

			// if(element.pwd == true) {
			// 	element.pwd = 'X';
			// }
			// else {
			// 	element.pwd = '';
			// }

			// if(element.upoor == true) {
			// 	element.upoor = 'X';
			// }
			// else {
			// 	element.upoor = '';
			// }

			// if(element.rpoor == true) {
			// 	element.rpoor = 'X';
			// }
			// else {
			// 	element.rpoor = '';
			// }

			// if(element.senior == true) {
			// 	element.senior = 'X';
			// }
			// else {
			// 	element.senior = '';
			// }

			// if(element.ofw == true) {
			// 	element.ofw = 'X';
			// }
			// else {
			// 	element.ofw = '';
			// }

			// if(element.judi == true) {
			// 	element.judi = 'X';
			// }
			// else {
			// 	element.judi = '';
			// }
			
			// if(element.quasi == true) {
			// 	element.quasi = 'X';
			// }
			// else {
			// 	element.quasi = '';
			// }

			// if(element.nonjudi == true) {
			// 	element.nonjudi = 'X';
			// }
			// else {
			// 	element.nonjudi = '';
			// }

			// const data = [{
			// 	id: element.id, 
			// 	name: element.firstName + element.middleName + element.lastName + element.nameSuffix, 
			// 	age: element.age, 
			// 	gender: element.sex, 
			// 	contact: element.contactNumber, 
			// 	email: element.email
			// }]
		// 	let id = element?.id;
		// 	let name = element?.firstName + ' ' + element?.middleName + ' ' + element?.lastName + ' ' + element?.nameSuffix;
		// 	let age = element?.age;
		// 	let gender = element?.sex;
		// 	let contact = element?.contactNumber;
		// 	let email = element?.email;

		// 	worksheet.insertRow(j, {
		// 		id: id, 
		// 		name: name, 
		// 		age: age, 
		// 		gender: gender, 
		// 		contact: contact, 
		// 		email: email});
		// 	j++;
		// };
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
	<button on:click={async () => saveAs(workbook, 'F.017.xlsx')}>Generate Report</button>
</main>
