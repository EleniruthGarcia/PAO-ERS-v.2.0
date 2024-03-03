<script lang="ts">
	import { page } from '$app/stores';

	import Logo from '$lib/images/Logo.png';

	import Dashboard from '$lib/icons/Dashboard.svelte';
	import Cases from '$lib/icons/Cases.svelte';
	import Clients from '$lib/icons/Clients.svelte';
	import History from '$lib/icons/History.svelte';
	import Lawyers from '$lib/icons/Lawyers.svelte';
	import Reports from '$lib/icons/Reports.svelte';
	import Recents from '$lib/icons/History.svelte';
	import Settings from '$lib/icons/Settings.svelte';
	import Logout from '$lib/icons/Logout.svelte';
	import User from '$lib/icons/User.svelte';
</script>

<aside
	class="flex flex-col items-center justify-between h-screen overflow-auto bg-verdict py-6 w-16 md:min-w-80 md:items-start md:p-10"
>
	<span class="flex flex-col items-center gap-16 mt-4 md:items-start">
		<a href="/" class="text-2xl md:pl-4 font-bold text-oath flex items-center gap-2"
			><img src={Logo} alt="PAO Logo" class="w-8 md:w-14" />
			<!-- <p class="hidden md:block text-base">PAO-ERS</p> -->
		</a>
		<nav class="flex flex-col items-center text-oath gap-2 md:items-start">
			<p class="hidden md:block font-bold pl-4 text-trust">Navigation</p>
			<a
				href="/"
				class={$page.route.id === '/'
					? 'flex font-bold hover:bg-equity p-4 py-2 rounded-full gap-4'
					: 'flex hover:bg-equity p-4 py-2 rounded-full gap-4'}
			>
				<Dashboard />
				<h4 class="hidden md:block">Dashboard</h4>
			</a>
			<a
				href="/cases"
				class={$page.route.id === '/cases'
					? 'flex font-bold hover:bg-equity p-4 py-2 rounded-full gap-4'
					: 'flex hover:bg-equity p-4 py-2 rounded-full gap-4'}
			>
				<Cases />
				<h4 class="hidden md:block">Cases</h4>
			</a>
			{#if $page.data.user.role === 'lawyer'}
				<a
					href="/clients"
					class={$page.route.id === '/clients'
						? 'flex font-bold hover:bg-equity p-4 py-2 rounded-full gap-4'
						: 'flex hover:bg-equity p-4 py-2 rounded-full gap-4'}
				>
					<Clients />
					<h4 class="hidden md:block">Clients</h4>
				</a>
			{/if}
			{#if $page.data.user.role === 'admin'}
				<a
					href="/lawyers"
					class={$page.route.id === '/lawyers'
						? 'flex font-bold hover:bg-equity p-4 py-2 rounded-full gap-4'
						: 'flex hover:bg-equity p-4 py-2 rounded-full gap-4'}
				>
					<Lawyers />
					<h4 class="hidden md:block">Lawyers</h4>
				</a>
			{/if}
			<a
				href="/reports"
				class={$page.route.id === '/reports'
					? 'flex font-bold hover:bg-equity p-4 py-2 rounded-full gap-4'
					: 'flex hover:bg-equity p-4 py-2 rounded-full gap-4'}
			>
				<Reports />
				<h4 class="hidden md:block">Reports</h4>
			</a>
			{#if $page.data.user.role === 'lawyer'}
				<a
					href="/recents"
					class={$page.route.id === '/recents'
						? 'flex font-bold hover:bg-equity p-4 py-2 rounded-full gap-4'
						: 'flex hover:bg-equity p-4 py-2 rounded-full gap-4'}
				>
					<Recents />
					<h4 class="hidden md:block">Recent Services</h4>
				</a>
			{/if}
			{#if $page.data.user.role === 'admin'}
				<a
					href="/settings"
					class={$page.route.id === '/settings'
						? 'flex font-bold hover:bg-equity p-4 py-2 rounded-full gap-4'
						: 'flex hover:bg-equity p-4 py-2 rounded-full gap-4'}
				>
					<Settings />
					<h4 class="hidden md:block">Settings</h4>
				</a>
			{/if}
		</nav>
	</span>
	<div
		class="group flex flex-col items-center justify-center w-full text-oath md:pl-4 gap-4 md:items-start"
	>
		<form id="logout" method="POST" action="/logout" class="hidden" />
		<button
			class="invisible group-hover:visible flex gap-2 items-center hover:bg-equity p-4 py-2 rounded-full font-normal hover:font-bold"
			type="submit"
			form="logout"
		>
			<Logout />
			<p class="hidden md:block">Log-out</p>
		</button>
		<span class="flex gap-4 items-center">
			<!-- <User /> -->
			<img
				src="https://scontent-mnl1-2.xx.fbcdn.net/v/t1.15752-9/423472492_1218710399101134_1902887119327122381_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHIicY5kUZJphKW1Z9_1MSPLe47X58o_Jst7jtfnyj8m2-AejGaFZj9Y_6nGOgwBbN1yEFgsoLYJbmkwO1QuIxH&_nc_ohc=H4MqaBc1auwAX9sfQue&_nc_ht=scontent-mnl1-2.xx&oh=03_AdSZThtWz_8j64TQTMV5gEhXkAxt1rsvdU3qYwe0VdQuIg&oe=660C079E"
				alt="User"
				class="w-8 md:w-12 rounded-full"
			/>
			<span class="hidden md:block">
				{#if $page.data.user.role === 'admin'}
					<p class="text-sm">Administrator</p>
				{:else if $page.data.lawyer}
					<p class="font-bold text-sm">
						{$page.data.lawyer.firstName}
						{$page.data.lawyer.middleName}
						{$page.data.lawyer.lastName}
						{$page.data.lawyer.nameSuffix ? $page.data.lawyer.nameSuffix : ''}
					</p>
					<p class="text-xs text-oath">
						{$page.data.lawyer.title}
					</p>
				{/if}
			</span>
		</span>
	</div>
</aside>
