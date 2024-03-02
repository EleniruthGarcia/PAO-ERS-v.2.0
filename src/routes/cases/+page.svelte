<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	<span>
		<h1 class="text-3xl font-bold">Cases</h1>
		<p>See all your cases here.</p>
	</span>

	<div class="flex flex-colgap-4 bg-white border border-gray-300 rounded-md p-4">
		{#await data.cases}
			<div class="animate-pulse flex flex-col gap-1">
				<div class="rounded-full bg-slate-500 h-2 w-40"></div>
				<div class="rounded-full bg-slate-500 h-1 w-20"></div>
				<div class="rounded-full bg-slate-500 h-1 w-10"></div>
			</div>
		{:then cases}
			{#if cases.length === 0}
				<p>No cases found!</p>
			{:else}
				<ul>
					{#each cases as _case}
						<li>
							<a href="/cases/{_case.id}">{_case.title}</a>
						</li>
					{/each}
				</ul>
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>

	<span>
		<a href="/cases/add" class="px-4 py-2 rounded-lg bg-green-800 text-white">New case</a>
	</span>
</main>
