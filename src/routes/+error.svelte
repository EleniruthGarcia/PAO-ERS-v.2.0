<script lang="ts">
	import { page } from '$app/stores';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { getFlash, updateFlash } from 'sveltekit-flash-message';

	const flash = getFlash(page);
	$flash = { type: 'error', message: $page.error?.message || 'An error occurred!' };

	onMount(() => {
		toast.error($page.error?.message || 'An error occurred!');
		updateFlash(page, () => goto('/'));
	});
</script>
