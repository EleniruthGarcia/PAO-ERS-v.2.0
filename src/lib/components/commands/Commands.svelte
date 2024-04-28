<script lang="ts">
	import { goto } from '$app/navigation';

	import * as Command from '$lib/components/ui/command';

	import {
		Person,
		FileText,
		CardStack,
		ChatBubble,
		Gear,
		EnvelopeClosed,
		Plus
	} from 'svelte-radix';

	let clients = [];
	let requests = [];

	export let searchClients = () => {
		clients = [];
	};

	export let searchRequest = () => {
		requests = [];
	};
</script>

<Command.List>
	<Command.Empty>No results found.</Command.Empty>
	<Command.Group heading="Clients">
		<Command.Item onSelect={searchClients}>
			<Person class="mr-2 h-4 w-4" />
			<span>Search Clients...</span>
			<Command.Shortcut>⇧ C</Command.Shortcut>
		</Command.Item>
		<Command.Item>
			<Plus class="mr-2 h-4 w-4" />
			<span>Create New Client...</span>
			<Command.Shortcut>⌘ ⇧ C</Command.Shortcut>
		</Command.Item>
	</Command.Group>
	<Command.Group heading="Requests">
		<Command.Item onSelect={searchRequest}>
			<CardStack class="mr-2 h-4 w-4" />
			<span>Search Requests...</span>
			<Command.Shortcut>⇧ R</Command.Shortcut>
		</Command.Item>
		<Command.Item>
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
