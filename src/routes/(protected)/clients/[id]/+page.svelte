<script lang="ts">
	import type { PageServerData } from './$types';
	import { getLocalTimeZone, today } from '@internationalized/date';

	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	export let data: PageServerData;
	export let form;

	const save = (file: string) => {
		const a = document.createElement('a');
		a.href =
			'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + file;
		a.download = `Interview Sheet_${data.client.lastName}.xlsx`;
		a.click();
	};

	$: form?.interview_sheet && save(form.interview_sheet);
</script>

<form method="POST" use:enhance>
	<Button type="submit">Download Interview Sheet</Button>
</form>
