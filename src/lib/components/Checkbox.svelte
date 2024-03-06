<script lang="ts">
	export let name: string;
	export let labelEng: string;
	export let checked = false;
	export let labelFil = '';

	let classList = 'w-full';
	export { classList as class };
</script>

<input {name} type="checkbox" bind:checked class="peer" hidden placeholder=" " {...$$restProps} />
<div
	class="{classList} text-diligence outline outline-0 peer-checked:outline-2 outline-equity rounded block p-2 bg-oath text-sm text-equity duration-300"
>
	<button type="button" class="h-full" on:click={() => (checked = !checked)}>
		<span class="font-bold"> {labelEng} </span>
		{labelFil !== '' ? ` | ${labelFil}` : ''}
	</button>
</div>
