<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	<span>
		<h1 class="text-3xl font-bold">Clients</h1>
		<p>See all your clients here.</p>
	</span>

	<div class="flex flex-colgap-4 bg-white border border-gray-300 rounded-md p-4">
		{#await data.clients}
			<div class="animate-pulse flex flex-col gap-1">
				<div class="rounded-full bg-slate-500 h-2 w-40"></div>
				<div class="rounded-full bg-slate-500 h-1 w-20"></div>
				<div class="rounded-full bg-slate-500 h-1 w-10"></div>
			</div>
		{:then clients}
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
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>

	<span>
		<a href="/clients/add" class="px-4 py-2 rounded-lg bg-green-800 text-white">New Client</a>
	</span>
</main>
