<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary dependencies and components.
	import NavBar from '$lib/components/NavBar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
</script>

<!-- This controls the main layout of the system but for specifics, edit them on corresponding page files. -->

<ScrollArea class="h-dvh w-dvw">
	<div class="flex min-h-dvh w-full flex-col">
		<NavBar />
		<main class="container h-full flex-1 p-4 md:p-8">
			<slot />
		</main>
	</div>
</ScrollArea>
