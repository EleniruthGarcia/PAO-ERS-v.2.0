<script lang="ts">
	import type { PageServerData } from './$types';
	import WalkinClientForm from '$lib/components/forms/WalkinClientForm.svelte';

	export let data: PageServerData;
</script>

<WalkinClientForm data={data.form} />
