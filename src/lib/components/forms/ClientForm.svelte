<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary components and dependencies.

	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		civilStatus,
		classification,
		educationalAttainment,
		formSchema,
		proofOfIndigency,
		pwd,
		sex,
		religion,
		languages,
		suffix,
		type FormSchema
	} from '$lib/schema/client';
	import {
		type SuperValidated,
		type Infer,
		superForm,
		dateProxy,
		intProxy
	} from 'sveltekit-superforms';
	import { CaretSort, Check, ChevronLeft } from 'svelte-radix';
	import Loading from '$lib/components/Loading.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { Combobox } from 'bits-ui';
	import { flyAndScale } from '$lib/utils';
	import Separator from '../ui/separator/separator.svelte';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, delayed } = form;

	const proxyAge = intProxy(form, 'age', { empty: '' });
	const proxyDetainedSince = dateProxy(form, 'detainedSince', {
		format: 'date',
		empty: ''
	});
	const proxyDetainedUntil = dateProxy(form, 'detainedUntil', {
		format: 'date',
		empty: ''
	});

	$: if ($formData.sex === 'Female') {
		if (!$formData.classification?.includes('Woman Client'))
			$formData.classification = [...($formData.classification ?? []), 'Woman Client'];
	} else {
		if ($formData.classification?.includes('Woman Client'))
			$formData.classification = $formData.classification?.filter((v) => v !== 'Woman Client');
	}

	$: if ($formData.age && $formData.age >= 60) {
		if (!$formData.classification?.includes('Senior Citizen'))
			$formData.classification = [...($formData.classification ?? []), 'Senior Citizen'];
	} else {
		if ($formData.classification?.includes('Senior Citizen'))
			$formData.classification = $formData.classification?.filter((v) => v !== 'Senior Citizen');
	}

	$: $formData.name = `${$formData.firstName}${$formData.middleName ? ' ' + $formData.middleName : ''} ${
		$formData.lastName
	}${$formData.suffix ? ', ' + $formData.suffix : ''}`;

	$: $formData.spouseName =
		$formData.civilStatus === 'MARRIED' && $formData.spouseFirstName && $formData.spouseLastName
			? `${$formData.spouseFirstName}${
					$formData.spouseMiddleName ? ' ' + $formData.spouseMiddleName : ''
				} ${$formData.spouseLastName}${$formData.spouseNameSuffix ? ', ' + $formData.spouseNameSuffix : ''}`
			: '';

	$: selectedSex = {
		label: $formData.sex,
		value: $formData.sex
	};

	$: selectedCivilStatus = {
		label: $formData.civilStatus,
		value: $formData.civilStatus
	};

	$: selectedEducationalAttainment = {
		label: $formData.educationalAttainment,
		value: $formData.educationalAttainment
	};
	
	$: selectedReligion = {
		label: $formData.religion,
		value: $formData.religion
	};
	$: selectedSuffix = {
		label: $formData.suffix,
		value: $formData.suffix
	};

	$: touchedSuffix = false;
	$: filteredSuffix =
		$formData.suffix && touchedSuffix
			? suffix.filter((v) =>
					v.toLowerCase().includes($formData.suffix?.toLowerCase() ?? '')
				)
			: suffix;

	$: touchedReligion = false;
	$: filteredReligion =
		$formData.religion && touchedReligion
			? religion.filter((v) =>
					v.toLowerCase().includes($formData.religion?.toLowerCase() ?? '')
				)
			: religion;

	$: touchedProof = false;
	$: filteredProof =
		$formData.proofOfIndigency && touchedProof
			? proofOfIndigency.filter((v) =>
					v.toLowerCase().includes($formData.proofOfIndigency?.toLowerCase() ?? '')
				)
			: proofOfIndigency;

	$: touchedPWD = false;
	$: filteredPWD =
		$formData.pwd && touchedPWD
			? pwd.filter((v) => v.toLowerCase().includes($formData.pwd?.toLowerCase() ?? ''))
			: pwd;
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	{#if $delayed}
		<Loading />
	{/if}
	<!-- Show loading interface while data is loading. -->

	<!-- PAGE HEADER -->

	<input type="hidden" name="_id" bind:value={$formData._id} />
	<input type="hidden" name="name" bind:value={$formData.name} />
	<div class="mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				{$formData.currentStatus === 'New' ? 'Add Client' : 'Update Client'}
			</h1>
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Submit</Form.Button>
			</div>
		</div>
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-5 lg:gap-8">
			<!-- MAIN CLIENT INFORMATION -->

			<div class="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Personal Information</Card.Title>
						<Card.Description>
							Please fill out all necessary information. Required fields are marked with <span
								class="font-bold text-destructive"
							>
								*
							</span>
							.
						</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<div class="grid items-start gap-3 sm:grid-cols-7">
							<Form.Field {form} name="firstName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label>
										Name <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Input {...attrs} bind:value={$formData.firstName} placeholder="First Name" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="middleName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
									<Input {...attrs} bind:value={$formData.middleName} placeholder="Middle Name" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="lastName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
									<Input {...attrs} bind:value={$formData.lastName} placeholder="Last Name" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="suffix" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Suffix</Form.Label>
									<Combobox.Root
										items={filteredSuffix}
										bind:inputValue={$formData.suffix}
										bind:touchedInput={touchedSuffix}
									>
										<div class="relative">
											<Combobox.Input
												class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
												placeholder="NONE"
											/>
											<CaretSort class="absolute end-3 top-2.5 ml-2 h-4 w-4 shrink-0 opacity-50" />
										</div>

										<Combobox.Content
											class="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none"
											transition={flyAndScale}
											sideOffset={8}
										>
											{#each filteredSuffix as value}
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
										<Combobox.HiddenInput name="suffix" />
									</Combobox.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid items-start gap-3 sm:grid-cols-3">
							<Form.Field {form} name="age" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Age</Form.Label>
									<Input {...attrs} bind:value={$proxyAge} type="number" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="sex" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Sex <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Select.Root
										selected={selectedSex}
										onSelectedChange={(s) => {
											s && ($formData.sex = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each sex as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="civilStatus" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Civil Status <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Select.Root
										selected={selectedCivilStatus}
										onSelectedChange={(s) => {
											s && ($formData.civilStatus = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each civilStatus as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="citizenship" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Citizenship</Form.Label>
									<Input {...attrs} bind:value={$formData.citizenship} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>

							<!--New religion dropdown-->
							<Form.Field {form} name="religion" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Religion</Form.Label>
									<Combobox.Root
										items={filteredReligion}
										bind:inputValue={$formData.religion}
										bind:touchedInput={touchedReligion}
									>
										<div class="relative">
											<Combobox.Input
												class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
												placeholder="Please type or select."
											/>
											<CaretSort class="absolute end-3 top-2.5 ml-2 h-4 w-4 shrink-0 opacity-50" />
										</div>

										<Combobox.Content
											class="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none"
											transition={flyAndScale}
											sideOffset={8}
										>
											{#each filteredReligion as value}
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
										<Combobox.HiddenInput name="religion" />
									</Combobox.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>

						</div>
						<!--Language and Religion dropdown update as of June 16-->
						<Form.Fieldset {form} name="language" class="flex flex-col gap-3 space-y-0">
							
							
							<Form.Legend>
								Languages (Mother Tongue) <span class="font-bold text-destructive">*</span>
							</Form.Legend>
							
							
							<Form.Description>Please select all the apply.</Form.Description>
							
							
							<div class="grid items-start gap-3 sm:grid-cols-4">
						
								{#each languages as item}
									{@const checked = $formData.language?.includes(item) ?? false}
									<div class="flex flex-row items-start space-x-3">
										<Form.Control let:attrs>
											<Checkbox
												{...attrs}
												{checked}
												onCheckedChange={(v) => {
													if (v) {
														$formData.language = [...($formData.language ?? []), item];
													} else {
														$formData.language = $formData.language?.filter(
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
						
					</Form.Fieldset>
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="educationalAttainment" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Education <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Select.Root
										selected={selectedEducationalAttainment}
										onSelectedChange={(s) => {
											s && ($formData.educationalAttainment = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each educationalAttainment as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="individualMonthlyIncome" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Net Monthly Income</Form.Label>
									<span class="flex items-center gap-2">
										₱<Input {...attrs} bind:value={$formData.individualMonthlyIncome} /></span
									>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="proofOfIndigency" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Proof of Indigency</Form.Label>
									<Combobox.Root
										items={filteredProof}
										bind:inputValue={$formData.proofOfIndigency}
										bind:touchedInput={touchedProof}
									>
										<div class="relative">
											<Combobox.Input
												class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
												placeholder="Please type or select."
											/>
											<CaretSort class="absolute end-3 top-2.5 ml-2 h-4 w-4 shrink-0 opacity-50" />
										</div>

										<Combobox.Content
											class="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none"
											transition={flyAndScale}
											sideOffset={8}
										>
											{#each filteredProof as value}
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
										<Combobox.HiddenInput name="proofOfIndigency" />
									</Combobox.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field
								{form}
								name="detained"
								class="flex w-fit flex-row items-center space-x-3 space-y-0 rounded-md border p-4"
							>
								<Form.Control let:attrs>
									<Checkbox {...attrs} bind:checked={$formData.detained} />
									<div class="h-10 space-y-2 truncate leading-none">
										<Form.Label>Detained</Form.Label>
										<Form.Description>Check if the client is detained.</Form.Description>
									</div>
									<input name={attrs.name} bind:value={$formData.detained} hidden />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- CLIENT CONTACT INFORMATION -->

				<Card.Root>
					<Card.Header>
						<Card.Title>Contact Information</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="address" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label>
										Address <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<div class="flex items-center gap-2">
										<Input {...attrs} bind:value={$formData.address} placeholder="Address" />
										<span class="w-20 text-nowrap text-right text-muted-foreground"
											><span class={$formData.address.length > 40 ? 'text-destructive' : ''}
												>{$formData.address.length}</span
											> / 40</span
										>
									</div>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="contactNumber" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Contact Number</Form.Label>
									<Input {...attrs} bind:value={$formData.contactNumber} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="email" class="grid gap-3 sm:col-span-4">
							<Form.Control let:attrs>
								<Form.Label>Email Address</Form.Label>
								<Input
									{...attrs}
									type="email"
									placeholder="example@email.com"
									bind:value={$formData.email}
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- SPOUSE INFORMATION
				This is for married clients only. -->

				{#if $formData.civilStatus === 'MARRIED'}
					<Card.Root>
						<Card.Header>
							<Card.Title>Spouse Information</Card.Title>
						</Card.Header>
						<Card.Content class="grid auto-rows-max items-start gap-3">
							<div class="grid items-start gap-3 sm:grid-cols-7">
								<Form.Field {form} name="spouseFirstName" class="grid gap-3 sm:col-span-2">
									<Form.Control let:attrs>
										<Form.Label>Name</Form.Label>
										<Input {...attrs} bind:value={$formData.spouseFirstName} placeholder="First Name" />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseMiddleName" class="grid gap-3 sm:col-span-2">
									<Form.Control let:attrs>
										<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
										<Input {...attrs} bind:value={$formData.spouseMiddleName} placeholder="Middle Name" />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseLastName" class="grid gap-3 sm:col-span-2">
									<Form.Control let:attrs>
										<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
										<Input {...attrs} bind:value={$formData.spouseLastName} placeholder="Last Name" />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseNameSuffix" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
										<Input {...attrs} bind:value={$formData.spouseNameSuffix} placeholder="Suffix" />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>

							<Form.Field {form} name="spouseAddress" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Address</Form.Label>
									<Input {...attrs} bind:value={$formData.spouseAddress} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>

							<div class="grid items-start gap-3 sm:grid-cols-2">
								<Form.Field {form} name="spouseContactNumber" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Contact Number</Form.Label>
										<Input {...attrs} bind:value={$formData.spouseContactNumber} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseEmail" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Email</Form.Label>
										<Input {...attrs} bind:value={$formData.spouseEmail} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</Card.Content>
					</Card.Root>
				{/if}

				<!-- DETAINEE INFORMATION
				This is for detained clients only. -->

				{#if $formData.detained}
					<Card.Root>
						<Card.Header>
							<Card.Title>Detainee Information</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid items-start gap-3 sm:grid-cols-8">
								<Form.Field {form} name="detainedAt" class="grid gap-3 sm:col-span-8">
									<Form.Control let:attrs>
										<Form.Label>Place of Detention</Form.Label>
										<Input {...attrs} bind:value={$formData.detainedAt} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="detainedSince" class="grid gap-3 sm:col-span-4">
									<Form.Control let:attrs>
										<Form.Label>Detained Since</Form.Label>
										<DatePicker bind:value={$proxyDetainedSince} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="detainedUntil" class="grid gap-3 sm:col-span-4">
									<Form.Control let:attrs>
										<Form.Label>Detained Until</Form.Label>
										<DatePicker bind:value={$proxyDetainedUntil} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</Card.Content>
					</Card.Root>
				{/if}

				<!-- These are submit options that appear at the button of the page for user convenience. -->

				<div class="hidden items-center justify-center gap-2 md:flex">
					<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
					<Form.Button type="submit" size="sm">Submit</Form.Button>
				</div>
			</div>

			<!-- CLIENT CLASSIFICATION -->

			<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
				<Card.Root>
					<Form.Fieldset {form} name="classification" class="space-y-0">
						<Card.Header>
							<Card.Title>
								<Form.Legend>
									Client Classification <span class="font-bold text-destructive">*</span>
								</Form.Legend>
							</Card.Title>
							<Card.Description>
								<Form.Description>Please select all the apply.</Form.Description>
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								{#each classification as item}
									{@const checked = $formData.classification?.includes(item) ?? false}
									<div class="flex flex-row items-start space-x-3">
										<Form.Control let:attrs>
											<Checkbox
												{...attrs}
												{checked}
												onCheckedChange={(v) => {
													if (v) {
														$formData.classification = [...($formData.classification ?? []), item];
													} else {
														$formData.classification = $formData.classification?.filter(
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
					<Form.Fieldset {form} name="classification" class="space-y-0">
						<Card.Header>
							<Card.Title><Form.Legend>Other Classifications</Form.Legend></Card.Title>
							<Card.Description>
								<Form.Description>Please input all the apply.</Form.Description>
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<Form.Field {form} name="foreignNational" class="grid grid-cols-2 items-center">
								<Form.Control let:attrs>
									<Form.Label>Foreign National</Form.Label>
									<Input {...attrs} bind:value={$formData.foreignNational} />
								</Form.Control>
								<Form.FieldErrors class="col-span-2" />
							</Form.Field>
							<Form.Field {form} name="indigenousPeople" class="grid grid-cols-2 items-center">
								<Form.Control let:attrs>
									<Form.Label>Indigenous People</Form.Label>
									<Input {...attrs} bind:value={$formData.indigenousPeople} />
								</Form.Control>
								<Form.FieldErrors class="col-span-2" />
							</Form.Field>
							<Form.Field {form} name="lawEnforcer" class="grid grid-cols-2 items-center">
								<Form.Control let:attrs>
									<Form.Label>Law Enforcer</Form.Label>
									<Input {...attrs} bind:value={$formData.lawEnforcer} />
								</Form.Control>
								<Form.FieldErrors class="col-span-2" />
							</Form.Field>
							<Form.Field {form} name="urbanPoor" class="grid grid-cols-2 items-center">
								<Form.Control let:attrs>
									<Form.Label>Urban Poor</Form.Label>
									<Input {...attrs} bind:value={$formData.urbanPoor} />
								</Form.Control>
								<Form.FieldErrors class="col-span-2" />
							</Form.Field>
							<Form.Field {form} name="ruralPoor" class="grid grid-cols-2 items-center">
								<Form.Control let:attrs>
									<Form.Label>Rural Poor</Form.Label>
									<Input {...attrs} bind:value={$formData.ruralPoor} />
								</Form.Control>
								<Form.FieldErrors class="col-span-2" />
							</Form.Field>
							<Separator class="my-4" />
							<Form.Field {form} name="pwd" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Person with Disability</Form.Label>
									<Combobox.Root
										items={filteredPWD}
										bind:inputValue={$formData.pwd}
										bind:touchedInput={touchedPWD}
									>
										<div class="relative">
											<Combobox.Input
												class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
												placeholder="Please type disability or select from options."
											/>
											<CaretSort class="absolute end-3 top-2.5 ml-2 h-4 w-4 shrink-0 opacity-50" />
										</div>

										<Combobox.Content
											class="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none"
											transition={flyAndScale}
											sideOffset={8}
										>
											{#each filteredPWD as value}
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
										<Combobox.HiddenInput name="pwd" />
									</Combobox.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</Card.Content>
					</Form.Fieldset>
				</Card.Root>
			</div>
		</div>

		<!-- These are submit options that appear at the button of the page for user convenience. -->

		<div class="flex items-center justify-center gap-2 md:hidden">
			<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
			<Form.Button type="submit" size="sm">Submit</Form.Button>
		</div>
	</div>
</form>
