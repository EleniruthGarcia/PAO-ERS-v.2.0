<script lang="ts">
	import { page } from '$app/stores';
	import { visibleLinks } from '$lib/links';
	import SidebarLink from './SidebarLink.svelte';

	const links = visibleLinks($page.data.user);
</script>

<aside class="hidden border-r [view-transition-name:sidebar] md:block lg:w-[280px]">
	<div class="flex h-full max-h-dvh flex-col gap-2">
		<div class="flex h-14 items-center px-4 lg:h-[60px] lg:border-b lg:px-6">
			<a href="/" class="flex items-center gap-2 font-semibold">
				<img src="/favicon.png" alt="PAO Logo" class="h-6 w-6 [view-transition-name:logo]" />
				<span class="hidden lg:block">PAO-ERS</span>
			</a>
		</div>
		<div class="flex-1">
			<nav class="grid items-start px-2 text-sm font-medium lg:px-4">
				{#each links as link}
					<SidebarLink {link} />
				{/each}
			</nav>
		</div>
		<!-- <div class="mt-auto p-4"></div> -->
	</div>
</aside>

<!-- 
<aside
	class="hidden h-dvh w-14 flex-col border-r bg-background [view-transition-name:sidebar] sm:flex"
>
	<nav class="flex flex-col items-center gap-4 px-2 py-4">
		<a
			href="/"
			class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground [view-transition-name:logo] md:h-8 md:w-8 md:text-base"
		>
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
</aside> -->
