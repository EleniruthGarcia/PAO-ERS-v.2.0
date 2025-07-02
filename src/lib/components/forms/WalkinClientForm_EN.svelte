<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando.AbortController .-->

<!-- Please refer to ClientForm.svelte for comments. It is the same form with non-client cards removed and in English. -->

<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		civilStatus,
		classification,
		educationalAttainment,
		formSchema,
		sex,
		languages,
		religion,
		citizenship,
		netMonthlyIncome,
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

	import { ChevronLeft } from 'svelte-radix';
	import Loading from '$lib/components/Loading.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import DatePicker from '$lib/components/DatePicker.svelte';

	import type { z } from 'zod';
	import { Field } from 'formsnap';
	type FormDataType = z.infer<typeof formSchema>;

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm<z.infer<typeof formSchema>>(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});
	const { form: rawFormData, enhance, delayed } = form;
	const formData = rawFormData as unknown as import('svelte/store').Writable<FormDataType>;

	const proxyAge = intProxy(form, 'age', { initiallyEmptyIfZero: true });
	const proxyDetainedSince = dateProxy(form, 'detainedSince', {
		format: 'date',
		empty: 'undefined'
	});

	let dropdownOpen = false;

	function toggleLanguage(lang: typeof languages[number], checked: boolean) {
		if (!$formData.languages) $formData.languages = [];
		if (checked) {
			if (!$formData.languages.includes(lang)) {
				$formData.languages = [...$formData.languages, lang];
			}
		} else {
			$formData.languages = $formData.languages.filter((l) => l !== lang);
		}
	}

	// Reactive selected dropdown values for display
	let selectedSex = { label: '', value: '' };
	let selectedcivilStatus = { label: '', value: '' };
	let selectedEducationalAttainment = { label: '', value: '' };
	let selectedReligion = { label: '', value: '' };
	let selectednetMonthlyIncome = { label: '', value: '' };
	let selectedcitizenship = { label: '', value: '' };

	$: if (!$formData.languages) $formData.languages = [];

	$: selectedsex = {
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

	$: selectedreligion = {
		label: $formData.religion,
		value: $formData.religion
	};

	$: selectedNetMonthlyIncome = {
		label: $formData.netMonthlyIncome,
		value: $formData.netMonthlyIncome
	};

	$: selectedcitizenship = {
		label: $formData.citizenship,
		value: $formData.citizenship
	};
	$: selectedSuffifx = {
		label: $formData.suffix,
		value: $formData.suffix
	};

	$: if ($formData.sex === 'FEMALE') {
		if (!$formData.classification?.includes('Woman Client')) {
			$formData.classification = [...($formData.classification ?? []), 'Woman Client'];
		}
	} else {
		if ($formData.classification?.includes('Woman Client')) {
			$formData.classification = $formData.classification?.filter((v) => v !== 'Woman Client');
		}
	}

	$: if ($formData.age && $formData.age >= 60) {
		if (!$formData.classification?.includes('Senior Citizen')) {
			$formData.classification = [...($formData.classification ?? []), 'Senior Citizen'];
		}
	} else {
		if ($formData.classification?.includes('Senior Citizen')) {
			$formData.classification = $formData.classification?.filter((v) => v !== 'Senior Citizen');
		}
	}

	$: $formData.name = `${$formData.firstName}${$formData.middleName ? ' ' + $formData.middleName : ''} ${$formData.lastName}${$formData.suffix ? ', ' + $formData.suffix : ''}`;

	$: $formData.spouseName =
		$formData.civilStatus === 'MARRIED' &&
		$formData.spouseFirstName &&
		$formData.spouseLastName
			? `${$formData.spouseFirstName}${$formData.spouseMiddleName ? ' ' + $formData.spouseMiddleName : ''} ${$formData.spouseLastName}${$formData.spouseNameSuffix ? ', ' + $formData.spouseNameSuffix : ''}`
			: undefined;
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	{#if $delayed}<Loading />{/if}
	<input type="hidden" name="_id" bind:value={$formData._id} />
	<input type="hidden" name="name" bind:value={$formData.name} />
	<div class="mx-auto grid max-w-[48rem] flex-1 auto-rows-max gap-4">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				{$formData.currentStatus === 'New' ? 'Add Client' : 'Update Client'}
			</h1>
			<!-- <Badge class="ml-auto sm:ml-0">In stock</Badge> -->
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Submit</Form.Button>
			</div>
		</div>
		<div class="flex gap-4">
			<div class="grid auto-rows-max items-start gap-4">
				<Card.Root>
					<Card.Header>
						<Card.Title>Personal Information</Card.Title>
						<Card.Description>Please fill out all necessary information.</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<div class="grid items-start gap-3 sm:grid-cols-7">
							<Form.Field {form} name="firstName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label>First Name</Form.Label>
									<Input
									{...attrs}
									bind:value={$formData.firstName}
									placeholder="FIRST NAME"
									class="uppercase"
									/>
									<Form.FieldErrors />
								</Form.Control>
							</Form.Field>
							
							<Form.Field {form} name="middleName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label>Middle Name</Form.Label>
									<Input
									{...attrs}
									bind:value={$formData.middleName}
									placeholder="MIDDLE NAME"
									class="uppercase"
									/>
									<Form.FieldErrors />
								</Form.Control>
							</Form.Field>
							<Form.Field {form} name="lastName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label>Last Name</Form.Label>
									<Input
									{...attrs}
									bind:value={$formData.lastName}
									placeholder="LAST NAME"
									class="uppercase"
									/>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="suffix" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Suffix</Form.Label>
									<Select.Root
										selected={selectedSuffifx}
										onSelectedChange={(s) => {
											s && ($formData.suffix = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each suffix as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							
							
						</div>
						<div class="grid items-start gap-3 sm:grid-cols-3">
							<Form.Field {form} name="age" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Age</Form.Label>
									<Input {...attrs} bind:value={$proxyAge} type="number" min=0/>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="sex" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Sex</Form.Label>
									<Select.Root
										selected={selectedsex}
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
									<Form.Label>Civil Status</Form.Label>
									<Select.Root
										selected={selectedcivilStatus}
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
						<div class="grid items-start gap-3 sm:grid-cols-3">
							<Form.Field {form} name="citizenship" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Citizenship</Form.Label>
									<Select.Root
										selected={selectedcitizenship}
										onSelectedChange={(s) => {
											s && ($formData.citizenship = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each citizenship as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field {form} name="languages" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Language (Check all that applies)</Form.Label>

									<div class="border rounded-lg p-4 space-y-2">
										{#each languages as lang}
											<label class="flex items-center gap-3 cursor-pointer">
												<input
													type="checkbox"
													class="appearance-none w-4 h-4 border border-gray-400 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
													checked={$formData.languages?.includes(lang)}
													on:change={(e) => toggleLanguage(lang, e.target.checked)}
													{...attrs}
													value={lang}
												/>
												<span class="text-sm">{lang}</span>
											</label>
										{/each}
									</div>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field {form} name="religion" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Religion</Form.Label>
									<Select.Root
										selected={selectedreligion}
										onSelectedChange={(s) => {
											s && ($formData.religion = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each religion as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="educationalAttainment" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Education</Form.Label>
									<Select.Root
										selected={selectedEducationalAttainment}
										onSelectedChange={(s) => {
											s && ($formData.EducationalAttainment = s.value);
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
							<Form.Field {form} name="netMonthlyIncome" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Net Monthly Income</Form.Label>
									<Select.Root
										selected={selectednetMonthlyIncome}
										onSelectedChange={(s) => {
											s && ($formData.netMonthlyIncome = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each netMonthlyIncome as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
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
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Card.Title>Contact Information</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="address" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label>Address</Form.Label>
									<div class="flex items-center gap-2">
										<Input {...attrs} bind:value={$formData.address} placeholder="ADDRESS" />
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
									<Input {...attrs} bind:value={$formData.contactNumber}/>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="email" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Email</Form.Label>
									<Input {...attrs} bind:value={$formData.email} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</Card.Content>
				</Card.Root>
				{#if $formData.civilStatus === 'MARRIED' || $formData.civilStatus === 'WIDOW/WIDOWER'}
					<Card.Root>
						<Card.Header>
							<Card.Title>Spouse Information</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid items-start gap-3 sm:grid-cols-7">
								<Form.Field {form} name="spouseFirstName" class="grid gap-3 sm:col-span-2">
									<Form.Control let:attrs>
										<Form.Label>Name</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.spouseFirstName}
											placeholder="FIRST NAME"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseMiddleName" class="grid gap-3 sm:col-span-2">
									<Form.Control let:attrs>
										<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.spouseMiddleName}
											placeholder="MIDDLE NAME"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseLastName" class="grid gap-3 sm:col-span-2">
									<Form.Control let:attrs>
										<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.spouseLastName}
											placeholder="LAST NAME"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseNameSuffix" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.spouseNameSuffix}
											placeholder="SUFFIX"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
							<Form.Field {form} name="spouseAddress" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Address</Form.Label>
									<Input 
									{...attrs} 
									bind:value={$formData.spouseAddress}
									placeholder="ADDRESS" />
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
				{#if $formData.detained}
					<Card.Root>
						<Card.Header>
							<Card.Title>Detainee Information</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid items-start gap-3 sm:grid-cols-8">
								<Form.Field {form} name="detainedAt" class="grid gap-3 sm:col-span-5">
									<Form.Control let:attrs>
										<Form.Label>Place of Detention</Form.Label>
										<Input {...attrs} bind:value={$formData.detainedAt} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="detainedSince" class="grid gap-3 sm:col-span-3">
									<Form.Control let:attrs>
										<Form.Label>Detained Since</Form.Label>
										<DatePicker bind:value={$proxyDetainedSince} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
			</div>
		</div>
		<div class="flex items-center justify-center gap-2">
			<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
			<Form.Button type="submit" size="sm">Submit</Form.Button>
		</div>
	</div>
</form>
