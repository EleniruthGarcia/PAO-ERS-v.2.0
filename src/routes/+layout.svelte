<script>
	import '../app.pcss';

	import Dashboard from '$lib/icons/Dashboard.svelte';
	import Clients from '$lib/icons/Clients.svelte';
	import Cases from '$lib/icons/Cases.svelte';
	import Reports from '$lib/icons/Reports.svelte';
	import Settings from '$lib/icons/Settings.svelte';

	import Logout from '$lib/icons/Logout.svelte';
	import User from '$lib/icons/User.svelte';
</script>

<main class="h-screen flex">
	<aside
		class="overflow-y-hidden flex flex-col items-center justify-between h-screen bg-black px-2 py-6"
	>
		<a href="/" class="text-2xl font-bold text-white">PAO</a>
		<nav class="flex flex-col items-center text-white gap-10">
			<a href="/dashboard"><Dashboard /></a>
			<a href="/cases"><Cases /></a>
			<a href="/clients"><Clients /></a>
			<a href="/reports"><Reports /></a>
			<a href="/settings"><Settings /></a>
		</nav>
		<div class="group flex flex-col items-center justify-center w-full p-4 text-white gap-10">
			<span class="invisible group-hover:visible">
				<Logout />
			</span>
			<User />
		</div>
	</aside>
	<main class="overflow-y-auto w-full p-20 bg-gray-100">
		<slot />
	</main>
</main>
