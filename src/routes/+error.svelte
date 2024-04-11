<script lang="ts">
	import { page } from '$app/stores';

	// import { onMount } from 'svelte';
	// import { goto } from '$app/navigation';
	// import { toast } from 'svelte-sonner';
	// import { getFlash, updateFlash } from 'sveltekit-flash-message';

	// const flash = getFlash(page);
	// $flash = { type: 'error', message: $page.error?.message || 'An error occurred!' };
	// toast.error($page.error?.message || 'An error occurred!');
	// onMount(() => updateFlash(page, () => goto('/')));
</script>

<main class="grid h-screen place-items-center">
	<h1 class="text-4xl font-bold text-red-500">Error</h1>
	<p class="text-lg text-gray-500">An error occurred!</p>

	{#if $page.error}
		<pre class="text-sm text-red-500">{$page.error.message}</pre>
	{/if}
</main>
