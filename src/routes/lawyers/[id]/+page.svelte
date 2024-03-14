<script lang="ts">
	import type { PageServerData } from './$types';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiPencil } from '@mdi/js';
	import { mdiTrashCan } from '@mdi/js';
	import Loading from '$lib/components/Loading.svelte';

	export let data: PageServerData;
</script>

<main
	class="h-screen w-full py-12 p-6 lg:p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence lg:overflow-y-hidden leading-tight"
>
	{#await data.lawyer}
		<div><Loading /></div>
	{:then lawyer}
		<div class="flex items-center justify-between">
			<div class="pl-6 lg:pl-0">
				<p class="font-bold text-equity mb-2">Lawyer Profile</p>
				<h3 class="font-bold">
					{lawyer.title +
						' ' +
						lawyer.firstName +
						' ' +
						lawyer.middleName +
						' ' +
						lawyer.lastName +
						(lawyer.nameSuffix ? ' ' + lawyer.nameSuffix : '')}
				</h3>
			</div>
			<span class="flex gap-2 lg:gap-4">
				<a href="/lawyers/{lawyer?.id}/edit">
					<button class="flex gap-2 px-2 lg:px-4"
						><SvgIcon size="15px" type="mdi" path={mdiPencil}></SvgIcon><span
							class="hidden lg:block">Edit</span
						></button
					>
				</a>
				<a href="/lawyers/{lawyer?.id}/delete"
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
					<h4 class="font-bold text-equity px-6">Account Information</h4>
					<table class="text-sm space-y-10">
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Username</td>
							<td class="text-base px-6">{lawyer?.user.username}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Password</td>
							<td class="text-base px-6">{lawyer?.user.userAuthToken}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Lawyer ID</td>
							<td class="text-base px-6">{lawyer?.user}</td>
						</tr>
					</table>
				</div>
				<div
					class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
				>
					<h4 class="font-bold text-equity px-6">Personal Information</h4>
					<table class="text-sm space-y-10">
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Age</td>
							<td class="text-base px-6">{lawyer?.age}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Sex</td>
							<td class="text-base px-6">{lawyer?.sex}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Address</td>
							<td class="text-base px-6">{lawyer?.address}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Email</td>
							<td class="text-base px-6">{lawyer?.email}</td>
						</tr>
						<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
							<td class="font-bold p-3 px-6 w-1/3">Contact Number</td>
							<td class="text-base px-6">{lawyer?.contactNumber}</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="hidden lg:block lg:col-span-3">
				<div class="flex flex-col gap-4 bg-oath p-4 rounded-lg shadow-md">
					<h4 class="font-bold">Requests</h4>
					<table class="text-sm">
						{#if lawyer?.request && lawyer?.request.length > 0}
							{#each lawyer?.request as request}
								<tr class="hover:bg-oath border border-0 border-b border-t border-innocence">
									<td>{request.requestType}</td>
									<td>{request.requestDate}</td>
								</tr>
							{/each}
						{:else}
							<span class="flex flex-col gap-4">
								<p class="text-sm">No requests found.</p>
								<a href="/requests/add?lawyerId={lawyer?.id}"
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
