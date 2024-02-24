<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="h-screen w-screen m-auto">
	<div class="flex flex-col justify-between">
		<h1>PAO ONLINE PORTAL</h1>
		<nav class="grid grid-cols-5 gap-10">
			{#if $page.data.user}
				<a href="/dashboard">Dashboard</a>
				<a href="/logout">Logout</a>
			{:else}
				<a href="/register">Register</a>
				<a href="/login">Login</a>
			{/if}
		</nav>
	</div>
</main>
