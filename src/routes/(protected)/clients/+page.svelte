<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary dependencies and components.
	import clsx from 'clsx';
	import { ClientTable, SelectedClients } from '$lib/components/tables/client';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

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
