<script lang="ts">
	import { getFormControl } from 'formsnap';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let valueString: string;
	export { valueString as value };

	let value: DateValue | undefined;

	$: value = valueString ? parseDate(valueString) : undefined;

	export let placeholder: DateValue = today(getLocalTimeZone());

	const { attrs } = getFormControl();
</script>

<Popover.Root>
	<Popover.Trigger
		{...attrs}
		class={cn(
			buttonVariants({ variant: 'outline' }),
			'w-auto justify-start bg-muted/30 text-left font-normal',
			!value && 'text-muted-foreground'
		)}
	>
		{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
		<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" side="top">
		<Calendar
			calendarLabel="Pick a date"
			{value}
			bind:placeholder
			minValue={new CalendarDate(1900, 1, 1)}
			maxValue={today(getLocalTimeZone())}
			initialFocus
			onValueChange={(v) => {
				if (v) {
					valueString = v.toString();
				} else {
					valueString = '';
				}
			}}
		/>
	</Popover.Content>
</Popover.Root>
<input hidden bind:value={valueString} {...attrs} />
