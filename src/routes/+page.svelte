<script lang="ts">
	import { page } from '$app/stores';

	import Logout from '$lib/icons/Logout.svelte';
</script>

<form id="logout" method="POST" action="/logout" />

<main class="h-screen w-screen m-auto">
	<div class="flex flex-col justify-between">
		<h1>PAO ONLINE PORTAL</h1>
		<nav class="grid grid-cols-5 gap-10">
			{#if $page.data.user}
				{#if $page.data.user.role === 'admin'}
					<a href="/admin">Go to Admin Dashboard</a>
				{:else if $page.data.user.role === 'lawyer'}
					<a href="/dashboard">Go to Dashboard</a>
				{:else if $page.data.user.role === 'client'}
					<a href="/home">Go to Home</a>
				{/if}
				<button type="submit" form="logout">
					<Logout />
				</button>
			{:else}
				<a href="/register">Register</a>
				<a href="/login">Login</a>
			{/if}
		</nav>
	</div>
</main>
