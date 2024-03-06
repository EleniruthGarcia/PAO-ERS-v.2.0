<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;
</script>

{#if form?.unsuccessful}
	<span class="text-red-500">Failed to delete client!</span>
{/if}

{#if form?.success}
	<span class="text-trust">Successfully deleted the client!</span>
{/if}

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	{#await data.client}
		<div class="animate-pulse flex flex-col gap-1">
			<div class="rounded-full bg-slate-500 h-2 w-40"></div>
			<div class="rounded-full bg-slate-500 h-1 w-20"></div>
			<div class="rounded-full bg-slate-500 h-1 w-10"></div>
		</div>
	{:then client}
		{#if client}
			<h1 class="text-3xl font-bold">
				Delete
				{client.firstName +
					' ' +
					client.middleName +
					' ' +
					client.lastName +
					(client.nameSuffix ? ' ' + client.nameSuffix : '')}
			</h1>

			<p>Do you really want to delete this client?</p>

			<form method="POST" use:enhance class=" grid grid-cols-6 gap-4">
				<button type="submit">Yes</button>
				<button type="button" on:click={() => history.back()}>No</button>
			</form>
		{:else}
			<p>No client found!</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
