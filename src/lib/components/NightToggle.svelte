<script lang="ts">
	import { Sun, Moon } from 'svelte-radix';

	import { setMode, resetMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
</script>

<div class="relative">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
