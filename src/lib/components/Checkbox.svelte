<script lang="ts">
	export let name: string;
	export let labelEng: string;
	export let checked = false;
	export let labelFil = '';

	let classList = 'w-full';
	export { classList as class };
</script>

<div
	class="{classList} text-diligence has-[:checked]:bg-diligence has-[:checked]:text-oath outline-equity rounded block bg-oath text-sm text-equity duration-300"
>
	<button type="button" class="flex items-center justify-center p-2 px-3" on:click={() => (checked = !checked)}>
		<input {name} type="checkbox" bind:checked class="accent-diligence mr-2" placeholder=" " {...$$restProps} />
		<span class="font-bold pb-0.5"> {labelEng} </span>
		{labelFil !== '' ? ` | ${labelFil}` : ''}
	</button>
</div>
