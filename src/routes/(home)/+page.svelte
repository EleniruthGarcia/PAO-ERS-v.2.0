<script>
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-6">
	<img src="/favicon.png" alt="PAO-ERS Logo" class="aspect-square w-32 sm:w-40 md:w-48" />
	<div class="flex w-7/12 flex-col items-center justify-center gap-4">
		<span class="text-center">
			<h1 class="text-xl font-bold sm:text-2xl md:text-4xl">Public Attorney's Office</h1>
			<h2 class="text-l font-semibold sm:text-xl md:text-3xl">Electronic Records System</h2>
		</span>
		<p class="text-center text-xs sm:text-sm md:text-base">
			The Public Attorney’s Office exists to provide the indigent sector access to counsel at the
			time of need and to implement the Constitutional guarantee of free access to courts, due
			process, and equal protection of the laws.
		</p>
	</div>
	<Button on:click={() => {}}>Generate Interview Sheet</Button>
</div>
