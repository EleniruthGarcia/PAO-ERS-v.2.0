<script lang="ts">
	import { page } from '$app/stores';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		formSchema,
		natureOfTheCase,
		type FormSchema,
		clientInvolvement,
		adversePartyInvolvement,
		status,
		genderCaseSubject,
		causeOfTermination
	} from '$lib/schema/case';
	import { type SuperValidated, type Infer, superForm, dateProxy } from 'sveltekit-superforms';

	import { CaretSort, Check, ChevronLeft } from 'svelte-radix';

	import Loading from '$lib/components/Loading.svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	import { Textarea } from '$lib/components/ui/textarea';
	import { Combobox } from 'bits-ui';
	import { flyAndScale } from '$lib/utils';
	import DatePicker from '../DatePicker.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import type { Document } from 'mongodb';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, delayed } = form;

	const proxyDateOfBirth = dateProxy(form, 'dateOfBirth', {
		format: 'date',
		empty: 'undefined'
	});

	const proxyDateOfCommission = dateProxy(form, 'dateOfCommission', {
		format: 'date',
		empty: 'undefined'
	});

	$: selectedNatureOfTheCase = {
		label: $formData.natureOfTheCase,
		value: $formData.natureOfTheCase
	};
	$: selectedCurrentStatus = {
		label: $formData.currentStatus,
		value: $formData.currentStatus
	};
	$: selectedService = {
		label: $page.data.services.find((service) => service._id === $formData.controlNo)?.title ?? '',
		value: $formData.controlNo
	};
	$: selectedCauseOfTermination = {
		label: $formData.causeOfTermination,
		value: $formData.causeOfTermination
	};

	$: $formData.currentStatus === 'Transferred to private lawyer, IBP, etc.'
		? ($formData.transferredFrom = $formData.transferredFrom ?? $page.data.users[0]?._id)
		: ($formData.transferredFrom = undefined);

	$: selectedTransferredFrom = {
		label:
			$page.data.users.find((lawyer: Document) => lawyer._id === $formData.transferredFrom)?.name ??
			'',
		value: $formData.transferredFrom
	};

	$: selectedTransferredTo = {
		label:
			$page.data.users.find((lawyer: Document) => lawyer._id === $formData.transferredTo)?.name ??
			'',
		value: $formData.transferredTo
	};

	$: touchedGenderCaseSubject = false;
	$: filteredGenderCaseSubject =
		$formData.genderCaseSubject && touchedGenderCaseSubject
			? genderCaseSubject.filter((v) =>
					v.toLowerCase().includes($formData.genderCaseSubject?.toLowerCase() ?? '')
				)
			: genderCaseSubject;
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	{#if $delayed}<Loading />{/if}
	<div class="mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				{$formData.currentStatus === 'New' ? 'Add Case' : 'Update Case'}
			</h1>
			<!-- <Badge class="ml-auto sm:ml-0">In stock</Badge> -->
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Submit</Form.Button>
			</div>
		</div>
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-5 lg:gap-8">
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Case Information</Card.Title>
						<Card.Description>Please fill out all necessary information.</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="natureOfTheCase" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Nature of the Case <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Select.Root
										selected={selectedNatureOfTheCase}
										onSelectedChange={(s) => {
											s && ($formData.natureOfTheCase = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each natureOfTheCase as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="caseSpecs" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Case Specification <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Input {...attrs} bind:value={$formData.caseSpecs} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid items-start gap-3 lg:grid-cols-2">
							<Form.Field {form} name="controlNo" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Control Number <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Select.Root
										selected={selectedService}
										onSelectedChange={(s) => {
											s && ($formData.controlNo = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each $page.data.services as service}
												<Select.Item value={service._id}>
													[{service._id}] {service.title}
												</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field
								{form}
								name="pendingInCourt"
								class="flex w-fit flex-row items-center space-x-3 space-y-0 rounded-md border p-4"
							>
								<Form.Control let:attrs>
									<Checkbox {...attrs} bind:checked={$formData.pendingInCourt} />
									<div class="h-10 space-y-2 truncate leading-none">
										<Form.Label>Pending in Court</Form.Label>
										<Form.Description>Check if case is pending in court.</Form.Description>
									</div>
									<input name={attrs.name} bind:value={$formData.pendingInCourt} hidden />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Card.Title>Adverse Party's Information</Card.Title>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<div class="grid items-start gap-3 sm:grid-cols-5">
							<Form.Field {form} name="adversePartyName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label>
										Adverse Party Name <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Input {...attrs} bind:value={$formData.adversePartyName} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="adversePartyAddress" class="grid gap-3 sm:col-span-3">
								<Form.Control let:attrs>
									<Form.Label>
										Adverse Party Address <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Input {...attrs} bind:value={$formData.adversePartyAddress} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</Card.Content>
				</Card.Root>
				{#if $formData.pendingInCourt}
					<Card.Root>
						<Card.Header>
							<Card.Title>Court Information</Card.Title>
							<Card.Description>Please fill out all necessary information.</Card.Description>
						</Card.Header>
						<Card.Content class="grid auto-rows-max items-start gap-3">
							<Form.Field {form} name="titleOfTheCase" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Title of the Case</Form.Label>
									<Input {...attrs} bind:value={$formData.titleOfTheCase} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<div class="grid items-start gap-3 sm:grid-cols-2">
								<Form.Field {form} name="docketNumber" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Docket Number</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.docketNumber}
											placeholder="Docket Number"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="court" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Court</Form.Label>
										<Input {...attrs} bind:value={$formData.court} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
				<Card.Root>
					<Card.Header>
						<Card.Title>Facts of the Case</Card.Title>
						<Card.Description>Type the facts of the case here.</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<Form.Field {form} name="factsOfTheCase">
							<Form.Control let:attrs>
								<Textarea {...attrs} bind:value={$formData.factsOfTheCase} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Card.Title>Cause of Action or Nature of Offence</Card.Title>
						<Card.Description>
							Type the cause of action or the nature of offence here.
						</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<Form.Field {form} name="causeOfActionOrNatureOfOffence">
							<Form.Control let:attrs>
								<Textarea {...attrs} bind:value={$formData.causeOfActionOrNatureOfOffence} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Card.Title>Gender-Related Case Information</Card.Title>
						<Card.Description>
							This is necessary only for gender-related cases. It may be left blank otherwise.
						</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<Form.Field {form} name="genderCaseSubject" class="grid gap-3">
							<Form.Control let:attrs>
								<Form.Label>Subject of the Case</Form.Label>
								<Combobox.Root
									items={filteredGenderCaseSubject}
									bind:inputValue={$formData.genderCaseSubject}
									bind:touchedInput={touchedGenderCaseSubject}
								>
									<div class="relative">
										<Combobox.Input
											class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
											placeholder="Please type subject or select from options."
										/>
										<CaretSort class="absolute end-3 top-2.5 ml-2 h-4 w-4 shrink-0 opacity-50" />
									</div>

									<Combobox.Content
										class="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none"
										transition={flyAndScale}
										sideOffset={8}
									>
										{#each filteredGenderCaseSubject as value}
											<Combobox.Item
												class="elative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50"
												{value}
											>
												{value}
												<Combobox.ItemIndicator
													class="absolute right-3 flex h-3.5 w-3.5 items-center justify-center"
													asChild={false}
												>
													<Check class="h-4 w-4" />
												</Combobox.ItemIndicator>
											</Combobox.Item>
										{:else}
											<span class="block px-5 py-2 text-sm text-muted-foreground">
												No results found.
											</span>
										{/each}
									</Combobox.Content>
									<Combobox.HiddenInput name="genderCaseSubject" />
								</Combobox.Root>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Card.Title>CICL Case Information</Card.Title>
						<Card.Description>
							This is necessary only for CICL cases. It may be left blank otherwise.
						</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<Form.Field {form} name="judge" class="grid gap-3">
							<Form.Control let:attrs>
								<Form.Label>Judge or Investigating Prosecutor</Form.Label>
								<Input {...attrs} bind:value={$formData.judge} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="dateOfBirth" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Date of Birth</Form.Label>
									<DatePicker bind:value={$proxyDateOfBirth} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="dateOfCommission" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Date of Commission of Crime</Form.Label>
									<DatePicker bind:value={$proxyDateOfCommission} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>
							Case Status <span class="font-bold text-destructive">*</span>
						</Card.Title>
						<Card.Description>Please select the latest case status.</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<Form.Field {form} name="currentStatus" class="grid gap-3">
							<Form.Control let:attrs>
								<Select.Root
									selected={selectedCurrentStatus}
									onSelectedChange={(s) => {
										s && ($formData.currentStatus = s.value);
									}}
								>
									<Select.Input name={attrs.name} />
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="" />
									</Select.Trigger>
									<Select.Content>
										{#each status as value}
											<Select.Item {value} />
										{/each}
									</Select.Content>
								</Select.Root>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Separator class="my-4" />
						<Form.Field {form} name="actionTaken" class="grid gap-3">
							<Form.Control let:attrs>
								<Form.Label>
									Action Taken <span class="font-bold text-destructive">*</span>
								</Form.Label>
								<Input {...attrs} bind:value={$formData.actionTaken} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
				</Card.Root>
				{#if $formData.currentStatus === 'Terminated'}
					<Card.Root>
						<Card.Header>
							<Card.Title>Terminated Case</Card.Title>
						</Card.Header>
						<Card.Content class="grid auto-rows-max items-start gap-3">
							<Form.Field {form} name="causeOfTermination" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Cause of Termination</Form.Label>
									<Select.Root
										selected={selectedCauseOfTermination}
										onSelectedChange={(s) => {
											s && ($formData.causeOfTermination = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each causeOfTermination as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</Card.Content>
					</Card.Root>
				{/if}
				{#if $formData.currentStatus === 'Transferred to private lawyer, IBP, etc.'}
					<Card.Root>
						<Card.Header>
							<Card.Title>Transfer Information</Card.Title>
							<Card.Description>Please fill out all necessary information.</Card.Description>
						</Card.Header>
						<Card.Content class="grid auto-rows-max items-start gap-3">
							<Form.Field {form} name="transferredFrom" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Transferred From</Form.Label>
									<Select.Root
										selected={selectedTransferredFrom}
										onSelectedChange={(s) => {
											s && ($formData.transferredFrom = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each $page.data.users as lawyer}
												<Select.Item bind:value={lawyer._id}>{lawyer.name}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="transferredTo" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Transferred To</Form.Label>
									<Select.Root
										selected={selectedTransferredTo}
										onSelectedChange={(s) => {
											s && ($formData.transferredTo = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each $page.data.users as lawyer}
												<Select.Item bind:value={lawyer._id}>{lawyer.name}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</Card.Content>
					</Card.Root>
				{/if}
				<Card.Root>
					<Form.Fieldset {form} name="clientInvolvement" class="space-y-0">
						<Card.Header>
							<Card.Title>
								<Form.Legend>
									Client's Case Involvement <span class="font-bold text-destructive">*</span>
								</Form.Legend>
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								{#each clientInvolvement as item}
									{@const checked = $formData.clientInvolvement?.includes(item) ?? false}
									<div class="flex flex-row items-start space-x-3">
										<Form.Control let:attrs>
											<Checkbox
												{...attrs}
												{checked}
												onCheckedChange={(v) => {
													if (v) {
														$formData.clientInvolvement = [
															...($formData.clientInvolvement ?? []),
															item
														];
													} else {
														$formData.clientInvolvement = $formData.clientInvolvement?.filter(
															(v) => v !== item
														);
													}
												}}
											/>
											<Form.Label class="text-sm font-normal">
												{item}
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
				<Card.Root>
					<Form.Fieldset {form} name="adversePartyInvolvement" class="space-y-0">
						<Card.Header>
							<Card.Title>
								<Form.Legend>
									Adverse Party's Case Involvement <span class="font-bold text-destructive">*</span>
								</Form.Legend>
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								{#each adversePartyInvolvement as item}
									{@const checked = $formData.adversePartyInvolvement?.includes(item) ?? false}
									<div class="flex flex-row items-start space-x-3">
										<Form.Control let:attrs>
											<Checkbox
												{...attrs}
												{checked}
												onCheckedChange={(v) => {
													if (v) {
														$formData.adversePartyInvolvement = [
															...($formData.adversePartyInvolvement ?? []),
															item
														];
													} else {
														$formData.adversePartyInvolvement =
															$formData.adversePartyInvolvement?.filter((v) => v !== item);
													}
												}}
											/>
											<Form.Label class="text-sm font-normal">
												{item}
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
			</div>
			<div class="flex items-center justify-center gap-2 md:hidden">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Submit</Form.Button>
			</div>
		</div>
	</div>
</form>
