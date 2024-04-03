<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
</script>

<ScrollArea class="h-dvh w-dvw">
	<div class="flex min-h-dvh w-full flex-col">
		<NavBar />
		<main class="container h-full flex-1 p-4 md:p-8">
			<slot />
		</main>
	</div>
</ScrollArea>
