<script lang="ts">
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

{#await data.user}
	<p>Loading...</p>
{:then user}
	<Navbar />
	<slot />
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
