<script lang="ts">
	import type { PageServerData } from './$types';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiPencil, mdiTrashCan, mdiEye, mdiEyeOutline, mdiDeleteRestore } from '@mdi/js';
	import Loading from '$lib/components/Loading.svelte';

	export let data: PageServerData;

	let time = new Date();

	let showDeletedCases = false;

	let filteredCases = data.cases.then((cases) => cases.filter((_case) => !_case.deletedAt));

	const toggleShowDeletedCases = () => {
		showDeletedCases = !showDeletedCases;
		filteredCases = data.cases.then((cases) =>
			showDeletedCases ? cases : cases.filter((_case) => !_case.deletedAt)
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
		<h2 class="font-bold mb-2">Cases</h2>
		<span class="font-bold">All cases are listed here.</span> Click on a case to view more information.
	</div>

	<div class="flex flex-col gap-4">
		{#await filteredCases}
			<div><Loading /></div>
		{:then cases}
			<div class="flex flex-col gap-4 lg:col-span-7 col-span-10 p-2 pt-0">
				<div
					class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
				>
					<div class="flex items-center justify-between px-6">
						<h4 class="font-bold text-equity">Cases</h4>
						{#if showDeletedCases}
							<button class="px-2 bg-diligence text-oath" on:click={toggleShowDeletedCases}>
								<SvgIcon size="20px" type="mdi" path={mdiEye}></SvgIcon>
							</button>
						{:else}
							<button
								class="px-2 bg-transparent outline outline-1 outline-diligence text-diligence"
								on:click={toggleShowDeletedCases}
							>
								<SvgIcon size="20px" type="mdi" path={mdiEyeOutline}></SvgIcon>
							</button>
						{/if}
					</div>
					{#if cases.length === 0}
						<p class="px-6">No cases found.</p>
					{:else}
						<table class="text-left w-full">
							<thead class="w-full">
								<tr class=" px-6 flex w-full border border-0 border-t border-innocence">
									<th class="p-3 flex items-center w-1/3">Name</th>
									<th class="p-3 flex items-center justify-center w-1/4 text-center">Case Number</th>
									<th class="p-3 flex items-center justify-center w-1/4 text-center">Case Type</th>
									<th class="p-3 flex items-center w-1/6"></th>
								</tr>
							</thead>
							<tbody class="text-sm flex flex-col overflow-y-scroll w-full h-72 overflow-x-clip">
								{#each cases as _case}
									<a href="/cases/{_case.id}">
										<tr
											class="h-12 px-6 flex w-full hover:bg-oath border border-0 border-b border-t border-innocence"
										>
											<td class="font-bold px-3 flex items-center w-1/3">
												<span class="hidden sm:block"
													>{_case.firstName +
														' ' +
														_case.middleName +
														' ' +
														_case.lastName +
														(_case.nameSuffix ? ' ' + _case.nameSuffix : '')}</span
												>
												<span class="block sm:hidden">{_case.lastName}</span>
											</td>
											<td class="px-3 flex items-center w-1/4 justify-center"
												>{_case.caseNumber ? 'Case Number' : 'No Number'}</td
											>
											<td class="px-3 flex items-center w-1/4 justify-center"
												>{_case.caseType ? 'Case Type' : 'No Case'}</td
											>
											<td class="w-1/6 flex items-center justify-center gap-2">
												{#if !_case.deletedAt}
													<a href="/cases/{_case.id}/edit"
														><button class="flex items-center gap-2 px-2 lg:px-4"
															><SvgIcon size="15px" type="mdi" path={mdiPencil} class="lg:w-15"
															></SvgIcon><span class="hidden lg:block">Edit</span></button
														></a
													>
													<a href="/cases/{_case.id}/delete"
														><button
															class="flex items-center gap-2 px-2 lg:px-4 bg-diligence text-oath"
															><SvgIcon size="15px" type="mdi" path={mdiTrashCan}></SvgIcon><span
																class="hidden lg:block">Delete</span
															></button
														></a
													>
												{:else}
													<a href="/cases/{_case.id}/restore"
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
						<a href="/cases/add"><button class="bg-trust" type="submit">New Case</button></a>
					</div>
				</div>
			</div>
		{/await}
	</div>
</main>
