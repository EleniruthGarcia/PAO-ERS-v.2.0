<script lang="ts">
	import type { PageServerData } from './$types';
	import WalkinClientForm from '$lib/components/forms/WalkinClientForm_IL.svelte';

	export let data: PageServerData;
</script>

<WalkinClientForm data={data.form} />
