<script lang="ts">
	export let title: string = '';
	export let message: string;
	export let success: null | (() => void) = null;
	export let cancel: null | (() => void) = null;
	export let closable: boolean = true;

	export let show: boolean = true;

	const close = () => {
		show = false;
	};
</script>

{#if show}
	<div
		class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 text-diligence"
	>
		<div class="bg-witness p-4 rounded-md max-w-md flex flex-col gap-2">
			<div class="flex items-center justify-between">
				{#if closable}
					<p class="font-bold mr-4">{title}</p>
					<button class="p-2 bg-transparent hover:bg-oath" on:click={close}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
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
			</div>
			<hr class="border border-trust bg-diligence" />
			<p class="text-sm text-justify pr-4 mb-2">{message}</p>
			<div class="flex justify-end gap-4">
				{#if success}
					<button class="" on:click={success}> OK </button>
				{/if}
				{#if cancel}
					<button class="px-4 py-2 rounded-lg bg-trust text-diligence" on:click={cancel}>
						Cancel
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
