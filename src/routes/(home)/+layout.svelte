<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

{#await data.user}
	<Loading />
{:then user}
	<ScrollArea class="flex h-dvh w-screen bg-muted">
		<div class="flex h-dvh w-full flex-col">
			<Navbar />
			<div class="h-full w-full">
				<slot />
			</div>
		</div>
	</ScrollArea>
{/await}
