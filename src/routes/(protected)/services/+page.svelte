<script lang="ts">
	import clsx from 'clsx';
	import { RequestTable, SelectedRequests } from '$lib/components/tables/request';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const selectedRequests = writable({});
	setContext('selectedRequests', selectedRequests);
</script>

<main
	class={clsx(
		'grid gap-4',
		Object.entries($selectedRequests).length > 0 && 'lg:grid-cols-3 xl:grid-cols-3'
	)}
>
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<RequestTable />
	</div>
	{#if Object.entries($selectedRequests).length > 0}
		<div>
			<SelectedRequests />
		</div>
	{/if}
</main>
