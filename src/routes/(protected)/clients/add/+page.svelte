<script lang="ts">
	import type { PageServerData } from './$types';
	import ClientCreateForm from '$lib/components/forms/ClientCreateForm.svelte';

	export let data: PageServerData;
</script>

<ClientCreateForm data={data.form} />
