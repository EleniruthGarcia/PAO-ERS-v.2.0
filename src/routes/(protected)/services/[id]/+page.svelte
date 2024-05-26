<script lang="ts">
	import type { PageServerData } from './$types';
	import { Copy, DotsVertical } from 'svelte-radix';

	import { toast } from 'svelte-sonner';

	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';

	export let data: PageServerData;
</script>

<main class="grid gap-4 md:grid-cols-2">
	<div class="grid auto-rows-max items-start gap-4 md:gap-8">
		<Card.Root class="overflow-hidden">
			<Card.Header class="flex flex-row items-start bg-muted/50">
				<div class="grid gap-0.5">
					<Card.Title class="group flex items-center gap-2 text-lg">
						<Button
							variant="link"
							class="p-0 text-lg text-foreground"
							href="/services/{data.service._id}"
						>
							{data.service.otherNature || data.service.nature}
						</Button>
						<Button
							size="icon"
							variant="outline"
							class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
							on:click={() =>
								navigator.clipboard
									.writeText(data.service._id)
									.then(() => toast(`Copied data.service ID '${data.service._id}'!`))}
						>
							<Copy class="h-3 w-3" />
							<span class="sr-only">Copy Case ID</span>
						</Button>
					</Card.Title>
					<Card.Description>
						{data.client.length > 1
							? data.client.length > 2
								? `${data.client[0].lastName} et. al.`
								: `${data.client[0].lastName} and ${data.client[1].lastName}`
							: data.client[0].name}
					</Card.Description>
				</div>
				<div class="invisible ml-auto flex items-center gap-1 sm:visible">
					<Button
						size="sm"
						variant="outline"
						class="h-7 gap-1 text-sm"
						href="/services/{data.service._id}/edit"
					>
						Edit
					</Button>
					<!-- <Button size="sm" class="h-7 gap-1 text-sm" href="/services/{data.service._id}/export"
						>Export</Button
					> -->
					<AlertDialog.Root>
						<AlertDialog.Trigger>
							<Button size="sm" variant="destructive" class="h-7 gap-1 bg-destructive text-sm">
								{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
							</Button>
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>
									{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'} Service
								</AlertDialog.Title>
								<AlertDialog.Description>
									Are you absolutely sure? The service will be
									{data.service.status?.at(-1)?.type === 'Archived' ? 'restored' : 'archived'}.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
								<form
									method="POST"
									action="/services/{data.service._id}/{data.service.status?.at(-1)?.type ===
									'Archived'
										? 'restore'
										: 'delete'}"
								>
									<AlertDialog.Action
										type="submit"
										class="w-full bg-destructive hover:bg-destructive/90"
									>
										{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
									</AlertDialog.Action>
								</form>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</div>
				<div class="visible ml-auto flex items-center gap-1 sm:hidden">
					<AlertDialog.Root>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
									<DotsVertical class="h-3.5 w-3.5" />
									<span class="sr-only">More</span>
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<DropdownMenu.Item href="/services/{data.service._id}/edit">Edit</DropdownMenu.Item>
								<!-- <DropdownMenu.Item href="/services/{data.service._id}/export"
								>Export</DropdownMenu.Item
							> -->
								<DropdownMenu.Separator />
								<AlertDialog.Trigger class="w-full text-left">
									<DropdownMenu.Item>
										{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
									</DropdownMenu.Item>
								</AlertDialog.Trigger>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>
									{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'} Service
								</AlertDialog.Title>
								<AlertDialog.Description>
									Are you absolutely sure? The service will be
									{data.service.status?.at(-1)?.type === 'Archived' ? 'restored' : 'archived'}.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
								<form
									method="POST"
									action="/services/{data.service._id}/{data.service.status?.at(-1)?.type ===
									'Archived'
										? 'restore'
										: 'delete'}"
								>
									<AlertDialog.Action
										type="submit"
										class="w-full bg-destructive hover:bg-destructive/90"
									>
										{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
									</AlertDialog.Action>
								</form>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</div>
			</Card.Header>
			<Card.Content class="p-6 text-sm">
				<div class="grid gap-3">
					<div class="font-semibold">Interviewee Information</div>
					<ul class="grid gap-3">
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Interviewee</span>
							<span>{data.service.interviewee.name}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Relationship to Client</span>
							<span>{data.service.relationshipToClient}</span>
						</li>
					</ul>
				</div>
				<Separator class="my-4" />
				<div class="grid gap-3">
					<div class="font-semibold">Lawyer Information</div>
					<ul class="grid gap-3">
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Lawyer</span>
							<span>{data.service.lawyer.name}</span>
						</li>
					</ul>
				</div>
			</Card.Content>
			<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div class="text-xs text-muted-foreground">
					Updated <time>
						{data.service.status[data.service.status.length - 1].date.toLocaleString()}
					</time>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
	<div>
		<Card.Root class="overflow-hidden">
			<Card.Header class="flex flex-row items-start bg-muted/50">
				<div class="grid gap-0.5">
					<Card.Title class="text-md group flex items-center gap-2">Client List</Card.Title>
					<Card.Description>All clients connected to this service are shown here.</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="p-6 text-sm">
				{#each data.client as client, i}
					<div class="grid gap-3">
						<ul class="grid gap-3">
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Name</span>
								<span>{client.name}</span>
							</li>
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
						</ul>
					</div>
					{#if data.client.length - 1 !== i}
						<Separator class="my-4" />
					{/if}
				{/each}
			</Card.Content>
			<!-- <Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div class="text-xs text-muted-foreground">
					Updated <time dateTime="2023-11-23">November 23, 2023</time>
				</div>
			</Card.Footer> -->
		</Card.Root>
	</div>
</main>
