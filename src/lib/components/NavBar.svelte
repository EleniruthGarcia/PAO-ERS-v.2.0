<script lang="ts">
	import { visibleLinks } from '$lib/links';

	import Account from '$lib/components/Account.svelte';
	import HomeMenu from '$lib/components/HomeMenu.svelte';
	import NavLink from '$lib/components/NavLink.svelte';
	import NightToggle from '$lib/components/NightToggle.svelte';
	import Search from '$lib/components/Search.svelte';

	const links = visibleLinks(['dashboard', 'about']);
</script>

<header
	class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 [view-transition-name:navbar] md:px-6"
>
	<nav
		class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
	>
		<a href="##" class="flex w-full items-center gap-2 text-lg font-semibold md:text-base">
			<img src="/favicon.png" alt="PAO-ERS Logo" class="h-6 w-6" />
			<span class="w-[100px] font-bold">PAO-ERS</span>
		</a>
		{#each links as link}
			<NavLink {link} />
		{/each}
	</nav>
	<HomeMenu />
	<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
		<Search />
		<NightToggle />
		<Account />
	</div>
</header>
