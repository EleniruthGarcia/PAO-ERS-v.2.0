<script lang="ts">
	import type { PageServerData } from './$types';
	import RequestForm from '$lib/components/forms/RequestForm.svelte';

	export let data: PageServerData;
	export let form;
</script>

<RequestForm data={data.form} />
