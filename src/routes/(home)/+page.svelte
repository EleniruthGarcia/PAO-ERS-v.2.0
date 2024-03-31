<script lang="ts">
	import Loading from '$lib/components/utils/Loading.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

{#await data.user}
	<Loading />
{:then user}
	{#if user}
		Please login
	{:else}
		Hello
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
