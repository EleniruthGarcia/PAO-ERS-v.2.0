<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { months, reports, formSchema, type FormSchema } from '$lib/schema/report';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { ChevronLeft } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});
	$: selectMonth = {
		label: $formData.months,
		value: $formData.months
	};
	$: selectYear = {
		label: $formData.year,
		value: $formData.year
	};

	const yearOptions = Array.from({ length: 30 }, (_, i) => ({
		label: String(new Date().getFullYear() - i),
		value: new Date().getFullYear() - i
	}));

	const { form: formData, enhance } = form;
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	<div class="mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				Generate Report
			</h1>
			<!-- <Badge class="ml-auto sm:ml-0">In stock</Badge> -->
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Generate Report</Form.Button>
			</div>
		</div>
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-5 lg:gap-8">
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
				<Card.Root>
					<Form.Fieldset {form} name="reports" class="space-y-0">
						<Card.Header>
							<Card.Title>Report List</Card.Title>
							<Card.Description>Please check the reports you want to generate.</Card.Description>
						</Card.Header>
						<Card.Content class="grid auto-rows-max items-start gap-3">
							<div class="space-y-2">
								{#each reports as item}
									{@const checked = $formData.reports?.includes(item) ?? false}
									<div class="flex flex-row items-start space-x-3">
										<Form.Control let:attrs
											><Checkbox
												{...attrs}
												{checked}
												onCheckedChange={(v) => {
													if (v) {
														$formData.reports = [...($formData.reports ?? []), item];
													} else {
														$formData.reports = $formData.reports?.filter((v) => v !== item);
													}
												}}
											/>
											<Form.Label class="text-sm font-normal">
												{item}
											</Form.Label><input
												hidden
												type="checkbox"
												name={attrs.name}
												value={item}
												{checked}
											/>
										</Form.Control>
									</div>
								{/each}
								<Form.FieldErrors />
							</div>
						</Card.Content>
					</Form.Fieldset>
				</Card.Root>
			</div>
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Additional Information</Card.Title>
						<Card.Description>Please provide all necessary details.</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-2 items-start gap-3">
							<Form.Field {form} name="months" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Month</Form.Label>
									<Select.Root
										selected={selectMonth}
										onSelectedChange={(s) => {
											s && ($formData.months = s.value);
										}}
									>
										<Select.Input disabled name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content class="max-h-[200px] overflow-y-auto">
											{#each months as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="year" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Year</Form.Label>
									<Select.Root
										selected={selectYear}
										onSelectedChange={(s) => {
											s && ($formData.year = s.value);
										}}
									>
										<Select.Input disabled name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content class="max-h-[200px] overflow-y-auto">
											{#each yearOptions as { value, label }}
												<Select.Item {value} {label}>
													{label}
												</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<Form.Field {form} name="notedBy" class="grid gap-3">
							<Form.Control let:attrs>
								<Form.Label>Noted By</Form.Label>
								<Input {...attrs} bind:value={$formData.notedBy} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
		<div class="flex items-center justify-center gap-2 md:hidden">
			<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
			<Form.Button type="submit" size="sm">Generate Report</Form.Button>
		</div>
	</div>
</form>
