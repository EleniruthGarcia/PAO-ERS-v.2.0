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

	const proxyDateOfBirth = dateProxy(form, 'dateOfBirth', {
		format: 'date',
		empty: 'undefined'
	});
	const proxyDetainedSince = dateProxy(form, 'detainedSince', {
		format: 'date',
		empty: 'undefined'
	});

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
				{$formData.currentStatus === 'New' ? 'Add a New Client' : 'Update Client Information'}
			</h1>
			<!-- <Badge class="ml-auto sm:ml-0">In stock</Badge> -->
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm"
					>{$formData.currentStatus === 'New' ? 'Add Client' : 'Update Client'}</Form.Button
				>
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
						<div class="grid grid-cols-7 items-start gap-3">
							<Form.Field {form} name="firstName" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Name</Form.Label>
									<Input {...attrs} bind:value={$formData.firstName} placeholder="First Name" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="middleName" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>&nbsp;</Form.Label>
									<Input {...attrs} bind:value={$formData.middleName} placeholder="Middle Name" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="lastName" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>&nbsp;</Form.Label>
									<Input {...attrs} bind:value={$formData.lastName} placeholder="Last Name" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="nameSuffix" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>&nbsp;</Form.Label>
									<Input {...attrs} bind:value={$formData.nameSuffix} placeholder="Suffix" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid grid-cols-3 items-start gap-3">
							<Form.Field {form} name="dateOfBirth" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Date of Birth</Form.Label>
									<DatePicker bind:value={$proxyDateOfBirth} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="sex" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Sex</Form.Label>
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
									<Form.Label>Civil Status</Form.Label>
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
						<div class="grid grid-cols-3 items-start gap-3">
							<Form.Field {form} name="citizenship" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Citizenship</Form.Label>
									<Input {...attrs} bind:value={$formData.citizenship} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="language" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Language</Form.Label>
									<Input {...attrs} bind:value={$formData.language} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="religion" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Religion</Form.Label>
									<Input {...attrs} bind:value={$formData.religion} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid grid-cols-2 items-start gap-3">
							<Form.Field {form} name="educationalAttainment" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Education</Form.Label>
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
									<Form.Label>Monthly Income</Form.Label>
									<Input {...attrs} bind:value={$formData.individualMonthlyIncome} type="number" />
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
						<div class="grid grid-cols-2 items-start gap-3">
							<Form.Field {form} name="address" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Address</Form.Label>
									<Input {...attrs} bind:value={$formData.address} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="contactNumber" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Contact Number</Form.Label>
									<Input {...attrs} bind:value={$formData.contactNumber} type="tel" />
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
				{#if $formData.civilStatus === 'Married'}
					<Card.Root>
						<Card.Header>
							<Card.Title>Spouse Information</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid grid-cols-7 items-start gap-3">
								<Form.Field {form} name="spouseFirstName" class="col-span-2 grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Name</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.spouseFirstName}
											placeholder="First Name"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseMiddleName" class="col-span-2 grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>&nbsp;</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.spouseMiddleName}
											placeholder="Middle Name"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseLastName" class="col-span-2 grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>&nbsp;</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.spouseLastName}
											placeholder="Last Name"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseNameSuffix" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>&nbsp;</Form.Label>
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
									<Form.Label>Address</Form.Label>
									<Input {...attrs} bind:value={$formData.spouseAddress} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<div class="grid grid-cols-2 items-start gap-3">
								<Form.Field {form} name="spouseEmail" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Email</Form.Label>
										<Input {...attrs} bind:value={$formData.spouseEmail} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="spouseContactNumber" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Contact Number</Form.Label>
										<Input {...attrs} bind:value={$formData.spouseContactNumber} type="tel" />
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
							<div class="grid grid-cols-8 items-start gap-3">
								<Form.Field {form} name="detainedAt" class="col-span-5 grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Place of Detention</Form.Label>
										<Input {...attrs} bind:value={$formData.detainedAt} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="detainedSince" class="col-span-3 grid gap-3">
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
		<div class="flex items-center justify-center gap-2 md:hidden">
			<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
			<Form.Button type="submit" size="sm">{$formData.currentStatus === 'New' ? 'Add Client' : 'Update Client'}</Form.Button>
		</div>
	</div>
</form>
