<script lang="ts">
	import '../app.pcss';

	import type { LayoutServerData } from './$types';

	import Logo from '$lib/images/Logo.png';

	import Dashboard from '$lib/icons/Dashboard.svelte';
	import Cases from '$lib/icons/Cases.svelte';
	import Lawyers from '$lib/icons/Lawyers.svelte';
	import Reports from '$lib/icons/Reports.svelte';
	import Settings from '$lib/icons/Settings.svelte';

	import Logout from '$lib/icons/Logout.svelte';
	import User from '$lib/icons/User.svelte';

	export let data: LayoutServerData;
</script>

<main class="h-screen flex">
	{#if data.user}
		<aside
			class="overflow-y-hidden flex flex-col items-center justify-between h-screen bg-verdict py-6 w-16 sm:w-64 sm:items-start sm:p-6"
		>
			<span class="flex flex-col items-center gap-20 sm:items-start">
				<a href="/" class="text-2xl font-bold text-white flex items-center gap-2"
					><img src={Logo} alt="PAO Logo" class="w-8" />
					<p class="hidden sm:block text-base">PAO-ERS</p>
				</a>
				<nav class="flex flex-col items-center text-white gap-6 sm:items-start">
					<a href="/" class="flex gap-2"
						><Dashboard />
						<p class="hidden sm:block">Dashboard</p></a
					>
					<a href="/cases" class="flex gap-2"
						><Cases />
						<p class="hidden sm:block">Cases</p></a
					>
					{#if data.user.role === 'admin'}
						<a href="/lawyers" class="flex gap-2"
							><Lawyers />
							<p class="hidden sm:block">Lawyers</p></a
						>
					{/if}
					<a href="/reports" class="flex gap-2"
						><Reports />
						<p class="hidden sm:block">Reports</p></a
					>
					<a href="/settings" class="flex gap-2"
						><Settings />
						<p class="hidden sm:block">Settings</p></a
					>
				</nav>
			</span>
			<div
				class="group flex flex-col items-center justify-center w-full text-white gap-4 sm:items-start"
			>
				<form id="logout" method="POST" action="/logout" class="hidden" />
				<button
					class="invisible group-hover:visible flex gap-2 items-center"
					type="submit"
					form="logout"
				>
					<Logout />
					<p class="hidden sm:block">Logout</p>
				</button>
				<span class="flex gap-2 items-center">
					<User />
					<span class="hidden sm:block">
						{#if data.user.role === 'admin'}
							<p class="text-sm">Administrator</p>
						{:else if data.lawyer}
							<p class="text-sm">
								{data.lawyer.firstName}
								{data.lawyer.middleName}
								{data.lawyer.lastName}
								{data.lawyer.nameSuffix ? data.lawyer.nameSuffix : ''}
							</p>
							<p class="text-xs text-oath">
								{data.lawyer.title}
							</p>
						{/if}
					</span>
				</span>
			</div>
		</aside>
	{/if}

	<slot />
</main>
