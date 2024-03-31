<script lang="ts">
	import Loading from '$lib/components/utils/Loading.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

{#await data.user}
	<Loading />
{:then user}
	<Navbar />
	<div class="container py-6">
		<slot />
	</div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
