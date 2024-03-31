<script lang="ts">
	import Loading from '$lib/components/utils/Loading.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

{#await data.user}
	<Loading />
{:then user}
	<ScrollArea class="flex h-screen w-screen flex-col">
		<Navbar />
		<div class="container h-full pt-16">
			<slot />
		</div>
	</ScrollArea>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
