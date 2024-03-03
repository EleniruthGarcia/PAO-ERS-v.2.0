<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	<span>
		<h1 class="text-3xl font-bold">Lawyers</h1>
		<p>See all lawyers here.</p>
	</span>

	<div class="flex flex-colgap-4 bg-oath border border-innocence rounded-md p-4">
		{#await data.lawyers}
			<div class="animate-pulse flex flex-col gap-1">
				<div class="rounded-full bg-slate-500 h-2 w-40"></div>
				<div class="rounded-full bg-slate-500 h-1 w-20"></div>
				<div class="rounded-full bg-slate-500 h-1 w-10"></div>
			</div>
		{:then lawyers}
			{#if lawyers.length === 0}
				<p>No lawyers found!</p>
			{:else}
				<ul>
					{#each lawyers as lawyer}
						<li>
							<a href="/lawyers/{lawyer.id}"
								>{(lawyer.title ? lawyer.title + ' ' : '') +
									lawyer.firstName +
									' ' +
									lawyer.middleName +
									' ' +
									lawyer.lastName +
									(lawyer.nameSuffix ? ' ' + lawyer.nameSuffix : '')}</a
							>
						</li>
					{/each}
				</ul>
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>

	<span>
		<a href="/lawyers/add" class="px-4 py-2 rounded-lg bg-trust text-diligence">Add Lawyer</a>
	</span>
</main>
