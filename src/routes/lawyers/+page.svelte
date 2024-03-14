<script lang="ts">
	import type { PageServerData } from './$types';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiPencil } from '@mdi/js';
	import { mdiTrashCan } from '@mdi/js';
	import Loading from '$lib/components/Loading.svelte';

	export let data: PageServerData;

	let time = new Date();

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
		<h2 class="font-bold mb-2">Lawyers</h2>
		<span class="font-bold">All lawyers are listed here.</span> Click on a lawyer to view their profile.
	</div>

	<div class="flex flex-col gap-4">
		{#await data.lawyers}
			<div><Loading /></div>
		{:then lawyers}
			<div class="flex flex-col gap-4 lg:col-span-7 col-span-10 p-2 pt-0">
				<div
					class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
				>
					<h4 class="font-bold text-equity px-6">Lawyers</h4>
					{#if lawyers.length === 0}
						<p>No lawyers found.</p>
					{:else}
						<table class="text-left w-full">
							<thead class="w-full">
								<tr class=" px-6 flex w-full border border-0 border-t border-innocence">
									<th class="p-3 w-1/3">Name</th>
									<th class="p-3 w-1/4 text-center">Title</th>
									<th class="p-3 w-1/4 text-center">Username</th>
									<th class="p-3 w-1/6"></th>
								</tr>
							</thead>
							<tbody class="text-sm flex flex-col overflow-y-scroll w-full h-72">
								{#each lawyers as lawyer}
									<a href="/lawyers/{lawyer.id}">
										<tr
											class="h-12 px-6 flex w-full hover:bg-oath border border-0 border-b border-t border-innocence"
										>
											<td class="font-bold p-3 w-1/3">
												<span class="hidden sm:block"
													>{lawyer.firstName +
														' ' +
														lawyer.middleName +
														' ' +
														lawyer.lastName +
														(lawyer.nameSuffix ? ' ' + lawyer.nameSuffix : '')}</span
												>
												<span class="block sm:hidden">{lawyer.lastName}</span>
											</td>
											<td class="p-3 w-1/4 text-center">{lawyer.title}</td>
											<td class="p-3 w-1/4 text-center">{lawyer.user.username}</td>
											<td class="w-1/6 flex items-center justify-end gap-2">
												<a href="/lawyers/{lawyer?.id}/edit"
													><button class="flex items-center gap-2 px-2 lg:px-4"
														><SvgIcon size="15px" type="mdi" path={mdiPencil}></SvgIcon><span
															class="hidden lg:block">Edit</span
														></button
													></a
												>
												<a href="/lawyers/{lawyer?.id}/delete"
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
						<a href="/lawyers/add"><button class="bg-trust" type="submit">New Lawyer</button></a>
					</div>
				</div>
			</div>
		{/await}
	</div>
</main>
