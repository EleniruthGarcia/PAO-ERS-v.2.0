<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary components and dependencies.

	import { page } from '$app/stores';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { months, formSchema, type FormSchema } from '$lib/schema/report';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { ChevronLeft } from 'svelte-radix';
	import Loading from '$lib/components/Loading.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});
	$: selectMonth = {
		label: $formData.month,
		value: $formData.month
	};
	$: selectYear = {
		label: $formData.year.toString(),
		value: $formData.year.toString()
	};
	$: selectedNotedBy = {
		label: $page.data.lawyers.find((lawyer: any) => lawyer._id === $formData.notedBy)?.name ?? '',
		value: $formData.notedBy
	};

	const yearOptions = Array.from({ length: 30 }, (_, i) => ({
		label: String(new Date().getFullYear() - i),
		value: new Date().getFullYear() - i
	}));

	const { form: formData, enhance, delayed } = form;
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	{#if $delayed}
		<Loading />
	{/if}
	<!-- Show loading interface while data is loading. -->

	<div class="mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4">
		<!-- PAGE HEADER -->

		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				Generate Report
			</h1>
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Generate Report</Form.Button>
			</div>
		</div>
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-8 lg:gap-8">
			<!-- This is a report list for custom import of reports, which has been temporarily discontinued as per client request. -->

			<!-- <div class="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
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
										<Form.Control let:attrs>
											<Checkbox
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
												<span class="font-bold">{item.substring(0, 4)}</span>
												{item.substring(4)}
											</Form.Label>
											<input hidden type="checkbox" name={attrs.name} value={item} {checked} />
										</Form.Control>
									</div>
								{/each}
								<Form.FieldErrors />
							</div>
						</Card.Content>
					</Form.Fieldset>
				</Card.Root>
			</div> -->

			<!-- This is for miscellaneous information necesarry for report footers. -->

			<div class="grid auto-rows-max items-start gap-4 lg:col-span-5 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Report Information</Card.Title>
						<Card.Description>Please provide all necessary details.</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-3 items-start gap-3">
							<Form.Field {form} name="month" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Month</Form.Label>
									<Select.Root
										selected={selectMonth}
										onSelectedChange={(s) => {
											s && ($formData.month = s.value);
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
							<Form.Field {form} name="day" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Day</Form.Label>
									<Input {...attrs} type="number" bind:value={$formData.day} min="1" max="31" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="year" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Year</Form.Label>
									<Select.Root
										selected={selectYear}
										onSelectedChange={(s) => {
											s && ($formData.year = parseInt(s.value));
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
								<Form.Label>Noted by</Form.Label>
								<Select.Root
									selected={selectedNotedBy}
									onSelectedChange={(s) => {
										s && ($formData.notedBy = s.value);
									}}
								>
									<Select.Input name={attrs.name} />
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="" />
									</Select.Trigger>
									<Select.Content>
										{#each $page.data.lawyers as lawyer}
											<Select.Item bind:value={lawyer._id}>{lawyer.name}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Put all disclaimers here for clients. -->

			<div class="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Disclaimer</Card.Title>
						<Card.Description
							>All reports can be edited. Some aspects of the report require manual input from the
							user, these are indicated as light purple cells.</Card.Description
						>
					</Card.Header>
					<Card.Content class="mx-4 text-sm">
						<ul class="list-disc">
							<li>
								<strong>F29 (Individual Performance Report)</strong>
								<ul class="ml-4 list-[circle]">
									<li>Inmates served/released</li>
									<li>Conducted jail visits</li>
									<li>Jail/detention units visited</li>
									<li>Barangay legal outreach</li>
									<li>Beneficiaries</li>
									<li>Legal aid information</li>
									<li>Scheduled hearings</li>
									<li>Postponement</li>
								</ul>
							</li>
							<li>
								<strong>F48 (Age and Sex Disaggregated Report on Released PDLs)</strong>
								<ul class="ml-4 list-[circle]">
									<li>Other legal reasons for release, if any</li>
								</ul>
							</li>
							<li>
								<strong
									>F49 (Consolidated Report On Legal Assistance Rendered To Former Rebels (FRs) And
									Former Violent Extremists (FVEs))</strong
								>
								<ul class="ml-4 list-[circle]">
									<li>Usual cases</li>
									<li>Remarks</li>
									<li>Legal outreach activities</li>
								</ul>
							</li>
						</ul>
					</Card.Content>
				</Card.Root>
			</div>
		</div>

		<!-- These are submit options that appear at the button of the page for user convenience. -->

		<div class="flex items-center justify-center gap-2 md:hidden">
			<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
			<Form.Button type="submit" size="sm">Generate Report</Form.Button>
		</div>
	</div>
</form>
