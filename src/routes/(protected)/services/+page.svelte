<script lang="ts">
	import clsx from 'clsx';
	import { ServiceTable, SelectedServices } from '$lib/components/tables/service';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const selectedServices = writable({});
	setContext('selectedServices', selectedServices);
</script>

<main
	class={clsx(
		'grid gap-4',
		Object.entries($selectedServices).length > 0 && 'lg:grid-cols-3 xl:grid-cols-3'
	)}
>
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<ServiceTable />
	</div>
	{#if Object.entries($selectedServices).length > 0}
		<div>
			<SelectedServices />
		</div>
	{/if}
</main>
