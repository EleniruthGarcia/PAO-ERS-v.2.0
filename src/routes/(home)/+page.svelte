<script>
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex h-full min-h-[550px] flex-col items-center justify-center gap-6">
	<img
		src="/favicon.png"
		alt="PAO-ERS Logo"
		class="aspect-square w-32 [view-transition-name:logo] sm:w-40 md:w-48"
	/>
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
	<div class="flex flex-col rounded-md border border-input items-center bg-transparent px-7 py-3 shadow-sm">
		<span class="text-sm font-bold md:text-base">Generate Interview Sheet</span>
				<div class="mt-2 flex items-center justify-center gap-2 pb-2 text-sm md:text-base">
					<Button href="/create_en" class="hidden md:block">English</Button><Button href="/create_en" class="block md:hidden">EN</Button>
					<Button href="/create_tl" class="hidden md:block">Tagalog</Button><Button href="/create_tl" class="block md:hidden">TL</Button>
					<Button href="/create_il" class="hidden md:block">Ilocano</Button><Button href="/create_il" class="block md:hidden">IL</Button>
				</div>
	</div>
</div>
