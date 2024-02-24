<script lang="ts">
	import type { PageServerData } from './$types';

	import Notification from '$lib/icons/Notification.svelte';

	export let data: PageServerData;
</script>

<main>
	<div class="flex justify-between">
		<span>
			<h1 class="text-3xl font-bold">Clients</h1>
			<p>See all your clients here.</p>
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
			<button><Notification /></button>
		</span>
	</div>

	<div class="grid grid-cols-2 gap-4 mt-6">
		{#await data.clients}
			<p>Loading cliens...</p>
		{:then clients}
			<div class="bg-white p-4 rounded-lg shadow-md">
				{#if clients.length === 0}
					<p>No clients found!</p>
				{:else}
					<ul>
						{#each clients as client}
							<li>
								<a href="/clients/{client.id}"
									>{client.firstName +
										' ' +
										client.middleName +
										' ' +
										client.lastName +
										(client.nameSuffix ? ' ' + client.nameSuffix : '')}</a
								>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</main>
