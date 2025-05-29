<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary dependencies and components.
	import clsx from 'clsx';
	import { UserTable, SelectedUsers } from '$lib/components/tables/user';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const selectedUsers = writable({});
	setContext('selectedUsers', selectedUsers);
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
