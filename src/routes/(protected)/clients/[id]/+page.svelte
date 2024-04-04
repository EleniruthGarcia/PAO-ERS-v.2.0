<script lang="ts">
	import type { PageServerData } from './$types';

	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import ClientForm from '$lib/components/forms/ClientForm.svelte';

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

<form method="POST" action="?/generateInterviewSheet" use:enhance>
	<Button type="submit">Generate Interview Sheet</Button>
</form>

<ClientForm data={data.form} />
