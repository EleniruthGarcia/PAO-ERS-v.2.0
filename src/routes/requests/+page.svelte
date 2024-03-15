<script lang="ts">
	import type { PageServerData } from './$types';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiPencil, mdiTrashCan, mdiEye, mdiEyeOutline, mdiDeleteRestore } from '@mdi/js';
	import Loading from '$lib/components/Loading.svelte';

	export let data: PageServerData;

	let time = new Date();

	let showDeletedRequests = false;

	let filteredRequests = data.requests.then((requests) =>
		requests.filter((request) => !request.deletedAt)
	);

	const toggleShowDeletedRequests = () => {
		showDeletedRequests = !showDeletedRequests;
		filteredRequests = data.requests.then((requests) =>
			showDeletedRequests ? requests : requests.filter((request) => !request.deletedAt)
		);
	};

	setInterval(() => (time = new Date()));
</script>

<main
	class="h-screen w-full py-12 p-6 lg:p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence lg:overflow-y-hidden"
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

	<div class="pl-6 lg:pl-0 mb-4">
		<h2 class="font-bold mb-2">Requests</h2>
		<span class="font-bold">All requests are listed here.</span> Click on a request to view more information.
	</div>

	<div class="flex flex-col gap-4">
		{#await filteredRequests}
			<div><Loading /></div>
		{:then requests}
			<div class="flex flex-col gap-4 lg:col-span-7 col-span-10 p-2 pt-0">
				<div
					class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
				>
					<div class="flex items-center justify-between px-6">
						<h4 class="font-bold text-equity">Requests</h4>
						{#if showDeletedRequests}
							<button class="px-2 bg-diligence text-oath" on:click={toggleShowDeletedRequests}>
								<SvgIcon size="20px" type="mdi" path={mdiEye}></SvgIcon>
							</button>
						{:else}
							<button
								class="px-2 bg-transparent outline outline-1 outline-diligence text-diligence"
								on:click={toggleShowDeletedRequests}
							>
								<SvgIcon size="20px" type="mdi" path={mdiEyeOutline}></SvgIcon>
							</button>
						{/if}
					</div>
					{#if requests.length === 0}
						<p class="px-6">No requests found.</p>
					{:else}
						<table class="text-left w-full">
							<thead class="w-full">
								<tr class=" px-6 flex w-full border border-0 border-t border-innocence">
									<th class="p-3 flex items-center w-1/3">Name</th>
									<th class="p-3 flex items-center w-1/4 text-center">Case Number</th>
									<th class="p-3 flex items-center w-1/4 text-center">Case Type</th>
									<th class="p-3 flex items-center w-1/6"></th>
								</tr>
							</thead>
							<tbody class="text-sm flex flex-col overflow-y-scroll w-full h-72 overflow-x-clip">
								{#each requests as request}
									<a href="/requests/{request.id}">
										<tr
											class="h-12 px-6 flex w-full hover:bg-oath border border-0 border-b border-t border-innocence"
										>
											<td class="font-bold p-3 w-1/3">
												<span class="hidden sm:block"
													>{request.firstName +
														' ' +
														request.middleName +
														' ' +
														request.lastName +
														(request.nameSuffix ? ' ' + request.nameSuffix : '')}</span
												>
												<span class="block sm:hidden">{request.lastName}</span>
											</td>
											<td class="p-3 w-1/4 text-center"
												>{request?.caseNumber ? 'Case Number' : 'No Number'}</td
											>
											<td class="p-3 w-1/4 text-center"
												>{request?.caseType ? 'Case Type' : 'No Case'}</td
											>
											<td class="w-1/6 flex items-center justify-center gap-2">
												{#if !request.deletedAt}
													<a href="/requests/{request?.id}/edit"
														><button class="flex items-center gap-2 px-2 lg:px-4"
															><SvgIcon size="15px" type="mdi" path={mdiPencil} class="lg:w-15"
															></SvgIcon><span class="hidden lg:block">Edit</span></button
														></a
													>
													<a href="/requests/{request?.id}/delete"
														><button
															class="flex items-center gap-2 px-2 lg:px-4 bg-diligence text-oath"
															><SvgIcon size="15px" type="mdi" path={mdiTrashCan}></SvgIcon><span
																class="hidden lg:block">Delete</span
															></button
														></a
													>
												{:else}
													<a href="/requests/{request?.id}/restore"
														><button
															class="flex items-center gap-2 px-2 lg:px-4 bg-equity text-oath"
															><SvgIcon size="15px" type="mdi" path={mdiDeleteRestore}
															></SvgIcon><span class="hidden lg:block">Restore</span></button
														></a
													>
												{/if}
											</td>
										</tr>
									</a>
								{/each}
							</tbody>
						</table>
					{/if}
					<div class="flex gap-4 px-6">
						<a href="/requests/add"><button class="bg-trust" type="submit">New Request</button></a>
					</div>
				</div>
			</div>
		{/await}
	</div>
</main>
