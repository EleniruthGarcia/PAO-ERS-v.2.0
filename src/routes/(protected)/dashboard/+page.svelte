<script lang="ts">
	import clsx from 'clsx';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';

	import { PlusCircled, File } from 'svelte-radix';

	import Loading from '$lib/components/Loading.svelte';
	import { Table as ClientTable, SelectedClients } from '$lib/components/tables/client';
	import { Table as ServiceTable, SelectedServices } from '$lib/components/tables/service';
	import { Table as CaseTable, SelectedCases } from '$lib/components/tables/case';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Progress } from '$lib/components/ui/progress';
	import * as Tabs from '$lib/components/ui/tabs';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let data: PageServerData;

	const selectedClients = writable({});
	setContext('selectedClients', selectedClients);

	const selectedServices = writable({});
	setContext('selectedServices', selectedServices);

	const selectedCases = writable({});
	setContext('selectedCases', selectedCases);
</script>

<main
	class={clsx(
		'grid gap-4',
		(Object.entries($selectedClients).length > 0 ||
			Object.entries($selectedServices).length > 0 ||
			Object.entries($selectedCases).length > 0) &&
			'lg:grid-cols-3 xl:grid-cols-3'
	)}
>
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card.Root class="sm:col-span-2">
				<Card.Header class="pb-3">
					<Card.Title>Your Dashboard</Card.Title>
					<Card.Description class="max-w-lg text-balance leading-relaxed">
						Welcome to your dashboard! Here, you can view all your clients, services, and cases.
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button class="gap-2" builders={[builder]}>
								<PlusCircled class="h-3.5 w-3.5" />
								<span class="sr-only sm:not-sr-only">Add</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Item href="/clients/add">Client</DropdownMenu.Item>
							<DropdownMenu.Item href="/services/add">Service</DropdownMenu.Item>
							<DropdownMenu.Item href="/cases/add">Case</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Active Clients</Card.Description>
					{#await data.clients}
						<Loading />
					{:then clients}
						<Card.Title class="text-4xl">{clients.length}</Card.Title>
					{:catch error}
						<Card.Title class="text-4xl">No clients found!</Card.Title>
					{/await}
				</Card.Header>
				<Card.Content>
					<div class="text-xs text-muted-foreground">+25% from last week</div>
				</Card.Content>
				<Card.Footer>
					<Progress value={25} aria-label="25% increase" />
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Active Services</Card.Description>
					{#await data.services}
						<Loading />
					{:then services}
						<Card.Title class="text-3xl">{services.length}</Card.Title>
					{:catch error}
						<Card.Title class="text-3xl">No services found!</Card.Title>
					{/await}
				</Card.Header>
				<Card.Content>
					<div class="text-xs text-muted-foreground">+10% from last month</div>
				</Card.Content>
				<Card.Footer>
					<Progress value={12} aria-label="12% increase" />
				</Card.Footer>
			</Card.Root>
		</div>
		<Tabs.Root value="clients">
			<div class="flex items-center">
				<Tabs.List>
					<Tabs.Trigger value="clients">Clients</Tabs.Trigger>
					<Tabs.Trigger value="services">Services</Tabs.Trigger>
					<Tabs.Trigger value="cases">Cases</Tabs.Trigger>
				</Tabs.List>
				<div class="ml-auto flex items-center gap-2">
					<Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
						<File class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only">Export</span>
					</Button>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button class="h-7 gap-1" builders={[builder]}>
								<PlusCircled class="h-3.5 w-3.5" />
								<span class="sr-only sm:not-sr-only">Add</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Item href="/clients/add">Client</DropdownMenu.Item>
							<DropdownMenu.Item href="/services/add">Service</DropdownMenu.Item>
							<DropdownMenu.Item href="/cases/add">Case</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
			<Tabs.Content value="clients">
				<Card.Root>
					<Card.Header class="px-7">
						<Card.Title>Clients</Card.Title>
						<Card.Description>All clients added to the system.</Card.Description>
					</Card.Header>
					<Card.Content>
						{#await $page.data.clients}
							<Loading />
						{:then clients}
							{#if clients.filter((client) => client.status?.at(-1).type !== 'Archived').length > 0}
								<ClientTable
									data={clients.filter((client) => client.status?.at(-1).type !== 'Archived')}
								/>
							{:else}
								<div
									class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
								>
									<div class="flex flex-col items-center gap-1 text-center">
										<h3 class="text-2xl font-bold tracking-tight">You have no clients!</h3>
										<p class="text-sm text-muted-foreground">
											You can start rendering services as soon as you add a new client.
										</p>
										<Button class="mt-4" href="/clients/add">Add Client</Button>
									</div>
								</div>
							{/if}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="services">
				<Card.Root>
					<Card.Header class="px-7">
						<Card.Title>Services</Card.Title>
						<Card.Description>All services added to the system.</Card.Description>
					</Card.Header>
					<Card.Content>
						{#await $page.data.services}
							<Loading />
						{:then services}
							{#if services.filter((service) => service.status?.at(-1).type !== 'Archived').length > 0}
								<ServiceTable
									data={services.filter((service) => service.status?.at(-1).type !== 'Archived')}
								/>
							{:else}
								<div
									class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
								>
									<div class="flex flex-col items-center gap-1 text-center">
										<h3 class="text-2xl font-bold tracking-tight">You have no services!</h3>
										<p class="text-sm text-muted-foreground">
											You can start rendering services as soon as you add a new client.
										</p>
										<Button class="mt-4" href="/services/add">Add Service</Button>
									</div>
								</div>
							{/if}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="cases">
				<Card.Root>
					<Card.Header class="px-7">
						<Card.Title>Cases</Card.Title>
						<Card.Description>All cases added to the system.</Card.Description>
					</Card.Header>
					<Card.Content>
						{#await $page.data.cases}
							<Loading />
						{:then cases}
							{#if cases.filter((_case) => _case.status?.at(-1).type !== 'Archived').length > 0}
								<CaseTable
									data={cases.filter((_case) => _case.status?.at(-1).type !== 'Archived')}
								/>
							{:else}
								<div
									class="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 shadow-sm"
								>
									<div class="flex flex-col items-center gap-1 text-center">
										<h3 class="text-2xl font-bold tracking-tight">You have no cases!</h3>
										<p class="text-sm text-muted-foreground">
											You can start rendering services as soon as you add a new case.
										</p>
										<Button class="mt-4" href="/cases/add">Add Case</Button>
									</div>
								</div>
							{/if}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
	<div>
		{#if Object.entries($selectedClients).length > 0}
			<SelectedClients />
		{:else if Object.entries($selectedServices).length > 0}
			<SelectedServices />
		{:else if Object.entries($selectedCases).length > 0}
			<SelectedCases />
		{/if}
	</div>
</main>
