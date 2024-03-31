<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	const flash = getFlash(page);

	$: if ($flash) {
		toast($flash.message);

		$flash = undefined;
	}
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
