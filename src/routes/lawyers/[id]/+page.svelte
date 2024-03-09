<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiPencil } from '@mdi/js';
	import { mdiTrashCan } from '@mdi/js';
	import Loading from '$lib/components/Loading.svelte';

	export let data: PageServerData;
	export let form: ActionData;
	let edit = false;
</script>

{#if form?.invalid}
	<span class="text-red-500">Invalid input values!</span>
{/if}

{#if form?.missing}
	<span class="text-red-500">Please fill in all the required fields!</span>
{/if}

{#if form?.error}
	<span class="text-red-500">Failed to edit lawyer!</span>
{/if}

{#if form?.success}
	<span class="text-trust">Successfully edited the lawyer!</span>
{/if}

<main
	class="max-h-screen w-screen flex flex-col p-12 gap-6 bg-witness text-diligence pl-14 pr-28 overflow-x-hidden overflow-y-hidden leading-tight"
>
	{#await data.lawyer}
		<div><Loading /></div>
	{:then lawyer}
		<div class="flex items-center justify-between">
			<div>
				<p class="font-bold text-equity mb-2">Lawyer Profile{#if edit}<span class="p-1 px-2 bg-diligence text-oath rounded-lg ml-2"
					>Edit Mode</span>{/if}</p>
				<h3 class="font-bold">
					{lawyer?.firstName +
						' ' +
						lawyer?.middleName +
						' ' +
						lawyer?.lastName +
						(lawyer?.nameSuffix ? ' ' + lawyer?.nameSuffix : '')}
				</h3>
			</div>
			<span class="flex gap-2 lg:gap-4">
				<button class="flex gap-2 px-2 lg:px-4" on:click={() => (edit = !edit)}
						><SvgIcon size="15px" type="mdi" path={mdiPencil}></SvgIcon><span
							class="hidden lg:block">Edit</span
						></button
					>
				<a href="/lawyers/{lawyer?.id}/delete"
					><button class="flex gap-2 px-2 lg:px-4 bg-diligence text-oath"
						><SvgIcon size="15px" type="mdi" path={mdiTrashCan}></SvgIcon><span
							class="hidden lg:block">Delete</span
						></button
					></a
				>
			</span>
		</div>
		{#if edit}
			<form method="POST" action="?/edit" use:enhance class=" grid grid-cols-6 gap-4">
				<label for="username">Username</label>
				<input
					type="text"
					name="username"
					id="username"
					required
					autocomplete="username"
					value={lawyer?.user.username}
				/>

				<label for="title">Title</label>
				<input
					type="text"
					name="title"
					id="title"
					required
					autocomplete="honorific-prefix"
					value={lawyer?.title}
				/>

				<label for="firstName">First Name</label>
				<input type="text" name="firstName" id="firstName" required value={lawyer?.firstName} />

				<label for="middleName">Middle Name</label>
				<input type="text" name="middleName" id="middleName" required value={lawyer?.middleName} />

				<label for="lastName">Last Name</label>
				<input type="text" name="lastName" id="lastName" required value={lawyer?.lastName} />

				<label for="nameSuffix">Name Suffix</label>
				<input type="text" name="nameSuffix" id="nameSuffix" value={lawyer?.nameSuffix} />

				<label for="age">Age</label>
				<input type="number" name="age" id="age" required value={lawyer?.age} />

				<label for="sex">Sex</label>
				<select name="sex" id="sex" required value={lawyer?.sex}>
					<option value="" hidden selected></option>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
				</select>

				<label for="address">Address</label>
				<input
					type="text"
					name="address"
					id="address"
					required
					value={lawyer?.address}
					autocomplete="address-level1"
				/>

				<label for="email">Email</label>
				<input type="email" name="email" id="email" value={lawyer?.email} autocomplete="email" />

				<label for="contactNumber">Contact Number</label>
				<input type="tel" name="contactNumber" id="contactNumber" value={lawyer?.contactNumber} />

				<button type="submit">Save</button>
				<button on:click={() => (edit = !edit)}>Cancel</button>
			</form>
		{:else}
		<div class="grid grid-cols-10 gap-4 max-h-[90%]">
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
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
