<script lang="ts">
	export let name: string;
	export let labelEng: string;
	export let labelFil = '';
	export let w = 'w-80';
	export let value = '';
</script>

<div class="relative {w} text-diligence flex-auto">
	<select
		{name}
		id={name}
		class="w-full rounded block px-2 pb-1 pt-4 font-bold bg-oath text-sm outline outline-0 outline-equity appearance-none peer"
		placeholder=" "
		bind:value
		{...$$restProps}
	>
		<option value="" hidden />
		<slot />
	</select>
	<label
		for={name}
		class="absolute bg-oath text-sm text-equity pt-0.5 duration-300 top-2 z-10 origin-[0] px-2 start-1 pointer-events-none"
	>
		<span class="font-bold"> {labelEng} </span>
		{labelFil !== '' ? ` | ${labelFil}` : ''}
	</label>
</div>

<style>
	select:not([value='']):valid ~ label {
		--tw-translate-y: 2;
		transform: translateY(var(--tw-translate-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
		--tw-scale-x: 0.75;
		--tw-scale-y: 0.75;
		--tw-translate-y: -0.5rem;
		padding-top: 0;
	}

	select:not([value='']):valid {
		outline: 2px solid rgb(var(--color-equity) / 1);
	}
</style>
