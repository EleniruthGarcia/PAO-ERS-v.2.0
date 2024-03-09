<script lang="ts">
	import type { PageServerData } from './$types';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiPencil } from '@mdi/js';
	import { mdiTrashCan } from '@mdi/js';
	import Loading from '$lib/components/Loading.svelte';

	export let data: PageServerData;

	let time = new Date();

	let showDeletedClients = false;

	let filteredClients = data.clients.then((clients) =>
		clients.filter((client) => !client.deletedAt)
	);

	const toggleShowDeletedClients = () => {
		showDeletedClients = !showDeletedClients;
		filteredClients = data.clients.then((clients) =>
			showDeletedClients ? clients : clients.filter((client) => !client.deletedAt)
		);
	};

	setInterval(() => (time = new Date()));
</script>

<main
	class="h-screen w-screen p-12 pl-14 flex flex-col gap-4 bg-witness text-diligence overflow-y-hidden"
>
	<div class="hidden md:block fixed top-10 right-10 text-right">
		<p class="font-bold text-diligence text-sm">
			{Intl.DateTimeFormat('en-PH', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric'
			}).format(time)}
		</p>
		<p class="text-equity text-sm">
			{Intl.DateTimeFormat('en-PH', { timeZoneName: 'long' })
				.formatToParts(time)
				.find((part) => part.type === 'timeZoneName')?.value}
		</p>
	</div>

	<div class="mb-4">
		<h2 class="font-bold mb-2">Clients</h2>
		<span class="font-bold">All clients are listed here.</span> Click on a client to view their profile.
	</div>

	<div class="flex flex-col gap-4">
		{#await filteredClients}
			<div><Loading /></div>
		{:then clients}
			<div class="flex flex-col gap-4 lg:col-span-7 col-span-10 p-2 pt-0">
				<div
					class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
				>
					<div class="flex items-center justify-between px-6">
						<h4 class="font-bold text-equity">Clients</h4>
						<button class="px-2 bg-diligence text-oath" on:click={toggleShowDeletedClients}>
							<SvgIcon size="20px" type="mdi" path={mdiTrashCan}></SvgIcon>
						</button>
					</div>
					{#if clients.length === 0}
						<p>No clients found!</p>
					{:else}
						<table class="text-left w-full">
							<thead class="w-full">
								<tr class=" px-6 flex w-full border border-0 border-t border-innocence">
									<th class="p-3 w-1/3">Name</th>
									<th class="p-3 w-1/4 text-center">Case Number</th>
									<th class="p-3 w-1/4 text-center">Case Type</th>
									<th class="p-3 w-1/6"></th>
								</tr>
							</thead>
							<tbody class="text-sm flex flex-col overflow-y-scroll w-full h-72">
								{#each clients as client}
									<a href="/clients/{client.id}">
										<tr
											class="h-12 px-6 flex w-full hover:bg-oath border border-0 border-b border-t border-innocence"
										>
											<td class="font-bold p-3 w-1/3">
												<span class="hidden lg:block"
													>{client.firstName +
														' ' +
														client.middleName +
														' ' +
														client.lastName +
														(client.nameSuffix ? ' ' + client.nameSuffix : '')}</span
												>
												<span class="block lg:hidden">{client.lastName}</span>
											</td>
											<td class="p-3 w-1/4 text-center"
												>{client?.caseNumber ? 'Case Number' : 'No Number'}</td
											>
											<td class="p-3 w-1/4 text-center"
												>{client?.caseType ? 'Case Type' : 'No Case'}</td
											>
											<td class="w-1/6 flex items-center justify-end gap-2">
												<a href="/clients/{client?.id}/edit"
													><button class="flex items-center gap-2 px-2 lg:px-4"
														><SvgIcon size="15px" type="mdi" path={mdiPencil}></SvgIcon><span
															class="hidden lg:block">Edit</span
														></button
													></a
												>
												<a href="/clients/{client?.id}/delete"
													><button class="px-2 bg-diligence text-oath"
														><SvgIcon size="20px" type="mdi" path={mdiTrashCan}></SvgIcon></button
													></a
												>
											</td>
										</tr>
									</a>
								{/each}
							</tbody>
						</table>
					{/if}
					<div class="flex gap-4 px-6">
						<a href="/clients/add"><button class="bg-trust" type="submit">New Client</button></a>
					</div>
				</div>
			</div>
		{/await}
	</div>
</main>
