<script lang="ts">
	import Loading from '$lib/components/utils/Loading.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

{#await data.user}
	<Loading />
{:then user}
	<div class="flex h-screen w-screen flex-col">
		<Navbar />
		<div class="container h-full py-6">
			<slot />
		</div>
	</div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
