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

<ModeWatcher />
<Toaster />
<slot />
