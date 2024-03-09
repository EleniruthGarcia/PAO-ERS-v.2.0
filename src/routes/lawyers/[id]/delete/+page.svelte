<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import Loading from '$lib/components/Loading.svelte';

	export let data: PageServerData;
	export let form: ActionData;
</script>

{#if form?.unsuccessful}
	<span class="text-red-500">Failed to delete lawyer!</span>
{/if}

{#if form?.success}
	<span class="text-trust">Successfully deleted lawyer!</span>
{/if}

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	{#await data.lawyer}
		<div><Loading /></div>
	{:then lawyer}
		{#if lawyer}
			<h1 class="text-3xl font-bold">
				Delete
				{lawyer.title +
					' ' +
					lawyer.firstName +
					' ' +
					lawyer.middleName +
					' ' +
					lawyer.lastName +
					(lawyer.nameSuffix ? ' ' + lawyer.nameSuffix : '')}
			</h1>

			<p>Do you really want to delete this lawyer?</p>

			<form method="POST" use:enhance class=" grid grid-cols-6 gap-4">
				<button type="submit">Yes</button>
				<button type="button" on:click={() => history.back()}>No</button>
			</form>
		{:else}
			<p>No lawyer found!</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
