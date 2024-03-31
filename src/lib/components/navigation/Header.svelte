<script lang="ts">
	import { page } from '$app/stores';

	import Rows from 'svelte-radix/Rows.svelte';
	import CrumpledPaper from 'svelte-radix/CrumpledPaper.svelte';
	import Home from 'svelte-radix/Home.svelte';
	import Person from 'svelte-radix/Person.svelte';
	import Gear from 'svelte-radix/Gear.svelte';
	import FileText from 'svelte-radix/FileText.svelte';
	import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Shortcut } from '$lib/components/ui/command';

	const initials = () => {
		const name = $page.data.username as string;
		const n = name.split(' ');

		if (n.length === 1) return n[0].slice(0, 2);

		return n[0][0] + n[-1][0];
	};

	let form: HTMLFormElement;
</script>

<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
	<header
		class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
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
					<a
						href="##"
						class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
					>
						<CrumpledPaper class="h-5 w-5 transition-all group-hover:scale-110" />
						<span class="sr-only">PAO-ERS</span>
					</a>
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
				<Breadcrumb.Item>
					<Breadcrumb.Link href="##">Dashboard</Breadcrumb.Link>
				</Breadcrumb.Item>
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
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
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
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Settings</DropdownMenu.Item>
				<DropdownMenu.Item>Support</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<form bind:this={form} action="/logout" method="POST" />
				<DropdownMenu.Item on:click={() => form.submit()}>Logout</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</header>
</div>
