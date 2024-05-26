<script lang="ts">
	import { page } from '$app/stores';

	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	import {
		Person,
		FileText,
		CardStack,
		ChatBubble,
		Gear,
		EnvelopeClosed,
		Plus
	} from 'svelte-radix';

	export let open = false;
	export let value = '';
	export let pages = ['Home'];

	let clients = $page.data.allClients ?? [];
	let services = $page.data.allServices ?? [];
</script>

<Command.Dialog bind:open>
	<Breadcrumb.Root class="pl-4 pt-4">
		<Breadcrumb.List>
			{#each pages as page, i}
				{#if i < pages.length - 1}
					<Breadcrumb.Item>
						{page}
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
				{:else}
					<Breadcrumb.Page>
						{page}
					</Breadcrumb.Page>
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<Command.Input placeholder="Type a command or search..." bind:value />
	{#if pages.at(-1) === 'Home'}
		<Command.List>
			<Command.Empty>No results found.</Command.Empty>
			{#if $page.data.user}
				<Command.Group heading="Clients">
					<Command.Item
						onSelect={() => {
							pages = [...pages, 'Clients'];
							value = '';
						}}
					>
						<Person class="mr-2 h-4 w-4" />
						<span>Search Clients...</span>
						<Command.Shortcut>⇧ C</Command.Shortcut>
					</Command.Item>
					<Command.Item onSelect={() => (window.location.href = '/clients/add')}>
						<Plus class="mr-2 h-4 w-4" />
						<span>Create New Client...</span>
						<Command.Shortcut>⌘ ⇧ C</Command.Shortcut>
					</Command.Item>
				</Command.Group>
				<Command.Group heading="Services">
					<Command.Item onSelect={() => (pages = [...pages, 'Services'])}>
						<CardStack class="mr-2 h-4 w-4" />
						<span>Search Services...</span>
						<Command.Shortcut>⇧ R</Command.Shortcut>
					</Command.Item>
					<Command.Item onSelect={() => (window.location.href = '/services/add')}>
						<Plus class="mr-2 h-4 w-4" />
						<span>Create New Request...</span>
						<Command.Shortcut>⌘ ⇧ R</Command.Shortcut>
					</Command.Item>
				</Command.Group>
				<Command.Group heading="Reports">
					<Command.Item>
						<FileText class="mr-2 h-4 w-4" />
						<span>Generate Report...</span>
						<Command.Shortcut>⌘ R</Command.Shortcut>
					</Command.Item>
				</Command.Group>
				<Command.Group heading="Settings">
					<Command.Item onSelect={() => (window.location.href = '/settings')}>
						<Gear class="mr-2 h-4 w-4" />
						<span>Open Settings</span>
						<Command.Shortcut>⌘ ,</Command.Shortcut>
					</Command.Item>
				</Command.Group>
			{/if}
			<Command.Group heading="Help">
				<Command.Item>
					<FileText class="mr-2 h-4 w-4" />
					<span>Search Docs...</span>
					<Command.Shortcut>⇧ D</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<ChatBubble class="mr-2 h-4 w-4" />
					<span>Send Feedback...</span>
				</Command.Item>
				<Command.Item>
					<EnvelopeClosed class="mr-2 h-4 w-4" />
					<span>Contact Support</span>
				</Command.Item>
			</Command.Group>
		</Command.List>
	{/if}
	{#if pages.at(-1) === 'Clients'}
		<Command.List>
			<Command.Empty>No clients found.</Command.Empty>
			<Command.Group heading="Clients">
				{#each clients as client}
					<Command.Item onSelect={() => (window.location.href = `/clients/${client._id}`)}>
						<Person class="mr-2 h-4 w-4" />
						<span>{client.name}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.List>
	{/if}
	{#if pages.at(-1) === 'Services'}
		<Command.List>
			<Command.Empty>No request found.</Command.Empty>
			<Command.Group heading="Services">
				{#each services as request}
					<Command.Item onSelect={() => (window.location.href = `/clients/${request._id}`)}>
						<CardStack class="mr-2 h-4 w-4" />
						<span>{request.otherNature ?? request.nature}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.List>
	{/if}
</Command.Dialog>
