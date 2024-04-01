<script lang="ts">
	import { page } from '$app/stores';

	import Rows from 'svelte-radix/Rows.svelte';
	import Home from 'svelte-radix/Home.svelte';
	import Person from 'svelte-radix/Person.svelte';
	import Gear from 'svelte-radix/Gear.svelte';
	import FileText from 'svelte-radix/FileText.svelte';
	import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte';

	import { Badge } from '$lib/components/ui/badge';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Shortcut } from '$lib/components/ui/command';
	import { Separator } from '$lib/components/ui/separator';
	import NightToggle from '../utils/NightToggle.svelte';

	const initials = () => {
		const name = $page.data.username as string;
		const n = name.split(' ');

		if (n.length === 1) return n[0].slice(0, 2);

		return n[0][0] + n[-1][0];
	};

	let form: HTMLFormElement;
</script>

<header
	class="sticky top-0 z-30 flex h-16 flex-none items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4"
>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
				<Rows class="h-5 w-5" />
				<span class="sr-only">Toggle Menu</span>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left" class="sm:max-w-xs">
			<nav class="grid gap-6 text-lg font-medium">
				<Sheet.Header>
					<Sheet.Title>
						<a
							href="/"
							class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
						>
							<img
								src="/favicon.png"
								alt="PAO Logo"
								class="h-9 w-9 transition-all group-hover:scale-110"
							/>
							<span class="sr-only">PAO-ERS</span>
						</a>
					</Sheet.Title>
				</Sheet.Header>
				<a
					href="##"
					class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
				>
					<Home class="h-5 w-5" />
					Dashboard
				</a>
				<a href="##" class="flex items-center gap-4 px-2.5 text-foreground">
					<Person class="h-5 w-5" />
					Clients
				</a>
				<a
					href="##"
					class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
				>
					<FileText class="h-5 w-5" />
					Reports
				</a>
				<a
					href="##"
					class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
				>
					<Gear class="h-5 w-5" />
					Settings
				</a>
			</nav>
		</Sheet.Content>
	</Sheet.Root>
	<Breadcrumb.Root class="hidden md:flex">
		<Breadcrumb.List>
			{#if $page.data.breadcrumbs && $page.data.breadcrumbs.length > 0}
				{#each $page.data.breadcrumbs as { text, href }, i}
					{#if i !== 0}
						<Breadcrumb.Separator />
					{/if}
					{#if i === $page.data.breadcrumbs.length - 1}
						<Breadcrumb.Page>
							<Breadcrumb.Link {href}>
								{text}
							</Breadcrumb.Link>
						</Breadcrumb.Page>
					{:else}
						<Breadcrumb.Item>
							<Breadcrumb.Link {href}>
								{text}
							</Breadcrumb.Link>
						</Breadcrumb.Item>
					{/if}
				{/each}
			{/if}
		</Breadcrumb.List>
	</Breadcrumb.Root>
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
		<span class="w-full px-4 text-start md:w-[280px]">Type a command or search...</span>
		<Shortcut>⌘K</Shortcut>
	</Button>
	<NightToggle />
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button
				variant="outline"
				size="icon"
				class="overflow-hidden rounded-full"
				builders={[builder]}
			>
				<Avatar.Root>
					<Avatar.Fallback>{initials().toUpperCase()}</Avatar.Fallback>
				</Avatar.Root>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content>
			<Sheet.Header>
				<div class="flex items-center gap-4 pr-5">
					<Avatar.Root>
						<Avatar.Fallback>{initials().toUpperCase()}</Avatar.Fallback>
					</Avatar.Root>
					<div class="grow">
						<Sheet.Title>
							{$page.data.username}
						</Sheet.Title>
						{#if $page.data.name}
							<Sheet.Description>
								{$page.data.name}
							</Sheet.Description>
						{/if}
					</div>
				</div>
			</Sheet.Header>
			<div class="grid gap-1 py-2">
				<Button variant="ghost" class="w-full items-start justify-start">My Account</Button>
				<Separator />
				<Button variant="ghost" class="w-full items-start justify-start">Settings</Button>
				<Button variant="ghost" class="w-full items-start justify-start">Support</Button>
				<Separator />
				<form bind:this={form} action="/logout" method="POST" />
				<Button
					variant="ghost"
					class="w-full items-start justify-start"
					on:click={() => form.submit()}>Logout</Button
				>
			</div>
		</Sheet.Content>
	</Sheet.Root>
</header>
