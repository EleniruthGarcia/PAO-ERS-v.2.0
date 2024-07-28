<script lang="ts">
	import type { PageServerData } from './$types';
	import WalkinClientForm from '$lib/components/forms/WalkinClientForm_TL.svelte';

	export let data: PageServerData;
</script>

<WalkinClientForm data={data.form} />
