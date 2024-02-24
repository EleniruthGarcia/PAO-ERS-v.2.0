<script lang="ts">
	import Notification from '$lib/icons/Notification.svelte';
</script>

<main>
	<div class="flex justify-between">
		<span>
			<h1 class="text-3xl font-bold">Cases</h1>
			<p>View and manage your cases here.</p>
		</span>
		<span class="flex items-center">
			<form method="POST" action="filter">
				<input
					type="month"
					name="month"
					id="month"
					required
					value={new Date().toLocaleDateString('en-CA', {
						year: 'numeric',
						month: '2-digit',
						timeZone: 'Asia/Manila'
					})}
				/>
				<select name="type" id="type" required>
					<option value="All Cases" selected>All Cases</option>
					<option value="Legal Counseling">Legal Counseling</option>
					<option value="Criminal Cases">Criminal Cases</option>
					<option value="Civil Cases">Civil Cases</option>
					<option value="Administrative Cases">Administrative Cases</option>
					<option value="Cases Assigned by the Court">Cases Assigned by the Court</option>
					<option value="Affidavits">Affidavits</option>
					<option value="Outreach">Outreach</option>
				</select>
			</form>
		</span>
	</div>

	<div class="grid grid-cols-2 gap-4 mt-6">
		<div class="bg-white p-4 rounded-lg shadow-md">
			<h2 class="text-xl font-bold">Upcoming Requests</h2>
			<p>Manage your requests here.</p>
			<a href="/cases" class="block mt-4 text-blue-500">View Requests</a>
		</div>
		<div class="bg-white p-4 rounded-lg shadow-md">
			<h2 class="text-xl font-bold">Active Cases</h2>
			<p>Manage your cases here.</p>
			<a href="/cases" class="block mt-4 text-blue-500">View Cases</a>
		</div>
	</div>
</main>
