<script lang="ts">
	import '../app.pcss';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	import { Commands } from '$lib/components/commands';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

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
	let value = '';
	let pages = ['Home'];

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Enter') {
				value = '';
			}
			if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
			if (e.key === 'Backspace' && value === '' && open) {
				e.preventDefault();
				if (pages.length === 1) open = !open;
				else pages = pages.slice(0, -1);
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<svelte:head>
	<meta charset="utf-8" />
	<title>PAO-ERS</title>

	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#000000" />

	<link rel="icon" type="image/png" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/favicon-192x192.png" />

	<link rel="mask-icon" href="/favicon.png" color="#5bbad5" />
	<link rel="manifest" href="/manifest.json" />

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

	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="mobile-wep-app-capable" content="yes" />s
</svelte:head>

<ModeWatcher />
<Toaster richColors closeButton />
<slot />

<Commands bind:open bind:value bind:pages />

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(root) {
		animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
