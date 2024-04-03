<script lang="ts">
	import Header from '$lib/components/navigation/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
</script>

<div class="flex bg-muted">
	<Sidebar />
	<ScrollArea class="h-dvh w-full">
		<div class="flex h-dvh min-h-screen w-full flex-col sm:gap-4 sm:py-4">
			<Header />
			<slot />
		</div>
	</ScrollArea>
</div>
