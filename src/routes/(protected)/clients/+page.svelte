<script lang="ts">
	import clsx from 'clsx';
	import type { Client } from '$lib/server/database';
	import type { PageServerData } from './$types';

	import Loading from '$lib/components/Loading.svelte';
	import { ClientTable, SelectedClients } from '$lib/components/tables/client';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';

	export let data: PageServerData;

	let selectedClients: Client[] = [];
</script>

{#await data.records}
	<Loading />
{:then records}
	<main class={clsx('grid gap-4', selectedClients.length > 0 && 'lg:grid-cols-3 xl:grid-cols-3')}>
		<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
			<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
				<Card.Root class="sm:col-span-2">
					<Card.Header class="pb-3">
						<Card.Title>Your Clients</Card.Title>
						<Card.Description class="max-w-lg text-balance leading-relaxed">
							View and manage your clients here to keep track of their requests and cases.
						</Card.Description>
					</Card.Header>
					<Card.Footer>
						<Button href="/clients/add">Add Client</Button>
					</Card.Footer>
				</Card.Root>
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Description>This Week</Card.Description>
						<Card.Title class="text-4xl">$1329</Card.Title>
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
						<Card.Description>This Month</Card.Description>
						<Card.Title class="text-3xl">$5,329</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-xs text-muted-foreground">+10% from last month</div>
					</Card.Content>
					<Card.Footer>
						<Progress value={12} aria-label="12% increase" />
					</Card.Footer>
				</Card.Root>
			</div>
			<ClientTable />
		</div>
		{#if selectedClients.length > 0}
			<div>
				<SelectedClients {selectedClients} />
			</div>
		{/if}
	</main>
{/await}
