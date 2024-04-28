<script lang="ts">
	import type { PageServerData } from './$types';
	import { Copy, PlusCircled, DotsVertical } from 'svelte-radix';

	import { toast } from 'svelte-sonner';

	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/ui/badge';
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
							href="/clients/{data._case._id}"
						>
							{data._case.titleOfTheCase || 'Untitled Case'}
						</Button>
						<Button
							size="icon"
							variant="outline"
							class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
							on:click={() =>
								navigator.clipboard
									.writeText(data._case._id)
									.then(() => toast(`Copied data.client ID '${data._case._id}'!`))}
						>
							<Copy class="h-3 w-3" />
							<span class="sr-only">Copy Case ID</span>
						</Button>
					</Card.Title>
					<Card.Description>Date: November 23, 2023</Card.Description>
				</div>
				<div class="invisible ml-auto flex items-center gap-1 sm:visible">
					<Button
						size="sm"
						variant="outline"
						class="h-7 gap-1 text-sm"
						href="/clients/{data.client._id}/edit">Edit</Button
					>
					<Button size="sm" class="h-7 gap-1 text-sm" href="/clients/{data.client._id}/export"
						>Export</Button
					>
					<AlertDialog.Root>
						<AlertDialog.Trigger>
							<Button size="sm" variant="destructive" class="h-7 gap-1 bg-destructive text-sm"
								>{data.client.status.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}</Button
							>
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title
									>{data.client.status.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'} Client</AlertDialog.Title
								>
								<AlertDialog.Description>
									Are you absolutely sure? The client will be {data.client.status.at(-1)?.type ===
									'Archived'
										? 'restored'
										: 'archived'} and will {data.client.status.at(-1)?.type === 'Archived'
										? ''
										: 'not'} show up in Active Clients. If you want the client to be permanently deleted,
									please contact the administrator.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
								<form
									method="POST"
									action="/clients/{data.client._id}/{data.client.status.at(-1)?.type === 'Archived'
										? 'restore'
										: 'delete'}"
								>
									<AlertDialog.Action type="submit" class="bg-destructive hover:bg-destructive/90">
										{data.client.status.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
									</AlertDialog.Action>
								</form>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</div>
				<div class="visible ml-auto flex items-center gap-1 sm:hidden">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
								<DotsVertical class="h-3.5 w-3.5" />
								<span class="sr-only">More</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Item href="/clients/{data.client._id}/edit">Edit</DropdownMenu.Item>
							<DropdownMenu.Item href="/clients/{data.client._id}/export">Export</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<AlertDialog.Root>
								<AlertDialog.Trigger>
									<Button size="sm" variant="destructive" class="h-7 gap-1 bg-destructive text-sm"
										>{data.client.status.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}</Button
									>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title
											>{data.client.status.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'} Client</AlertDialog.Title
										>
										<AlertDialog.Description>
											Are you absolutely sure? The client will be {data.client.status.at(-1)
												?.type === 'Archived'
												? 'restored'
												: 'archived'} and will {data.client.status.at(-1)?.type === 'Archived'
												? ''
												: 'not'} show up in Active Clients. If you want the client to be permanently
											deleted, please contact the administrator.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<form
											method="POST"
											action="/clients/{data.client._id}/{data.client.status.at(-1)?.type ===
											'Archived'
												? 'restore'
												: 'delete'}"
										>
											<AlertDialog.Action
												type="submit"
												class="bg-destructive hover:bg-destructive/90"
											>
												{data.client.status.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
											</AlertDialog.Action>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</Card.Header>
			<Card.Content class="p-6 text-sm">
				<div class="grid gap-3">
					<div class="font-semibold">Personal Information</div>
					<ul class="grid gap-3">
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground"> Age </span>
							<span>{request.client.age}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground"> Sex </span>
							<span>{request.client.sex}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground"> Civil Status </span>
							<span>{request.client.civilStatus}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground"> Citizenship </span>
							<span>{request.client.citizenship}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground"> Language </span>
							<span>{request.client.language}</span>
						</li>
					</ul>
				</div>
				<Separator class="my-4" />
				<div class="grid gap-3">
					<div class="font-semibold">Interviewee Information</div>
					<ul class="grid gap-3">
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground"> Interviewee </span>
							<span>{request.interviewee.name}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground"> Relationshipto Client </span>
							<span>{request.relationshipToClient}</span>
						</li>
					</ul>
				</div>
				<Separator class="my-4" />
				<div class="grid gap-3">
					<div class="font-semibold">Lawyer Information</div>
					<ul class="grid gap-3">
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground"> Lawyer </span>
							<span>{request.lawyer.name}</span>
						</li>
					</ul>
				</div>
				<Separator class="my-4" />
				<div>
					<div class="font-semibold">Nature of Request</div>
					{#each request.nature as nature}
						<Badge class="m-1">{nature}</Badge>
					{/each}
					{#if request.otherNature != null}
						{#each request.otherNature as nature}
							<Badge class="m-1">{nature}</Badge>
						{/each}
					{/if}
				</div>
			</Card.Content>
			<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div class="text-xs text-muted-foreground">
					Updated <time dateTime="2023-11-23">November 23, 2023</time>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
	<div>
		<Card.Root class="overflow-hidden">
			<Card.Header class="flex flex-row items-start bg-muted/50">
				<div class="grid gap-0.5">
					<Card.Title class="text-md group flex items-center gap-2">Requests</Card.Title>
					<Card.Description>All active requests are shown here.</Card.Description>
				</div>
				<div class="ml-auto flex items-center gap-1">
					<Button size="sm" variant="outline" class="h-7 gap-2 text-sm" href="/requests/add"
						><PlusCircled class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only">Add</span></Button
					>
				</div>
			</Card.Header>
			<Card.Content class="p-6 text-sm">
				{#each data.requests as request, i}
					<div class="grid gap-3">
						<ul class="grid gap-3">
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground"> Nature </span>
								<span>{request.otherNature ? request.otherNature : request.nature}</span>
							</li>
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground"> Lawyer </span>
								<span>{request.lawyer.name}</span>
							</li>
						</ul>
					</div>
					{#if data.requests.length - 1 !== i}
						<Separator class="my-4" />
					{/if}
				{/each}
			</Card.Content>
			<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div class="text-xs text-muted-foreground">
					Updated <time dateTime="2023-11-23">November 23, 2023</time>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</main>
