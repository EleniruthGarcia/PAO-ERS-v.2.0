<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	<span>
		<h1 class="text-3xl font-bold">Clients</h1>
		<p>See all clients here.</p>
	</span>

	<div class="flex flex-col md:grid md:grid-cols-2 gap-4">
		<div class="flex flex-col gap-4 bg-oath border border-innocence rounded-md p-4">
			<h1 class="text-xl font-bold">Clients</h1>
			<div class="flex flex-col gap-4">
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
								<li class="flex justify-between">
									<a href="/clients/{client.id}"
										>{client.firstName +
											' ' +
											client.middleName +
											' ' +
											client.lastName +
											(client.nameSuffix ? ' ' + client.nameSuffix : '')}</a
									>
									<span>
										<a href="/clients/{client.id}/edit" class="text-diligence">Edit</a>
										<a href="/clients/{client.id}/delete" class="text-diligence">Delete</a>
									</span>
								</li>
							{/each}
						</ul>
					{/if}
				{:catch error}
					<p>{error.message}</p>
				{/await}
			</div>

			<span>
				<a href="/clients/add" class="px-4 py-2 rounded-lg bg-trust text-diligence">New Client</a>
			</span>
		</div>
	</div>
</main>
