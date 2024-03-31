<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	import { onMount } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import Commands from '$lib/components/utils/Commands.svelte';

	const flash = getFlash(page);

	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				toast.success($flash.message);
				break;
			case 'error':
				toast.error($flash.message);
				break;
			case 'info':
				toast.info($flash.message);
				break;
			case 'warning':
				toast.warning($flash.message);
				break;
			case 'description':
				toast.message($flash.message, {
					description: $flash.description
				});
				break;
			case 'action':
				toast($flash.message, {
					action: $flash.action
				});
				break;
			case 'promise':
				toast.promise($flash.promise, {
					loading: $flash.loading,
					success: $flash.success,
					error: $flash.error
				});
				break;
			case 'loading':
				toast.loading($flash.message);
				break;
			default:
				toast($flash.message);
				break;
		}

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
<Toaster richColors closeButton position="top-right" />
<slot />

<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search..." />
	<Commands />
</Command.Dialog>
