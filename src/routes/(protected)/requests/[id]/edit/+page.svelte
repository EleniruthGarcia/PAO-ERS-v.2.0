<script lang="ts">
	import type { PageServerData } from './$types';
	import RequestForm from '$lib/components/forms/RequestForm.svelte';

	export let data: PageServerData;
</script>

<RequestForm data={data.form} />
