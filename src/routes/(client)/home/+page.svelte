<script lang="ts">
	import { page } from '$app/stores';

	import Logout from '$lib/icons/Logout.svelte';
</script>

<form id="logout" method="POST" action="/logout" />

<main class="h-screen w-screen m-auto">
	<div class="flex flex-col justify-between">
		<h1>PAO ONLINE PORTAL</h1>
		<nav class="grid grid-cols-5 gap-10">
			<a href="/forms/client_profile">Client Profile</a>
			<button type="submit" form="logout">
				<Logout />
			</button>
		</nav>
	</div>
</main>
