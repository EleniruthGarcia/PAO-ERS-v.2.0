<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary dependencies and components.
	import type { PageServerData } from './$types';
	import LoginForm from '$lib/components/forms/LoginForm.svelte';

	export let data: PageServerData;
</script>

<div class="h-dvh w-screen lg:flex">

	<!-- SIDE PANEL -->

	<div class="hidden h-full flex-col items-center justify-center gap-6 lg:flex">
		<img
			src="/favicon.png"
			alt="PAO-ERS Logo"
			class="aspect-square w-32 [view-transition-name:logo] sm:w-40 md:w-48"
		/>
		<div class="flex w-9/12 flex-col items-center justify-center gap-4">
			<span class="text-center">
				<h1 class="text-xl font-bold sm:text-2xl md:text-4xl">Public Attorney's Office</h1>
				<h2 class="text-l font-semibold text-primary sm:text-xl md:text-3xl">
					Electronic Records System
				</h2>
			</span>
			<p class="text-center text-xs sm:text-sm md:text-base">
				The Public Attorney’s Office - Electronic Records System (PAO-ERS) is a web-based
				application that aims to provide a more efficient and effective way of managing records and
				cases of the Public Attorney’s Office. It is designed to be user-friendly and accessible to
				all PAO personnel.
			</p>
		</div>
	</div>

	<!-- LOG-IN FORM -->

	<div class="flex h-full w-full items-center justify-center bg-secondary p-12">
		<LoginForm data={data.form} />
	</div>
</div>
