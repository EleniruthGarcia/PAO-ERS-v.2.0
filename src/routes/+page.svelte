<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import Logo from '$lib/images/Logo.png';

	export let form: ActionData;

	let time = new Date();

	setInterval(() => (time = new Date()));
</script>

<form id="logout" method="POST" action="/logout" class="hidden" />

{#if $page.data.user}
	<main class="h-screen w-screen p-12 bg-witness">
		<div class="hidden md:block fixed top-10 right-10 text-right">
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
		<h1 class="text-3xl font-bold">Dashboard</h1>
		<p>Welcome to your dashboard.</p>
	</main>
{:else}
	<main class="h-screen w-screen bg-witness flex">
		<div
			class="h-screen w-1/2 p-6 hidden lg:w-3/5 md:flex flex-col justify-between bg-verdict text-oath"
		>
			<span class="text-2xl font-bold text-white flex items-center gap-2"
				><img src={Logo} alt="PAO Logo" class="w-8" />
				<p class="hidden sm:block text-base">PAO-ERS</p>
			</span>

			<span class="flex flex-col gap-2">
				<h1 class="text-xl font-bold text-white">
					Public Attorney’s Office - Electronic Records System
				</h1>
				<p>
					The Public Attorney’s Office - Electronic Records System (PAO-ERS) is a web-based
					application that aims to provide a more efficient and effective way of managing records
					and cases of the Public Attorney’s Office. It is designed to be user-friendly and
					accessible to all PAO personnel.
				</p>
			</span>
		</div>
		<div class="flex flex-col m-auto max-w-lg p-4 text-center gap-5">
			<h1 class="text-2xl font-bold text-gray-800">PAO-ERS</h1>

			{#if form?.invalid}
				<p class="text-red-400">Username and password is required.</p>
			{/if}

			{#if form?.username}
				<p class="text-red-400">User does not exist.</p>
			{/if}

			{#if form?.credentials}
				<p class="text-red-400">You have entered the wrong credentials.</p>
			{/if}

			<form method="POST" action="?/login" use:enhance class="flex flex-col max-w-lg gap-5">
				<div class="flex flex-col gap-4 max-w-md m-auto">
					<input
						class="p-2 rounded-lg border border-gray-300 text-sm"
						id="username"
						name="username"
						type="text"
						required
						placeholder="Username"
					/>
					<input
						class="p-2 rounded-lg border border-gray-300 text-sm"
						id="password"
						name="password"
						type="password"
						required
						placeholder="Password"
					/>
					<button class="px-4 py-2 rounded-lg bg-trust text-white" type="submit">Log in</button>
				</div>
			</form>
		</div>
	</main>
{/if}
