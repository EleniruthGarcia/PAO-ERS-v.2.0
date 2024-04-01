<script lang="ts">
	import Home from 'svelte-radix/Home.svelte';
	import Person from 'svelte-radix/Person.svelte';
	import Gear from 'svelte-radix/Gear.svelte';
	import FileText from 'svelte-radix/FileText.svelte';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';
</script>

<aside class="hidden h-screen w-16 flex-none flex-col border-r bg-background sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 py-4">
		<a
			href="/"
			class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground [view-transition-name:logo] md:h-8 md:w-8 md:text-base"
		>
			<img
				src="/favicon.png"
				alt="PAO Logo"
				class="h-8 w-8 transition-all group-hover:scale-110 md:h-7 md:w-7"
			/>
			<span class="sr-only">PAO-ERS</span>
		</a>
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					href="/dashboard"
					size="icon"
					variant="ghost"
					class="text-muted-foreground"
					builders={[builder]}
				>
					<Home class="h-5 w-5" />
					<span class="sr-only">Dashboard</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Dashboard</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					href="/clients"
					size="icon"
					variant="ghost"
					class="text-muted-foreground"
					builders={[builder]}
				>
					<Person class="h-5 w-5" />
					<span class="sr-only">Clients</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Clients</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					href="/reports"
					size="icon"
					variant="ghost"
					class="text-muted-foreground"
					builders={[builder]}
				>
					<FileText class="h-5 w-5" />
					<span class="sr-only">Reports</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Reports</Tooltip.Content>
		</Tooltip.Root>
	</nav>
	<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					href="/settings"
					size="icon"
					variant="ghost"
					class="text-muted-foreground"
					builders={[builder]}
				>
					<Gear class="h-5 w-5" />
					<span class="sr-only">Settings</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Settings</Tooltip.Content>
		</Tooltip.Root>
	</nav>
</aside>
