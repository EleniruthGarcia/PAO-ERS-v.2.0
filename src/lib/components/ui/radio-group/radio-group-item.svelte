<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import Check from 'svelte-radix/Check.svelte';
	import { cn } from '$lib/utils.js';

	type $$Props = RadioGroupPrimitive.ItemProps & {
		value: string;
	};
	type $$Events = RadioGroupPrimitive.ItemEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export { className as class };
</script>

<RadioGroupPrimitive.Item
	{value}
	class={cn(
		"aspect square data-[disabled=true]:opacity-50' h-4 w-4 shrink-0 rounded-lg border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
		className
	)}
	{...$$restProps}
	on:click
>
	<div class="flex items-center justify-center">
		<RadioGroupPrimitive.ItemIndicator>
			<Check class="h-3.5 w-3.5 fill-primary" />
		</RadioGroupPrimitive.ItemIndicator>
	</div>
</RadioGroupPrimitive.Item>
