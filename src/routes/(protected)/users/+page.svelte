<script lang="ts">
	import clsx from 'clsx';
	import type { PageServerData } from './$types';

	import { UserTable, SelectedUsers } from '$lib/components/tables/user';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let data: PageServerData;

	const selectedUsers = writable({});
	setContext('selectedData', selectedUsers);
</script>

<main
	class={clsx(
		'grid gap-4',
		Object.entries($selectedUsers).length > 0 && 'lg:grid-cols-3 xl:grid-cols-3'
	)}
>
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<UserTable />
	</div>
	{#if Object.entries($selectedUsers).length > 0}
		<div>
			<SelectedUsers />
		</div>
	{/if}
</main>
