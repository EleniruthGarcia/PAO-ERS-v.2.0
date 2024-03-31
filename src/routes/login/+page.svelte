<script lang="ts">
	import type { PageServerData } from './$types';
	import LoginForm from '$lib/components/forms/LoginForm.svelte';

	export let data: PageServerData;
</script>

<div class="h-screen w-screen lg:grid lg:grid-cols-2">
	<div class="flex h-full w-full items-center justify-center py-12">
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
	<div class="hidden bg-muted lg:block">
		<img
			src="https://via.placeholder.com/1920x1080.png?text=Login+Page+Image"
			alt="placeholder"
			width="1920"
			height="1080"
			class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>
