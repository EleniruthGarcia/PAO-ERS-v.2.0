<script lang="ts">
	import { page } from '$app/stores';

	import { PlusCircled, File, MixerHorizontal } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tabs from '$lib/components/ui/tabs';

	import Table from './data-table.svelte';
	import Loading from '$lib/components/Loading.svelte';
</script>

<Tabs.Root value="all">
	<div class="flex items-center">
		<Tabs.List>
			<Tabs.Trigger value="all">All</Tabs.Trigger>
			<Tabs.Trigger value="recents">Recents</Tabs.Trigger>
			<Tabs.Trigger value="archived">Archived</Tabs.Trigger>
		</Tabs.List>
		<div class="ml-auto flex items-center gap-2">
			<!-- <DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="outline" size="sm" class="h-7 gap-1 text-sm" builders={[builder]}>
						<MixerHorizontal class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only">Filter</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>Filter by</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.CheckboxItem checked>Fulfilled</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem>Declined</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem>Refunded</DropdownMenu.CheckboxItem>
				</DropdownMenu.Content>
			</DropdownMenu.Root> -->
			<Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
				<File class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only">Export</span>
			</Button>
			<Button size="sm" class="h-7 gap-1 text-sm" href="/users/add">
				<PlusCircled class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add User </span>
			</Button>
		</div>
	</div>
	<Tabs.Content value="all">
		<Card.Root>
			<Card.Header class="px-7">
				<Card.Title>All Users</Card.Title>
				<Card.Description>All users added to the system are shown here.</Card.Description>
			</Card.Header>
			<Card.Content>
				{#await $page.data.users}
					<Loading />
				{:then users}
					{#if users.filter((u) => u.status.at(-1)?.type !== 'Archived').length > 0}
						<Table data={users.filter((u) => u.status.at(-1)?.type !== 'Archived')} />
					{:else}
						<div
							class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
						>
							<div class="flex flex-col items-center gap-1 text-center">
								<h3 class="text-2xl font-bold tracking-tight">You have no users.</h3>
								<p class="text-sm text-muted-foreground">
									You can start using the system as soon as you add a new user.
								</p>
								<Button class="mt-4" href="/users/add">Add User</Button>
							</div>
						</div>
					{/if}
				{/await}
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="recents">
		<Card.Root>
			<Card.Header class="px-7">
				<Card.Title>New Users</Card.Title>
				<Card.Description>New users added to the system are shown here.</Card.Description>
			</Card.Header>
			<Card.Content>
				{#await $page.data.users}
					<Loading />
				{:then users}
					{#if users.filter((u) => u.status.at(-1)?.type === 'New').length > 0}
						<Table data={users.filter((u) => u.status.at(-1)?.type === 'New')} />
					{:else}
						<div
							class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
						>
							<div class="flex flex-col items-center gap-1 text-center">
								<h3 class="text-2xl font-bold tracking-tight">You have no new users.</h3>
								<p class="text-sm text-muted-foreground">
									You can start using the system as soon as you add a new user.
								</p>
								<Button class="mt-4" href="/users/add">Add User</Button>
							</div>
						</div>
					{/if}
				{/await}
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="archived">
		<Card.Root>
			<Card.Header class="px-7">
				<Card.Title>Archived Users</Card.Title>
				<Card.Description>All archived users are shown here.</Card.Description>
			</Card.Header>
			<Card.Content>
				{#await $page.data.users}
					<Loading />
				{:then users}
					{#if users.filter((u) => u.status.at(-1)?.type === 'Archived').length > 0}
						<Table data={users.filter((u) => u.status.at(-1)?.type === 'Archived')} />
					{:else}
						<div
							class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
						>
							<div class="flex flex-col items-center gap-1 text-center">
								<h3 class="text-2xl font-bold tracking-tight">You have no archived users.</h3>
								<p class="text-sm text-muted-foreground">You may view your archived users here.</p>
								<Button class="mt-4" href="/users/add">Add User</Button>
							</div>
						</div>
					{/if}
				{/await}
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
