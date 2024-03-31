<script lang="ts">
	import Header from '$lib/components/navigation/Header.svelte';
	import Sidebar from '$lib/components/navigation/Sidebar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
</script>

<div class="flex h-screen w-screen">
	<Sidebar />
	<ScrollArea class="flex h-full flex-col">
		<Header />
		<div class="flex-1">
			<slot />
		</div>
	</ScrollArea>
</div>
