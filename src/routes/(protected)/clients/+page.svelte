<script lang="ts">
	import clsx from 'clsx';
	import type { PageServerData } from './$types';

	import { ClientTable, SelectedClients } from '$lib/components/tables/client';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let data: PageServerData;

	const selectedClients = writable({});
	setContext('selectedClients', selectedClients);
</script>

<main
	class={clsx(
		'grid gap-4',
		Object.entries($selectedClients).length > 0 && 'lg:grid-cols-3 xl:grid-cols-3'
	)}
>
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<ClientTable />
	</div>
	{#if Object.entries($selectedClients).length > 0}
		<div>
			<SelectedClients />
		</div>
	{/if}
</main>
