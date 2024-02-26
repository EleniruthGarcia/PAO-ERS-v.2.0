<script lang="ts">
	import ExcelJS from 'exceljs';
	import { saveAs } from '$lib/utils/file-saver';

	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const workbook = new ExcelJS.Workbook();
	workbook.addWorksheet('F.017');
</script>

<main>
	<h1>Monthly Inventory of Clients Served</h1>

	<button on:click={async () => saveAs(workbook, 'F.017.xlsx')}>Generate Report</button>
</main>
