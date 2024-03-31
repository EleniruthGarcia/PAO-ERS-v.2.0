<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

{#await data.user}
	<p>Loading...</p>
{:then user}
	{#if user}
		Please login
	{:else}
		Hello
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
