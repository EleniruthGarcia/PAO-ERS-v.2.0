<script lang="ts">
	import Header from '$lib/components/navigation/Header.svelte';
	import Sidebar from '$lib/components/navigation/Sidebar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
</script>

<div class="flex h-screen w-screen">
	<Sidebar />
	<ScrollArea class="flex h-full w-full flex-1 flex-col">
		<Header />
		<div class="h-full w-full flex-1">
			<slot />
		</div>
	</ScrollArea>
</div>
