<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import Loading from '$lib/components/Loading.svelte';
	import Modal from '$lib/components/Modal.svelte';

	export let data: PageServerData;
	export let form: ActionData;
</script>

{#if form?.unsuccessful}
	<Modal
		title="Delete Failed."
		message="Lawyer has not been deleted."
		success={() => history.back()}
	/>
{/if}

{#if form?.success}
	<Modal
		title="Delete Success!"
		message="Lawyer has been successfully deleted."
		success={() => history.back()}
	/>
{/if}

<main
	class="h-screen w-full p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence lg:overflow-y-hidden leading-tight"
>
	{#await data.lawyer}
		<div><Loading /></div>
	{:then lawyer}
		{#if lawyer}
			<div class="flex items-center justify-between">
				<div>
					<p class="font-bold text-equity mb-2">
						Lawyer Profile<span class="p-1 px-2 bg-diligence text-oath rounded-lg ml-2"
							>Delete Mode</span
						>
					</p>
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
			</div>
			<div class="mt-4 font-bold">
				<p>Do you really want to delete this lawyer?</p>
				<form method="POST" use:enhance class="flex gap-4 mt-6">
					<button class="bg-diligence text-oath" type="submit">Delete</button>
					<button
						class="border border-2 border-diligence"
						type="button"
						on:click={() => history.back()}>Cancel</button
					>
				</form>
			</div>
		{:else}
			<p>No lawyer found.</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
