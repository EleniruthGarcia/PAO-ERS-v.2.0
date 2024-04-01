<script lang="ts">
	import Header from '$lib/components/navigation/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
</script>

<ScrollArea class="flex h-screen w-screen">
	<div class="flex h-screen w-screen">
		<Sidebar />
		<div class="flex h-full w-full flex-1 flex-col">
			<Header />
			<slot />
		</div>
	</div>
</ScrollArea>
