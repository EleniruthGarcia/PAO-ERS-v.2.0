<script lang="ts">
	import type { PageServerData } from './$types';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiPencil } from '@mdi/js';
	import { mdiTrashCan } from '@mdi/js';
	import Loading from '$lib/components/Loading.svelte';

	export let data: PageServerData;
</script>

<main
	class="h-screen w-screen py-12 p-6 lg:p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence lg:overflow-y-hidden leading-tight"
>
	{#await data.client}
		<div><Loading /></div>
	{:then client}
		<div class="flex items-center justify-between">
			<div class="pl-6 lg:pl-0">
				<p class="font-bold text-equity mb-2">Client Profile</p>
				<h3 class="font-bold">
					{client?.firstName +
						' ' +
						client?.middleName +
						' ' +
						client?.lastName +
						(client?.nameSuffix ? ' ' + client?.nameSuffix : '')}
				</h3>
			</div>
			<span class="flex gap-2 lg:gap-4">
				<a href="/clients/{client?.id}/edit"
					><button class="flex gap-2 px-2 lg:px-4"
						><SvgIcon size="15px" type="mdi" path={mdiPencil}></SvgIcon><span
							class="hidden lg:block">Edit</span
						></button
					></a
				>
				<a href="/clients/{client?.id}/delete"
					><button class="flex gap-2 px-2 lg:px-4 bg-diligence text-oath"
						><SvgIcon size="15px" type="mdi" path={mdiTrashCan}></SvgIcon><span
							class="hidden lg:block">Delete</span
						></button
					></a
				>
			</span>
		</div>
		<div class="grid grid-cols-10 gap-4 max-h-[90%] pl-4 lg:pl-0">
			<div class="flex flex-col gap-4 lg:col-span-7 col-span-10 overflow-y-auto p-2 pt-0">
				<div
					class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
				>
					<h4 class="font-bold text-equity px-6">Personal Information</h4>
					<table class="text-sm space-y-10">
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Age</td>
							<td class="text-base px-6">{client?.age}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Sex</td>
							<td class="text-base px-6">{client?.sex}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Address</td>
							<td class="text-base px-6">{client?.address}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Email</td>
							<td class="text-base px-6">{client?.email}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Contact Number</td>
							<td class="text-base px-6">{client?.contactNumber}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Civil Status</td>
							<td class="text-base px-6">{client?.civilStatus}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Religion</td>
							<td class="text-base px-6">{client?.religion}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Citizenship</td>
							<td class="text-base px-6">{client?.citizenship}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Educational Attainment</td>
							<td class="text-base px-6">{client?.educationalAttainment}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Language/Dialect</td>
							<td class="text-base px-6">{client?.language}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Individual Monthly Income</td>
							<td class="text-base px-6"
								>{client?.individualMonthlyIncome ? client?.individualMonthlyIncome : ''}</td
							>
						</tr>
					</table>
				</div>
				{#if client?.detained}
					<div
						class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
					>
						<h4 class="font-bold text-equity px-6">Detainee Information</h4>
						<table class="text-sm space-y-10">
							<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
								<td class="font-bold p-3 px-6 w-1/3">Detained</td>
								<td class="text-base px-6">{client?.detained ? 'Yes' : 'No'}</td>
							</tr>
							<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
								<td class="font-bold p-3 px-6 w-1/3">Detained Since</td>
								<td class="text-base px-6"
									>{client?.detainedSince?.toLocaleDateString('en-CA', {
										timeZone: 'Asia/Manila'
									})}</td
								>
							</tr>
							<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
								<td class="font-bold p-3 px-6 w-1/3">Detained At</td>
								<td class="text-base px-6">{client?.detainedAt}</td>
							</tr>
						</table>
					</div>
				{/if}
				{#if client?.civilStatus === 'Married'}
					<div
						class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
					>
						<h4 class="font-bold text-equity px-6">Spouse Information</h4>
						<table class="text-sm space-y-10">
							<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
								<td class="font-bold p-3 px-6 w-1/3">Spouse Name</td>
								<td class="text-base px-6">{client?.spouseName}</td>
							</tr>
							<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
								<td class="font-bold p-3 px-6 w-1/3">Spouse Address</td>
								<td class="text-base px-6">{client?.spouseAddress}</td>
							</tr>
							<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
								<td class="font-bold p-3 px-6 w-1/3">Spouse Contact Number</td>
								<td class="text-base px-6">{client?.spouseContactNumber}</td>
							</tr>
						</table>
					</div>
				{/if}
			</div>
			<div class="hidden lg:block lg:col-span-3">
				<div class="flex flex-col gap-4 bg-oath p-4 rounded-lg shadow-md">
					<h4 class="font-bold">Requests</h4>
					<table class="text-sm">
						{#if client?.request && client?.request.length > 0}
							{#each client?.request as request}
								<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
									<td>{request.requestType}</td>
									<td>{request.requestDate}</td>
								</tr>
							{/each}
						{:else}
							<span class="flex flex-col gap-4">
								<p class="text-sm">No requests found.</p>
								<a href="/requests/add?clientId={client?.id}"
									><button class="w-full">New Request</button></a
								>
							</span>
						{/if}
					</table>
				</div>
			</div>
		</div>
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
