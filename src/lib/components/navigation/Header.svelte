<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Search from '$lib/components/Search.svelte';
	import NightToggle from '$lib/components/NightToggle.svelte';
	import Account from '$lib/components/Account.svelte';
</script>

<header
	class="sticky top-0 z-30 flex h-16 flex-none items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4"
>
	<Menu />
	<Breadcrumb />
	<Search />
	<NightToggle />
	<Account />
</header>
