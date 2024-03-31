<script lang="ts">
	import type { PageServerData } from './$types';
	import LoginForm from '$lib/components/forms/LoginForm.svelte';

	export let data: PageServerData;
</script>

<div class="h-screen w-screen lg:flex">
	<div class="hidden h-full flex-col items-center justify-center gap-6 bg-secondary lg:flex">
		<img src="/favicon.png" alt="PAO-ERS Logo" class="aspect-square w-32 sm:w-40 md:w-48" />
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
	<div class="flex h-full w-full items-center justify-center p-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">PAO-ERS</h1>
				<p class="text-balance text-muted-foreground">
					Enter your credentials below to login to your account.
				</p>
			</div>
			<LoginForm data={data.form} />
		</div>
	</div>
</div>
