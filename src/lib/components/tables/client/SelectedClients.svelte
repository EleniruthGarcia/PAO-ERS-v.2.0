<script lang="ts">
	import { ChevronLeft, ChevronRight, Copy, DotsVertical } from 'svelte-radix';

	import { toast } from 'svelte-sonner';

	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Separator } from '$lib/components/ui/separator';

	import type { Writable } from 'svelte/store';
	import type { Client } from '$lib/schema';
	import { getContext } from 'svelte';

	const selectedClients = getContext<Writable<Client[]>>('selectedClients');

	$: i = 0;
	$: client = $selectedClients[i];
</script>

<Card.Root class="overflow-hidden">
	<Card.Header class="flex flex-row items-start bg-muted/50">
		<div class="grid gap-0.5">
			<Card.Title class="group flex items-center gap-2 text-lg">
				<Button variant="link" class="p-0 text-lg text-foreground" href="/clients/{client._id}">
					{client.name}
				</Button>
				{#if $selectedClients.length > 1}
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						on:click={() => (i > 0 ? i-- : (i = $selectedClients.length - 1))}
					>
						<ChevronLeft class="h-3 w-3" />
						<span class="sr-only">Previous Client</span>
					</Button>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						on:click={() => (i < $selectedClients.length - 1 ? i++ : (i = 0))}
					>
						<ChevronRight class="h-3 w-3" />
						<span class="sr-only">Next Client</span>
					</Button>
				{/if}
				<Button
					size="icon"
					variant="outline"
					class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
					on:click={() =>
						navigator.clipboard
							.writeText(client._id)
							.then(() => toast(`Copied Client ID '${client._id}'.`))}
				>
					<Copy class="h-3 w-3" />
					<span class="sr-only">Copy Client ID</span>
				</Button>
			</Card.Title>
			<Card.Description>ID: {client._id}</Card.Description>
		</div>
		<div class="ml-auto flex items-center gap-1">
			<!-- <Button size="sm" variant="outline" class="h-8 gap-1">
					<Person class="h-3.5 w-3.5" />
					<span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"> Track Client </span>
				</Button> -->
			<AlertDialog.Root>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
							<DotsVertical class="h-3.5 w-3.5" />
							<span class="sr-only">More</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item href="/clients/{client._id}/edit">Edit</DropdownMenu.Item>
						<!-- <DropdownMenu.Item href="/clients/{client._id}/export">Export</DropdownMenu.Item> -->
						<DropdownMenu.Separator />
						<AlertDialog.Trigger class="w-full">
							<DropdownMenu.Item>Delete</DropdownMenu.Item>
						</AlertDialog.Trigger>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Delete Client</AlertDialog.Title>
						<AlertDialog.Description>
							Are you absolutely sure? The client will be archived and will not show up in Active
							Clients. If you want the client to be permanently deleted, please contact the
							administrator.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
						<form action="/clients/{client._id}/delete" method="POST">
							<AlertDialog.Action
								type="submit"
								class="w-full bg-destructive hover:bg-destructive/90"
							>
								Delete
							</AlertDialog.Action>
						</form>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</Card.Header>
	<Card.Content class="p-6 text-sm">
		<div class="grid gap-3">
			<div class="font-semibold">Personal Information</div>
			<ul class="grid gap-3">
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Age</span>
					<span>{client.age}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Sex</span>
					<span>{client.sex}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Civil Status</span>
					<span>{client.civilStatus}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Citizenship</span>
					<span>{client.citizenship !== '' && client.citizenship ? client.citizenship : 'N/A'}</span
					>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Language</span>
					<span>{client.language !== '' && client.language ? client.language : 'N/A'}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Religion</span>
					<span>{client.religion !== '' && client.religion ? client.religion : 'N/A'}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Educational Attainment</span>
					<span>{client.educationalAttainment}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Individual Monthly Income</span>
					<span
						>{client.individualMonthlyIncome !== '' && client.individualMonthlyIncome
							? client.individualMonthlyIncome
							: 'N/A'}</span
					>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Proof of Indigency</span>
					<span
						>{client.proofOfIndigency !== '' && client.proofOfIndigency
							? client.proofOfIndigency
							: 'N/A'}</span
					>
				</li>
			</ul>
		</div>
		<Separator class="my-4" />
		<div class="grid gap-3">
			<div class="font-semibold">Contact Information</div>
			<ul class="grid gap-3">
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Address</span>
					<span>{client.address}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Email</span>
					<span>{client.email !== '' && client.email ? client.email : 'N/A'}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Contact Number</span>
					<span>{client.contactNumber}</span>
				</li>
			</ul>
		</div>
		{#if client.civilStatus === 'Married'}
			<Separator class="my-4" />
			<div class="grid gap-3">
				<div class="font-semibold">Spouse Information</div>
				<ul class="grid gap-3">
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground">Name</span>
						<span>{client.spouseName}</span>
					</li>
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground">Address</span>
						<span>{client.spouseAddress}</span>
					</li>
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground">Email</span>
						<span>{client.spouseEmail ?? 'N/A'}</span>
					</li>
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground">Contact Number</span>
						<span>{client.spouseContactNumber}</span>
					</li>
				</ul>
			</div>
		{/if}
		{#if client.detained}
			<Separator class="my-4" />
			<div class="grid gap-3">
				<div class="font-semibold">Detainee Information</div>
				<ul class="grid gap-3">
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground">Place of Detention</span>
						<span>{client.detainedAt}</span>
					</li>
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground">Detained Since</span>
						<span>{client.detainedSince}</span>
					</li>
				</ul>
			</div>
		{/if}
		{#if client.foreignNational || client.pwd || client.indigenousPeople || client.urbanPoor || client.ruralPoor}
			<Separator class="my-4" />
			<div class="grid gap-3">
				<div class="font-semibold">Special Classifications</div>
				<ul class="grid gap-3">
					{#if client.foreignNational}
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Foreign Nationality</span>
							<span>{client.foreignNational}</span>
						</li>
					{/if}
					{#if client.pwd}
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Disability</span>
							<span>{client.pwd}</span>
						</li>
					{/if}
					{#if client.indigenousPeople}
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Indigenous Group</span>
							<span>{client.indigenousPeople}</span>
						</li>
					{/if}
					{#if client.lawEnforcer}
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Enforcer Rank</span>
							<span>{client.lawEnforcer}</span>
						</li>
					{/if}
					{#if client.urbanPoor}
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Urban Poor</span>
							<span>{client.urbanPoor}</span>
						</li>
					{/if}
					{#if client.ruralPoor}
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Rural Poor</span>
							<span>{client.ruralPoor}</span>
						</li>
					{/if}
				</ul>
			</div>
		{/if}
		{#if client.classification}
			<Separator class="my-4" />
			<div>
				<div class="mb-3 font-semibold">Classifications</div>
				{#each client.classification as classification}
					<Badge class="m-1">{classification}</Badge>
				{/each}
			</div>
		{/if}
	</Card.Content>
	<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
		<div class="text-xs text-muted-foreground">
			Updated <time>{client.status[client.status.length - 1].date.toLocaleString()}</time>
		</div>
		<Pagination.Root count={10} class="ml-auto mr-0 w-auto">
			<Pagination.Content>
				<Pagination.Item>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6"
						on:click={() => (i > 0 ? i-- : (i = $selectedClients.length - 1))}
					>
						<ChevronLeft class="h-3.5 w-3.5" />
						<span class="sr-only">Previous Client</span>
					</Button>
				</Pagination.Item>
				<Pagination.Item>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6"
						on:click={() => (i < $selectedClients.length - 1 ? i++ : (i = 0))}
					>
						<ChevronRight class="h-3.5 w-3.5" />
						<span class="sr-only">Next Client</span>
					</Button>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	</Card.Footer>
</Card.Root>
