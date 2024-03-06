<script lang="ts">
	export let type = 'text';
	export let labelEng: string;
	export let labelFil = '';
	export let grow = false;

	let classList = 'w-full';
	export { classList as class };
</script>

<div class="relative text-diligence {grow ? 'grow' : ''}">
	<input
		{type}
		id="field"
		class="{classList} rounded block px-2 pb-1 pt-4 font-bold bg-oath text-sm outline outline-2 outline-equity placeholder-shown:outline-0 appearance-none peer"
		placeholder=" "
		{...$$restProps}
	/>
	<label
		for="field"
		class="absolute bg-oath text-sm text-equity duration-300 transform -translate-y-2 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-equity peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-2 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 pointer-events-none"
	>
		<span class="font-bold"> {labelEng} </span>
		{labelFil !== '' ? ` | ${labelFil}` : ''}
	</label>
</div>
