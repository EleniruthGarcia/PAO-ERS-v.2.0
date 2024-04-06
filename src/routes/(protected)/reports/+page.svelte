<script lang="ts">
	import { save } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	export let form;

	$: form?.report && save(form.report);
</script>

<form method="POST" use:enhance>
	<Button type="submit">Download Report</Button>
</form>
