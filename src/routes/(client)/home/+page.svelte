<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="h-screen w-screen m-auto">
	<div class="flex flex-col justify-between">
		<h1>PAO ONLINE PORTAL</h1>
		<nav class="grid grid-cols-5 gap-10">
			{#if $page.data.user}
				{#if $page.data.user.role === 'admin'}
					<a href="/dashboard">Dashboard</a>
					<a href="/cases">Cases</a>
					<a href="/clients">Clients</a>
					<a href="/reports">Reports</a>
					<a href="/settings">Settings</a>
				{:else}
					<a href="/forms">Forms</a>
				{/if}
				<a href="/logout">Logout</a>
			{:else}
				<a href="/register">Register</a>
				<a href="/login">Login</a>
			{/if}
		</nav>
	</div>
</main>
