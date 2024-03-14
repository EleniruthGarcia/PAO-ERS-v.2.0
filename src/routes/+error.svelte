<script lang="ts">
	import { page } from '$app/stores';
</script>

<main
	class="h-screen w-full pt-12 p-6 lg:p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence"
>
	<h1 class="text-4xl font-bold text-center">Error</h1>
	<p class="text-center">
		<code>{$page.error?.message}</code>
	</p>
</main>
