<script lang="ts">
	import { page } from '$app/stores';

	import Logo from '$lib/images/Logo.png';

	let time = new Date();

	setInterval(() => (time = new Date()));

	import Logout from '$lib/icons/Logout.svelte';
</script>

<form id="logout" method="POST" action="/logout" class="hidden" />

<main class="h-screen w-screen flex flex-col justify-center items-center bg-witness">
	{#if $page.data.user}
		<span class="fixed top-10 left-10 flex gap-4">
			<img src={Logo} alt="Public Attorney's Office" class="w-6 h-6" />
			<p>Public Attorney's office</p>
		</span>
	{/if}
	<div class="hidden sm:block fixed top-10 right-10 text-right">
		<h1>
			{Intl.DateTimeFormat('en-PH', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric'
			}).format(time)}
		</h1>
		<p class="text-sm text-gray-600">
			{Intl.DateTimeFormat('en-PH', { timeZoneName: 'long' })
				.formatToParts(time)
				.find((part) => part.type === 'timeZoneName')?.value}
		</p>
	</div>
	<div class="container flex flex-col m-auto max-w-lg p-4 text-center gap-10">
		{#if $page.data.user}
			<div class="flex flex-col gap-4">
				<h1 class="text-3xl font-bold text-gray-800">
					WELCOME, {String($page.data.user.name).toUpperCase()}!
				</h1>
				<p>What would you like to do today?</p>
			</div>
		{:else}
			<img src={Logo} alt="Public Attorney's Office" class="w-64 m-auto" />
			<div class="flex flex-col gap-4">
				<h1 class="text-3xl font-bold text-diligence">Public Attorney's Office</h1>
				<p>
					The Public Attorney's Office exists to provide the indigent sector access to counsel at
					the time of need and to implement the Constitutional guarantee of free access to courts,
					due process, and equal protection of the laws.
				</p>
			</div>
		{/if}
		<span class="flex flex-row justify-center items-center gap-4">
			{#if $page.data.user}
				{#if $page.data.user.role === 'admin'}
					<a class="px-4 py-2 rounded-lg bg-green-800 text-white" href="/admin"
						>Go to Admin Dashboard</a
					>
				{:else if $page.data.user.role === 'lawyer'}
					<a class="px-4 py-2 rounded-lg bg-green-800 text-white" href="/dashboard"
						>Go to Dashboard</a
					>
				{:else if $page.data.user.role === 'client'}
					<a class="px-4 py-2 rounded-lg bg-green-800 text-white" href="/forms/client_profile"
						>Add Profile</a
					>
				{/if}
				<button class="px-4 py-2 rounded-lg bg-green-800 text-white" type="submit" form="logout">
					<Logout />
				</button>
			{:else}
				<a class="px-4 py-2 rounded-lg bg-green-800 text-white" href="/register">Register</a>
				<a class="px-4 py-2 rounded-lg bg-green-800 text-white" href="/login">Login</a>
			{/if}
		</span>
	</div>
</main>
