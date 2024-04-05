<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	import { Button } from '$lib/components/ui/button';

	export let data: PageServerData;
	export let form;
</script>

<form method="POST" use:enhance>
	<Button type="submit">Delete Client</Button>
</form>
