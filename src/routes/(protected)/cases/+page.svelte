<script lang="ts">
	import clsx from 'clsx';
	import type { PageServerData } from './$types';

	import { CaseTable, SelectedCases } from '$lib/components/tables/case';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let data: PageServerData;

	const selectedCases = writable({});
	setContext('selectedCases', selectedCases);
</script>

<main
	class={clsx(
		'grid gap-4',
		Object.entries($selectedCases).length > 0 && 'lg:grid-cols-3 xl:grid-cols-3'
	)}
>
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<CaseTable />
	</div>
	{#if Object.entries($selectedCases).length > 0}
		<div>
			<SelectedCases />
		</div>
	{/if}
</main>
