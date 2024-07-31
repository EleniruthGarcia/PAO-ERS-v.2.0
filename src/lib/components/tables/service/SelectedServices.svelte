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
	import type { ServiceWithJoins } from '$lib/schema';
	import { getContext } from 'svelte';

	const selectedServices = getContext<Writable<ServiceWithJoins[]>>('selectedServices');

	$: i = 0;
	$: service = $selectedServices[i];
</script>

<Card.Root class="overflow-hidden">
	<Card.Header class="flex flex-row items-start bg-muted/50">
		<div class="grid gap-0.5">
			<Card.Title class="group flex items-center gap-2 text-lg">
				<Button variant="link" class="p-0 text-lg text-foreground" href="/services/{service._id}">
					{service.title}
				</Button>
				{#if $selectedServices.length > 1}
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						on:click={() => (i > 0 ? i-- : (i = $selectedServices.length - 1))}
					>
						<ChevronLeft class="h-3 w-3" />
						<span class="sr-only">Previous Service</span>
					</Button>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						on:click={() => (i < $selectedServices.length - 1 ? i++ : (i = 0))}
					>
						<ChevronRight class="h-3 w-3" />
						<span class="sr-only">Next Service</span>
					</Button>
				{/if}
				<Button
					size="icon"
					variant="outline"
					class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
					on:click={() =>
						navigator.clipboard
							.writeText(service._id)
							.then(() => toast(`Copied Service ID '${service._id}'.`))}
				>
					<Copy class="h-3 w-3" />
					<span class="sr-only">Copy Service ID</span>
				</Button>
			</Card.Title>
			<Card.Description
				><Badge variant="outline" class="mr-2">{service.typeOfService}</Badge> ID: {service._id}</Card.Description
			>
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
						<DropdownMenu.Item href="/services/{service._id}/edit">Edit</DropdownMenu.Item>
						<DropdownMenu.Item href="/services/{service._id}/export">Export</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<AlertDialog.Trigger class="w-full">
							<DropdownMenu.Item>Delete</DropdownMenu.Item>
						</AlertDialog.Trigger>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Delete Service</AlertDialog.Title>
						<AlertDialog.Description>
							Are you absolutely sure? The service will be
							{service.status?.at(-1)?.type === 'Archived' ? 'restored' : 'archived'}.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<form action="/services/{service._id}/delete" method="POST">
							<AlertDialog.Action type="submit" class="bg-destructive hover:bg-destructive/90">
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
			<div class="font-semibold">Client Information</div>
			<ul class="grid gap-3">
				{#each service.client as client}
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground">Client</span>
						<span>{client.name}</span>
					</li>
				{/each}
			</ul>
		</div>
		<Separator class="my-4" />
		<div class="grid gap-3">
			<div class="font-semibold">Interviewee Information</div>
			<ul class="grid gap-3">
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Interviewee</span>
					<span>{service.interviewee.name}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Relationship to Client</span>
					<span>{service.relationshipToClient}</span>
				</li>
			</ul>
		</div>
		<Separator class="my-4" />
		<div class="grid gap-3">
			<div class="font-semibold">Lawyer Information</div>
			<ul class="grid gap-3">
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground">Lawyer</span>
					<span>{service.lawyer.name}</span>
				</li>
			</ul>
		</div>
		<Separator class="my-4" />
		<div>
			<div class="mb-3 font-semibold">Nature of Service</div>
			{#each service.nature as nature}
				<Badge class="mr-1">{nature}</Badge>
			{/each}
			{#if service.otherNature != null}
				{#each service.otherNature as nature}
					<Badge class="mr-1">{nature}</Badge>
				{/each}
			{/if}
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
		<div class="text-xs text-muted-foreground">
			Updated <time>{service.status[service.status.length - 1].date.toLocaleString()}</time>
		</div>
		<Pagination.Root count={10} class="ml-auto mr-0 w-auto">
			<Pagination.Content>
				<Pagination.Item>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6"
						on:click={() => (i > 0 ? i-- : (i = $selectedServices.length - 1))}
					>
						<ChevronLeft class="h-3.5 w-3.5" />
						<span class="sr-only">Previous Service</span>
					</Button>
				</Pagination.Item>
				<Pagination.Item>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6"
						on:click={() => (i < $selectedServices.length - 1 ? i++ : (i = 0))}
					>
						<ChevronRight class="h-3.5 w-3.5" />
						<span class="sr-only">Next Service</span>
					</Button>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	</Card.Footer>
</Card.Root>
