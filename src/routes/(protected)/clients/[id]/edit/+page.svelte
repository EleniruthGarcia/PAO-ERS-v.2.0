<script lang="ts">
	import type { PageServerData } from './$types';
	import ClientForm from '$lib/components/forms/ClientForm.svelte';

	export let data: PageServerData;
	export let form;
</script>

<ClientForm data={data.form} />
