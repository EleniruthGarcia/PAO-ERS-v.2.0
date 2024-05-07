<script lang="ts">
	import { MagnifyingGlass } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button';
	import { Shortcut } from '$lib/components/ui/command';
</script>

<Button
	variant="outline"
	class="ml-auto flex flex-1 text-muted-foreground hover:text-muted-foreground md:grow-0"
	on:click={() =>
		document.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'k',
				metaKey: true
			})
		)}
>
	<MagnifyingGlass class="h-4 w-4" />
	<span class="w-auto truncate px-4 text-start max-[480px]:hidden md:w-[280px]">
		Type a command or search...
	</span>
	<Shortcut>⌘K</Shortcut>
</Button>
