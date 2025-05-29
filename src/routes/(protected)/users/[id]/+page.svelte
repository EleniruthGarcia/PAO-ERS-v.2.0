<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary dependencies and components.
	import type { PageServerData } from './$types';
	import { Copy, DotsVertical } from 'svelte-radix';
	import { toast } from 'svelte-sonner';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	export let data: PageServerData;
</script>

<main class="grid gap-4 md:grid-cols-2">
	<Card.Root class="overflow-hidden">
		<Card.Header class="flex flex-row items-start bg-muted/50">
			<div class="grid gap-0.5">
				<Card.Title class="group flex items-center gap-2 text-lg">
					<Button
						variant="link"
						class="p-0 text-lg text-foreground"
						href="/users/{data.user.username}"
					>
						{data.user.name}
					</Button>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						on:click={() =>
							navigator.clipboard
								.writeText(data.user._id)
								.then(() => toast(`Copied data.user ID '${data.user._id}'!`))}
					>
						<Copy class="h-3 w-3" />
						<span class="sr-only">Copy User ID</span>
					</Button>
				</Card.Title>
				<Card.Description>
					<Badge variant="outline" class="mr-2">{data.user.role}</Badge>{data.user.position}
				</Card.Description>
			</div>
			<div class="invisible ml-auto flex items-center gap-1 sm:visible">
				<Button
					size="sm"
					variant="outline"
					class="h-7 gap-1 text-sm"
					href="/users/{data.user.username}/edit"
				>
					Edit
				</Button>
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<Button size="sm" variant="destructive" class="h-7 gap-1 bg-destructive text-sm">
							{data.user.currentStatus === 'Archived' ? 'Restore' : 'Delete'}
						</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>
								{data.user.currentStatus === 'Archived' ? 'Restore' : 'Delete'} User
							</AlertDialog.Title>
							<AlertDialog.Description>
								Are you absolutely sure? The user will be {data.user.currentStatus === 'Archived'
									? 'restored'
									: 'archived'}.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
							<form
								method="POST"
								action="/users/{data.user.username}/{data.user.currentStatus === 'Archived'
									? 'restore'
									: 'delete'}"
							>
								<AlertDialog.Action
									type="submit"
									class="w-full bg-destructive hover:bg-destructive/90"
								>
									{data.user.currentStatus === 'Archived' ? 'Restore' : 'Delete'}
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
							<DropdownMenu.Item href="/users/{data.user.username}/edit">Edit</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<AlertDialog.Trigger class="w-full text-left">
								<DropdownMenu.Item>
									{data.user.currentStatus === 'Archived' ? 'Restore' : 'Delete'}
								</DropdownMenu.Item>
							</AlertDialog.Trigger>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>
								{data.user.currentStatus === 'Archived' ? 'Restore' : 'Delete'} Client
							</AlertDialog.Title>
							<AlertDialog.Description>
								Are you absolutely sure? The user will be {data.user.currentStatus === 'Archived'
									? 'restored'
									: 'archived'}.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
							<form
								method="POST"
								action="/users/{data.user.username}/{data.user.currentStatus === 'Archived'
									? 'restore'
									: 'delete'}"
							>
								<AlertDialog.Action
									type="submit"
									class="w-full bg-destructive hover:bg-destructive/90"
								>
									{data.user.currentStatus === 'Archived' ? 'Restore' : 'Delete'}
								</AlertDialog.Action>
							</form>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</Card.Header>

		<!-- ACCOUNT INFORMATION -->

		<Card.Content class="p-6 text-sm">
			<div class="grid gap-3">
				<div class="font-semibold">Account Information</div>
				<ul class="grid gap-3">
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground">Username</span>
						<span>{data.user.username ?? 'N/A'}</span>
					</li>
				</ul>
			</div>
		</Card.Content>
		<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
			<div class="text-xs text-muted-foreground">
				Updated <time>{data.user.status[data.user.status.length - 1].date.toLocaleString()}</time>
			</div>
		</Card.Footer>
	</Card.Root>
</main>
