<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary dependencies and components.
	import Account from '$lib/components/Account.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DashboardMenu from '$lib/components/DashboardMenu.svelte';
	import NightToggle from '$lib/components/NightToggle.svelte';
	import Search from '$lib/components/Search.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { ChatBubble } from 'svelte-radix';
</script>

<!-- This controls the main layout of the system but for specifics, edit them on corresponding page files. -->

<div class="flex min-h-dvh w-full bg-muted/40">
	<Sidebar />
	<ScrollArea class="h-dvh w-full">
		<div class="flex h-full min-h-dvh w-full flex-col md:gap-4 md:py-4">
			<!-- MAIN HEADER -->

			<header
				class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 py-2 [view-transition-name:header] md:static md:h-auto md:border-0 md:bg-transparent md:px-6"
			>
				<DashboardMenu />
				<Breadcrumb />
				<Search />
				<NightToggle />
				<Button
					variant="link"
					size="icon"
					class="border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
					href="https://docs.google.com/forms/d/e/1FAIpQLSeQgGCDW9ThhDKuLG9zJ1r0NKleHuZRcsYeOh19YXl7Hem5ww/viewform"
				>
					<ChatBubble class="h-4 w-4" />
				</Button>
				<Account />
			</header>

			<!-- PAGE CONTENT -->

			<main class="flex-1 items-start p-4 md:px-6 md:py-0">
				<slot />
			</main>
		</div>
	</ScrollArea>
</div>
