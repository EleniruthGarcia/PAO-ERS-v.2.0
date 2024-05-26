<script lang="ts">
	import type { PageServerData } from './$types';
	import ServiceForm from '$lib/components/forms/ServiceForm.svelte';

	export let data: PageServerData;
</script>

<ServiceForm data={data.form} />
