<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	import { Button } from '$lib/components/ui/button';

	export let data: PageServerData;
	export let form;

	const save = (file: string) => {
		const a = document.createElement('a');
		a.href = file;
		a.download = `Interview Sheet_${data.client.lastName}.pdf`;
		a.click();
	};

	$: form?.interview_sheet && save(form.interview_sheet);
</script>

<form method="POST" use:enhance>
	<Button type="submit">Generate Interview Sheet</Button>
</form>
