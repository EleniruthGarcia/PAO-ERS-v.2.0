<script lang="ts">
	import '../app.pcss';
	import { page } from '$app/stores';

	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<main class="h-screen flex">
	{#if $page.data.user}
		<Sidebar />
	{/if}

	<slot />
</main>
