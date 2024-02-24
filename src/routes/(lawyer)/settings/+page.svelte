<script lang="ts">
	import Notification from '$lib/icons/Notification.svelte';
</script>

<main>
	<div class="flex justify-between">
		<span>
			<h1 class="text-3xl font-bold">Settings</h1>
			<p>Manage your account settings and preferences here.</p>
		</span>
		<span class="flex items-center">
			<button><Notification /></button>
		</span>
	</div>

	<div class="grid grid-cols-2 gap-4 mt-6">
		<div class="bg-white p-4 rounded-lg shadow-md">
			<h2 class="text-xl font-bold">Upcoming Requests</h2>
			<p>Manage your requests here.</p>
			<a href="/cases" class="block mt-4 text-blue-500">View Requests</a>
		</div>
		<div class="bg-white p-4 rounded-lg shadow-md">
			<h2 class="text-xl font-bold">Ongoing Cases</h2>
			<p>Manage your cases here.</p>
			<a href="/clients" class="block mt-4 text-blue-500">View Cases</a>
		</div>
		<div class="bg-white p-4 rounded-lg shadow-md">
			<h2 class="text-xl font-bold">Reports</h2>
			<p>View your reports here.</p>
			<a href="/reports" class="block mt-4 text-blue-500">View Reports</a>
		</div>
	</div>
</main>
