<script lang="ts">
	import { save } from '$lib/utils';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	import { Button } from '$lib/components/ui/button';

	export let data: PageServerData;
	export let form;

	$: form?.interview_sheet && save(form.interview_sheet);
</script>

<form method="POST" use:enhance>
	<Button type="submit">Generate Interview Sheet</Button>
</form>
