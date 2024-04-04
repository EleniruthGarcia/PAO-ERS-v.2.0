<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';

	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	export let form;

	const save = (file: string) => {
		const a = document.createElement('a');
		a.href =
			'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + file;
		a.download = `report-${today(getLocalTimeZone())}.xlsx`;
		a.click();
	};

	$: form?.report && save(form.report);
</script>

<form method="POST" use:enhance>
	<Button type="submit">Download Report</Button>
</form>
