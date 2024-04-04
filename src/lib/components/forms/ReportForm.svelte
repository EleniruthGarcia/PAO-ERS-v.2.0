<script lang="ts">
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from '$lib/schema/report';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';

	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {
			if (f.message) {
				toast.success(`Report Generated!`);
				const a = document.createElement('a');
				a.href =
					'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
					f.message.report;
				a.download = `report-${f.data.dob}.xlsx`;
				a.click();
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined;

	$: value = $formData.dob ? parseDate($formData.dob) : undefined;

	let placeholder: DateValue = today(getLocalTimeZone());
</script>

<form method="POST" class="space-y-8" use:enhance>
	<Form.Field {form} name="date" class="flex flex-col">
		<Form.Control let:attrs>
			<Form.Label>Date</Form.Label>
			<Popover.Root>
				<Popover.Trigger
					{...attrs}
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-[280px] justify-start pl-4 text-left font-normal',
						!value && 'text-muted-foreground'
					)}
				>
					{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
					<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						{value}
						bind:placeholder
						minValue={new CalendarDate(1900, 1, 1)}
						maxValue={today(getLocalTimeZone())}
						calendarLabel="Date of birth"
						initialFocus
						onValueChange={(v) => {
							if (v) {
								$formData.dob = v.toString();
							} else {
								$formData.dob = '';
							}
						}}
					/>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>Your date of birth is used to calculator your age</Form.Description>
			<Form.FieldErrors />
			<input hidden value={$formData.dob} name={attrs.name} />
		</Form.Control>
	</Form.Field>
	<Button type="submit">Submit</Button>
</form>
