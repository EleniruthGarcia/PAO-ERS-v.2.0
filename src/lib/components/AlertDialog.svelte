<script lang="ts">
	export let message: string;
	export let success: null | (() => void) = null;
	export let cancel: null | (() => void) = null;
	export let closable: boolean = true;

	function close() {
		dispatchEvent(new CustomEvent('close'));
	}
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
	<div class="bg-white p-4 rounded-md">
		{#if closable}
			<button class="absolute top-2 right-2" on:click={close}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		{/if}
		<p>{message}</p>
		<div class="flex justify-end gap-4">
			{#if success}
				<button class="px-4 py-2 rounded-lg bg-trust text-diligence" on:click={success}>
					OK
				</button>
			{/if}
			{#if cancel}
				<button class="px-4 py-2 rounded-lg bg-trust text-diligence" on:click={cancel}>
					Cancel
				</button>
			{/if}
		</div>
	</div>
</div>
