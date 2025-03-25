<script lang="ts">
	import { page } from '$app/stores';

	import { PlusCircled } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
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
			<!-- <Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
				<File class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only">Export</span>
			</Button> -->
			<Button size="sm" class="h-7 gap-1 text-sm" href="/clients/add">
				<PlusCircled class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Client</span>
			</Button>
		</div>
	</div>
	<Tabs.Content value="all">
		<Card.Root>
			<Card.Header class="px-7">
				<Card.Title>Clients</Card.Title>
				<Card.Description>All active clients added to the system are shown here.</Card.Description>
			</Card.Header>
			<Card.Content>
				{#await $page.data.clients}
					<Loading />
				{:then clients}
					{#await $page.data.services}
						<Loading />
					{:then services}
						{@const filteredClients = clients.filter(
							(client) =>
								client.currentStatus !== 'Archived' &&
								services.filter(
									(service) =>
										(!($page.data.user.role === 'Administator') ||
											service.lawyer_id === $page.data.user.id) &&
										service.client_id?.includes(client._id)
								).length >= 0
						)}
						{#if filteredClients.length > 0}
							<Table data={filteredClients} />
						{:else}
							<div
								class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
							>
								<div class="flex flex-col items-center gap-1 text-center">
									<h3 class="text-2xl font-bold tracking-tight">You have no clients.</h3>
									<p class="text-sm text-muted-foreground">
										You can start rendering services as soon as you add a new client.
									</p>
									<Button class="mt-4" href="/clients/add">Add Client</Button>
								</div>
							</div>
						{/if}
					{/await}
				{/await}
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="recents">
		<Card.Root>
			<Card.Header class="px-7">
				<Card.Title>Recent Clients</Card.Title>
				<Card.Description>Recent clients added to the system are shown here.</Card.Description>
			</Card.Header>
			<Card.Content>
				{#await $page.data.clients}
					<Loading />
				{:then clients}
					{#await $page.data.services}
						<Loading />
					{:then services}
						{@const filteredClients = clients.filter(
							(client) =>
								client.currentStatus === 'New' &&
								services.filter(
									(service) =>
										(!($page.data.user.role === 'Administator') ||
											service.lawyer_id === $page.data.user.id) &&
										service.client_id?.includes(client._id)
								).length >= 0
						)}
						{#if filteredClients.length > 0}
							<Table data={filteredClients} />
						{:else}
							<div
								class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
							>
								<div class="flex flex-col items-center gap-1 text-center">
									<h3 class="text-2xl font-bold tracking-tight">You have no recent clients!</h3>
									<p class="text-sm text-muted-foreground">
										New clients will appear here as soon as they are added.
									</p>
									<Button class="mt-4" href="/clients/add">Add Client</Button>
								</div>
							</div>
						{/if}
					{/await}
				{/await}
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="archived">
		<Card.Root>
			<Card.Header class="px-7">
				<Card.Title>Archived Clients</Card.Title>
				<Card.Description>
					Clients archived from the system are shown here. For permanent deletion, please contact
					administrator.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				{#await $page.data.clients}
					<Loading />
				{:then clients}
					{#await $page.data.services}
						<Loading />
					{:then services}
						{@const filteredClients = clients.filter(
							(client) =>
								client.currentStatus === 'Archived' &&
								services.filter(
									(service) =>
										(!($page.data.user.role === 'Administator') ||
											service.lawyer_id === $page.data.user.id) &&
										service.client_id?.includes(client._id)
								).length >= 0
						)}
						{#if filteredClients.length > 0}
							<Table data={filteredClients} />
						{:else}
							<div
								class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
							>
								<div class="flex flex-col items-center gap-1 text-center">
									<h3 class="text-2xl font-bold tracking-tight">You have no archived clients.</h3>
									<p class="text-sm text-muted-foreground">
										Archived clients will appear here as soon as they are archived.
									</p>
								</div>
							</div>
						{/if}
					{/await}
				{/await}
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
