<script lang="ts">
	import type { ActionData } from './$types';
	import Logo from '$lib/images/Logo.png';

	export let form: ActionData;
</script>

<main class="h-screen w-screen flex flex-col justify-center items-center">
	<form method="POST" class="container flex flex-col m-auto max-w-lg p-4 text-center gap-5">
		<img src={Logo} alt="Public Attorney's Office" class="w-32 m-auto" />
		<h1 class="text-2xl font-bold text-gray-800">Public Attorney's Office</h1>
		<div class="flex flex-col gap-4 max-w-md m-auto">
			<input
				class="p-2 rounded-lg border border-gray-300 text-sm"
				id="username"
				name="username"
				type="text"
				required
			/>
			<input
				class="p-2 rounded-lg border border-gray-300 text-sm"
				id="password"
				name="password"
				type="password"
				required
			/>

			{#if form?.user}
				<p class="error">Username is taken.</p>
			{/if}

			<button class="px-4 py-2 rounded-lg bg-green-800 text-white" type="submit">Register</button>
		</div>
	</form>
</main>
