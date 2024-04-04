<script lang="ts">
	import { Home, Person, Gear, FileText } from 'svelte-radix';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';
</script>

<aside class="hidden h-dvh flex-col border-r bg-background [view-transition-name:sidebar] sm:flex">
	<div class="flex h-14 w-max items-center border-b px-4 pr-8 lg:h-[60px]">
		<a href="/" class="flex items-center gap-2 font-semibold [view-transition-name:logo]">
			<img
			src="/favicon.png"
			alt="PAO Logo"
			class="h-6 w-6 transition-all group-hover:scale-110 md:h-7 md:w-7"
		/>
		  <span class="">PAO-ERS</span>
		</a>
	  </div>
	<nav class="flex flex-col items-start gap-2 px-2 py-4">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					href="/dashboard"
					variant="ghost"
					class="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary"
					builders={[builder]}
				>
					<Home class="h-5 w-5" />
					Dashboard
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Go to Dashboard</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					href="/clients"
					variant="ghost"
					class="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary"
					builders={[builder]}
				>
					<Person class="h-5 w-5" />
					Clients
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">View Clients</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					href="/reports"
					variant="ghost"
					class="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary"
					builders={[builder]}
				>
					<FileText class="h-5 w-5" />
					Reports
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">View Reports</Tooltip.Content>
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
