<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		civilStatus,
		classification,
		educationalAttainment,
		formSchema,
		sex,
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

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, delayed } = form;

	const proxyAge = intProxy(form, 'age', { initiallyEmptyIfZero: true });
	// const proxyDateOfBirth = dateProxy(form, 'dateOfBirth', {
	// 	format: 'date',
	// 	empty: 'undefined'
	// });
	const proxyDetainedSince = dateProxy(form, 'detainedSince', {
		format: 'date',
		empty: 'undefined'
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
	}${$formData.nameSuffix ? ', ' + $formData.nameSuffix : ''}`;

	$: $formData.spouseName =
		$formData.civilStatus === 'Married' && $formData.spouseFirstName && $formData.spouseLastName
			? `${$formData.spouseFirstName}${
					$formData.spouseMiddleName ? ' ' + $formData.spouseMiddleName : ''
				} ${$formData.spouseLastName}${$formData.spouseNameSuffix ? ', ' + $formData.spouseNameSuffix : ''}`
			: undefined;

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
				<Form.Button type="reset" variant="outline" size="sm">Ikkaten Amin</Form.Button>
				<Form.Button type="submit" size="sm">Idatag</Form.Button>
			</div>
		</div>
		<div class="flex gap-4">
			<div class="grid auto-rows-max items-start gap-4">
				<Card.Root>
					<Card.Header>
						<Card.Title>Personal Information</Card.Title>
						<Card.Description
							>Pangngaasiyo nga punnuen amin a kasapulan nga impormasion.</Card.Description
						>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<div class="grid items-start gap-3 sm:grid-cols-7">
							<Form.Field {form} name="firstName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label>Nagan</Form.Label>
									<Input {...attrs} bind:value={$formData.firstName} placeholder="Nagan" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="middleName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
									<Input
										{...attrs}
										bind:value={$formData.middleName}
										placeholder="Tengngang Apelyido"
									/>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="lastName" class="grid gap-3 sm:col-span-2">
								<Form.Control let:attrs>
									<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
									<Input {...attrs} bind:value={$formData.lastName} placeholder="Apelyido" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="nameSuffix" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
									<Input {...attrs} bind:value={$formData.nameSuffix} placeholder="Suffix" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid items-start gap-3 sm:grid-cols-3">
							<Form.Field {form} name="age" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Edad</Form.Label>
									<Input {...attrs} bind:value={$proxyAge} type="number" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="sex" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Kasarian</Form.Label>
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
									<Form.Label>Estado Sibil</Form.Label>
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
						<div class="grid items-start gap-3 sm:grid-cols-3">
							<Form.Field {form} name="citizenship" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Pannakipag-ili</Form.Label>
									<Input {...attrs} bind:value={$formData.citizenship} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="language" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Pagsasao</Form.Label>
									<Input {...attrs} bind:value={$formData.language} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="religion" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Relihiyon</Form.Label>
									<Input {...attrs} bind:value={$formData.religion} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="educationalAttainment" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Adal nga Naturpos</Form.Label>
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
									<Form.Label>Monthly Net Income</Form.Label>
									<span class="flex items-center gap-2">
										₱<Input {...attrs} bind:value={$formData.individualMonthlyIncome} /></span
									>
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
									<Form.Label>Nakabalud</Form.Label>
									<Form.Description>Checkan no nakabalud.</Form.Description>
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
									<Form.Label>Pagnaedan</Form.Label>
									<Input {...attrs} bind:value={$formData.address} placeholder="Address" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="contactNumber" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Telepono</Form.Label>
									<Input {...attrs} bind:value={$formData.contactNumber} />
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
				{#if $formData.civilStatus === 'Married' || $formData.civilStatus === 'Widowed'}
					<Card.Root>
						<Card.Header>
							<Card.Title>Spouse Information</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid items-start gap-3 sm:grid-cols-7">
								<Form.Field {form} name="spouseFirstName" class="grid gap-3 sm:col-span-2">
									<Form.Control let:attrs>
										<Form.Label>Nagan ti Asawa</Form.Label>
										<Input {...attrs} bind:value={$formData.spouseFirstName} placeholder="Nagan" />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseMiddleName" class="grid gap-3 sm:col-span-2">
									<Form.Control let:attrs>
										<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.spouseMiddleName}
											placeholder="Tengngang Apelyido"
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
											placeholder="Apelyido"
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
											placeholder="Suffix"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
							<Form.Field {form} name="spouseAddress" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Pagnaedan ti Asawa</Form.Label>
									<Input
										{...attrs}
										bind:value={$formData.spouseAddress}
										placeholder="Spouse's Address"
									/>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<div class="grid items-start gap-3 sm:grid-cols-2">
								<Form.Field {form} name="spouseContactNumber" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Telepono ti Asawa</Form.Label>
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
										<Form.Label>Lugar ti Nakaibaludan</Form.Label>
										<Input {...attrs} bind:value={$formData.detainedAt} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="detainedSince" class="grid gap-3 sm:col-span-3">
									<Form.Control let:attrs>
										<Form.Label>Naibalud idi pay</Form.Label>
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
			<Form.Button type="reset" variant="outline" size="sm">Ikkaten Amin</Form.Button>
			<Form.Button type="submit" size="sm">Idatag</Form.Button>
		</div>
	</div>
</form>
