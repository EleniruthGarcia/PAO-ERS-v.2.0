<script lang="ts">
	import type { Document } from 'mongodb';

	import { PlusCircled, File, MixerHorizontal } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tabs from '$lib/components/ui/tabs';

	import Table from './data-table.svelte';

	export let clients: Document[];
</script>

<Tabs.Root value="all">
	<div class="flex items-center">
		<Tabs.List>
			<Tabs.Trigger value="all">All</Tabs.Trigger>
			<Tabs.Trigger value="month">Month</Tabs.Trigger>
			<Tabs.Trigger value="year">Year</Tabs.Trigger>
		</Tabs.List>
		<div class="ml-auto flex items-center gap-2">
			<DropdownMenu.Root>
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
			</DropdownMenu.Root>
			<Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
				<File class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only">Export</span>
			</Button>
			<Button size="sm" class="h-7 gap-1">
				<PlusCircled class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Client </span>
			</Button>
		</div>
	</div>
	<Tabs.Content value="all">
		<Card.Root>
			<Card.Header class="px-7">
				<Card.Title>Orders</Card.Title>
				<Card.Description>Recent orders from your store.</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if clients.length > 0}
					<Table {clients} />
				{:else}
					<div
						class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
					>
						<div class="flex flex-col items-center gap-1 text-center">
							<h3 class="text-2xl font-bold tracking-tight">You have no clients!</h3>
							<p class="text-sm text-muted-foreground">
								You can start rendering services as soon as you add a new client.
							</p>
							<Button class="mt-4">Add Client</Button>
						</div>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
