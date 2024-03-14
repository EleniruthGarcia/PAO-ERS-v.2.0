<script lang="ts">
	import { page } from '$app/stores';
	import NavLink from './NavLink.svelte';

	import Logo from '$lib/images/Logo.png';

	import Dashboard from '$lib/icons/Dashboard.svelte';
	import Requests from '$lib/icons/Requests.svelte';
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
	class="lg:static flex flex-col items-center justify-evenly lg:justify-between lg:h-screen overflow-hidden bg-verdict w-auto lg:min-w-80 lg:items-start lg:p-10 lg:pt-14"
>
	<a href="/" class="lg:pl-4 font-bold text-oath flex items-center gap-2"
		><img src={Logo} alt="PAO Logo" class="min-w-10 w-10 lg:w-14" />
		<!-- <p class="hidden md:block text-base">PAO-ERS</p> -->
	</a>
	<nav
		class="flex flex-col items-center text-oath lg:gap-4 lg:items-start h-[60%] w-[60%] lg:justify-normal justify-evenly lg:py-10"
	>
		<p class="hidden lg:block font-bold pl-4 text-trust">Navigation</p>
		<NavLink href="/" title="Dashboard"><Dashboard /></NavLink>
		{#if $page.data.user.role === 'lawyer'}
			<NavLink href="/clients" title="Clients"><Clients /></NavLink>
			<NavLink href="/requests" title="Requests"><Requests /></NavLink>
			<NavLink href="/cases" title="Cases"><Cases /></NavLink>
			<NavLink href="/reports" title="Reports"><Reports /></NavLink>
		{/if}
		{#if $page.data.user.role === 'admin'}
			<NavLink href="/lawyers" title="Lawyers"><Lawyers /></NavLink>
			<NavLink href="/reports" title="Reports"><Reports /></NavLink>
		{/if}
	</nav>
	<div class="group flex flex-col items-center justify-center text-oath lg:pl-4 gap-4 p-4">
		<form id="logout" method="POST" action="/logout" class="hidden" />
		<button
			class="invisible fixed lg:static group-hover:visible flex gap-2 items-center bg-verdict hover:bg-equity p-2 lg:px-4 lg:py-2 rounded-full lg:rounded-lg font-normal hover:font-bold"
			type="submit"
			form="logout"
		>
			<Logout />
			<p class="hidden lg:block">Log-out</p>
		</button>
		<span class="flex gap-4 items-center">
			<!-- <User /> -->
			<img
				src="https://scontent-mnl1-2.xx.fbcdn.net/v/t1.15752-9/423472492_1218710399101134_1902887119327122381_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHIicY5kUZJphKW1Z9_1MSPLe47X58o_Jst7jtfnyj8m2-AejGaFZj9Y_6nGOgwBbN1yEFgsoLYJbmkwO1QuIxH&_nc_ohc=H4MqaBc1auwAX9sfQue&_nc_ht=scontent-mnl1-2.xx&oh=03_AdSZThtWz_8j64TQTMV5gEhXkAxt1rsvdU3qYwe0VdQuIg&oe=660C079E"
				alt="User"
				class="min-w-10 w-10 lg:w-12 rounded-full"
			/>
			<span class="hidden lg:block">
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
