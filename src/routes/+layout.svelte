<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	import Calendar from 'svelte-radix/Calendar.svelte';
	import EnvelopeClosed from 'svelte-radix/EnvelopeClosed.svelte';
	import Face from 'svelte-radix/Face.svelte';
	import Gear from 'svelte-radix/Gear.svelte';
	import Person from 'svelte-radix/Person.svelte';
	import Rocket from 'svelte-radix/Rocket.svelte';

	import { onMount } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';

	const flash = getFlash(page);

	$: if ($flash) {
		toast($flash.message);

		$flash = undefined;
	}

	let open = false;

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<svelte:head>
	<title>PAO-ERS</title>

	<meta name="twitter:title" content="PAO-ERS" />
	<meta name="twitter:description" content="Public Attorney's Office - Electronic Records System" />
	<meta
		name="description"
		content="PAO-ERS is a web-based application that aims to streamline the process of managing records in the Public Attorney's Office."
	/>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="PAO-ERS" />
	<meta
		property="og:description"
		content="PAO-ERS is a web-based application that aims to streamline the process of managing records in the Public Attorney's Office."
	/>
	<meta property="og:url" content={$page.url.origin} />
	<meta property="og:image" content={$page.url.origin + '/favicon.png'} />
</svelte:head>

<ModeWatcher />
<Toaster />
<slot />

<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Suggestions">
			<Command.Item>
				<Calendar class="mr-2 h-4 w-4" />
				<span>Calendar</span>
			</Command.Item>
			<Command.Item>
				<Face class="mr-2 h-4 w-4" />
				<span>Search Emoji</span>
			</Command.Item>
			<Command.Item>
				<Rocket class="mr-2 h-4 w-4" />
				<span>Launch</span>
			</Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Settings">
			<Command.Item>
				<Person class="mr-2 h-4 w-4" />
				<span>Profile</span>
				<Command.Shortcut>⌘P</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<EnvelopeClosed class="mr-2 h-4 w-4" />
				<span>Mail</span>
				<Command.Shortcut>⌘B</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<Gear class="mr-2 h-4 w-4" />
				<span>Settings</span>
				<Command.Shortcut>⌘S</Command.Shortcut>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
