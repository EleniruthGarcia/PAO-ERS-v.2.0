<script lang="ts">
	import Header from '$lib/components/navigation/Header.svelte';
	import Sidebar from '$lib/components/navigation/Sidebar.svelte';
</script>

<div class="flex">
	<Sidebar />
	<div class="flex w-full flex-col">
		<Header />
		<main class="flex-1 p-4">
			<slot />
		</main>
	</div>
</div>
