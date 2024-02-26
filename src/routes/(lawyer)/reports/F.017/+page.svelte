<script lang="ts">
	import ExcelJS from 'exceljs';
	import { saveAs, addHeader } from '$lib/utils';

	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('F.017');
	addHeader(
		worksheet,
		'Monthly Inventory of Clients Served',
		'CAR',
		'Baguio City',
		'AS OF ' +
			Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric' })
				.format(new Date())
				.toUpperCase(),
		6
	);
</script>

<main>
	<button on:click={async () => saveAs(workbook, 'F.017.xlsx')}>Generate Report</button>
</main>
