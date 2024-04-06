<script lang="ts">
	import { save } from '$lib/utils';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	export let data: PageServerData;
	export let form;

	$: form?.interview_sheet &&
		form?.interview_sheet?.error === undefined &&
		save(form.interview_sheet);

	$: form?.interview_sheet?.error && toast.error('No interview sheet data found!');
</script>

<form method="POST" use:enhance>
	<Button type="submit">Generate Interview Sheet</Button>
</form>
