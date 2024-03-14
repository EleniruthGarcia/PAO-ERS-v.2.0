<script lang="ts">
	export let name: string;
	export let labelEng: string;
	export let checked = false;
	export let labelFil = '';

	let classList = 'w-full';
	export { classList as class };
</script>

<div
	class="{classList} flex items-center justify-start text-diligence has-[:checked]:bg-diligence has-[:checked]:text-oath outline-equity rounded block bg-oath text-sm text-equity duration-300"
>
	<button
		type="button"
		class="flex items-center justify-start p-2 px-3 w-full"
		on:click={() => (checked = !checked)}
	>
		<input
			{name}
			type="checkbox"
			bind:checked
			class="accent-diligence mr-2"
			placeholder=" "
			{...$$restProps}
		/>
		<span class="font-bold pb-0.5 text-left"> {labelEng} </span>
		{labelFil !== '' ? ` | ${labelFil}` : ''}
	</button>
</div>
