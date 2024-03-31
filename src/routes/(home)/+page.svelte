<script>
	import { Button } from '$lib/components/ui/button';
</script>

<div class="container flex flex-col items-center justify-center gap-6">
	<img src="/favicon.png" alt="PAO-ERS Logo" class="aspect-square w-32 sm:w-40 md:w-48" />
	<div class="flex w-7/12 flex-col items-center justify-center gap-4">
		<span class="text-center">
			<h1 class="text-xl font-bold sm:text-2xl md:text-4xl">Public Attorney's Office</h1>
			<h2 class="text-l font-semibold text-primary sm:text-xl md:text-3xl">
				Electronic Records System
			</h2>
		</span>
		<p class="text-center text-xs sm:text-sm md:text-base">
			The Public Attorney’s Office - Electronic Records System (PAO-ERS) is a web-based application
			that aims to provide a more efficient and effective way of managing records and cases of the
			Public Attorney’s Office. It is designed to be user-friendly and accessible to all PAO
			personnel.
		</p>
	</div>
	<Button on:click={() => {}}>Generate Interview Sheet</Button>
</div>
