<script lang="ts">
	import { page } from '$app/stores';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		nature,
		typeOfAssistance,
		typeOfRelease,
		formSchema,
		type FormSchema,
		relationshipToClient,
		typeOfService,
		natureOfInstrument
	} from '$lib/schema/service';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import { ChevronLeft, PlusCircled, Trash } from 'svelte-radix';

	import Loading from '$lib/components/Loading.svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, delayed } = form;

	// const proxyDate = dateProxy(form, 'date', {
	// 	format: 'date',
	// 	empty: 'undefined'
	// });

	let selectedClient: { label: string; value: string }[] = [];
	$: $formData.client_id.forEach((_, i) => {
		selectedClient[i] = {
			label:
				$page.data.clients.find((client: any) => client._id === $formData.client_id[i])?.name ?? '',
			value: $formData.client_id[i]
		};
	});

	let selectedNatureOfInstrument: { label: string; value: string }[] = [];
	$: $formData.natureOfInstrument?.forEach((_, i) => {
		selectedNatureOfInstrument[i] = {
			label: natureOfInstrument.find((n) => n === $formData.natureOfInstrument[i]) ?? '',
			value: $formData.natureOfInstrument[i]
		};
	});

	$: $formData.title =
		[...$formData.nature, ...($formData.otherNature ?? [])].length > 0
			? [...$formData.nature, ...($formData.otherNature ?? [])].join(', ') +
				' - ' +
				(function (x) {
					switch (x.length) {
						case 0:
							return 'No client selected.';
						case 1:
							return x[0].name;
						case 2:
							return x.map((c) => c.lastName).join(' and ');
						default:
							return x[0].lastName + ', et al.';
					}
				})($formData.client_id.map((id) => $page.data.clients.find((c) => c._id === id)))
			: undefined;

	$: selectedLawyer = {
		label: $page.data.lawyers.find((lawyer: any) => lawyer._id === $formData.lawyer_id)?.name ?? '',
		value: $formData.lawyer_id
	};

	$: selectedInterviewee = {
		label:
			$page.data.clients.find((client: any) => client._id === $formData.interviewee_id)?.name ?? '',
		value: $formData.interviewee_id
	};

	$: selectedRelationshipToClient = {
		label: $formData.relationshipToClient,
		value: $formData.relationshipToClient
	};

	// $: selectDistrictProvince = {
	// 	label: $formData.districtProvince,
	// 	value: $formData.districtProvince
	// };

	$: selectedTypeOfAssistance = $formData.typeOfAssistance
		? {
				label: $formData.typeOfAssistance,
				value: $formData.typeOfAssistance
			}
		: undefined;

	$: selectedTypeOfRelease = $formData.typeOfRelease
		? {
				label: $formData.typeOfRelease,
				value: $formData.typeOfRelease
			}
		: undefined;

	function removeClientByIndex(index: number) {
		$formData.client_id = $formData.client_id.filter((_, i) => i !== index);
	}

	function addClient() {
		$formData.client_id = [...$formData.client_id, ''];
	}

	function addInstrument() {
		$formData.natureOfInstrument = [...$formData.natureOfInstrument, ''];
	}

	function removeInstrumentByIndex(index: number) {
		$formData.natureOfInstrument = $formData.natureOfInstrument?.filter((_, i) => i !== index);
	}

	function removeNatureByIndex(index: number) {
		$formData.otherNature = $formData.otherNature?.filter((_, i) => i !== index);
	}

	function addNature() {
		$formData.otherNature = [...($formData.otherNature ?? []), ''];
	}
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	{#if $delayed}<Loading />{/if}
	<input type="hidden" name="_id" bind:value={$formData._id} />
	<input type="hidden" name="title" bind:value={$formData.title} />
	<div class="mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				{$formData.currentStatus === 'New' ? 'Add Service' : 'Update Service'}
			</h1>
			<!-- <Badge class="ml-auto sm:ml-0">In stock</Badge> -->
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Submit</Form.Button>
			</div>
		</div>
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-5 lg:gap-8">
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
				<Card.Root>
					<Form.Fieldset {form} name="nature" class="space-y-0">
						<Card.Header>
							<Card.Title>
								<Form.Legend>
									Nature of Service <span class="font-bold text-destructive">*</span>
								</Form.Legend>
							</Card.Title>
							<Card.Description>
								<Form.Description>Please select all the apply.</Form.Description>
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								{#each nature as item}
									{@const checked = $formData.nature?.includes(item) ?? false}
									<div class="flex flex-row items-start space-x-3">
										<Form.Control let:attrs>
											<Checkbox
												{...attrs}
												{checked}
												onCheckedChange={(v) => {
													if (v) {
														$formData.nature = [...($formData.nature ?? []), item];
													} else {
														$formData.nature = $formData.nature?.filter((v) => v !== item);
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
							{#if $formData.nature.includes('Others')}
								<Separator class="my-4" />
								<Form.Field {form} name="otherNature" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Others</Form.Label>
										{#each $formData.otherNature ?? [] as _, i}
											<div class="flex gap-2">
												<Input
													{...attrs}
													name="otherNature[{i}]"
													bind:value={$formData.otherNature[i]}
												/>
												<Button
													variant="destructive"
													class="gap-2"
													on:click={() => removeNatureByIndex(i)}
												>
													<Trash class="h-3.5 w-3.5" />
												</Button>
											</div>
										{/each}
									</Form.Control>
									<Button variant="outline" class="gap-2" on:click={addNature}>
										<PlusCircled class="h-3.5 w-3.5" />
										<span>Add Nature</span>
									</Button>
									<Form.FieldErrors />
								</Form.Field>
							{/if}
						</Card.Content>
					</Form.Fieldset>
				</Card.Root>
				<Card.Root>
					<Form.Fieldset {form} name="typeOfService" class="space-y-0">
						<Card.Header>
							<Card.Title>
								<Form.Legend>
									Type of Service <span class="font-bold text-destructive">*</span>
								</Form.Legend>
							</Card.Title>
							<!-- <Card.Description>
								<Form.Description>Please select all the apply.</Form.Description>
							</Card.Description> -->
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								<RadioGroup.Root bind:value={$formData.typeOfService}>
									{#each typeOfService as item}
										<div class="flex flex-row items-start space-x-3">
											<Form.Control let:attrs>
												<RadioGroup.Item {...attrs} value={item} />
												<Form.Label class="text-sm font-normal">
													{item}
												</Form.Label>
											</Form.Control>
										</div>
									{/each}
									<RadioGroup.Input name="typeOfService" />
								</RadioGroup.Root>
								<Form.FieldErrors />
							</div>
						</Card.Content>
					</Form.Fieldset>
				</Card.Root>
			</div>
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
				{#if $formData.nature.includes('Barangay Outreach')}
					Barangay Outreach!
				{/if}
				{#if $formData.nature.includes('Home Visitation')}
					Home Visitation!
				{/if}
				{#if $formData.nature.includes('Jail Visitation Release')}
					Jail Visitation Release!
				{/if}
				{#if $formData.nature.includes('Administration of Oath') || $formData.nature.includes('Inquest Legal Assistance') || $formData.nature.includes('Legal Advice') || $formData.nature.includes('Legal Documentation') || $formData.nature.includes('Mediation or Conciliation') || $formData.nature.includes('Representation in Court or Quasi-Judicial Bodies') || $formData.nature.includes('Others')}
					<Card.Root>
						<Card.Header>
							<Card.Title>Service Information</Card.Title>
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
							<!-- <div class="grid grid-cols-3 items-start gap-3">
							<Form.Field {form} name="districtProvince" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>District Office</Form.Label>
									<Select.Root
										selected={selectDistrictProvince}
										onSelectedChange={(s) => {
											s && ($formData.districtProvince = s.value);
										}}
									>
										<Select.Input disabled name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each districtProvince as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="_id" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Control Number</Form.Label>
									<Input
										{...attrs}
										name={attrs.name}
										bind:value={$formData._id}
										placeholder="Control Number"
									/>
								</Form.Control>
							</Form.Field>
							<Form.Field {form} name="date" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Date</Form.Label>
									<DatePicker bind:value={$proxyDate} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div> -->
							<Form.Field {form} name="title" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Title</Form.Label>
									<Input {...attrs} name={attrs.name} bind:value={$formData.title} />
								</Form.Control>
							</Form.Field>
							<Form.Fieldset {form} name="client_id" class="grid gap-3">
								<Form.Legend>
									Client <span class="font-bold text-destructive">*</span>
								</Form.Legend>
								{#each $formData.client_id as _, i}
									<Form.ElementField {form} name="client_id[{i}]">
										<Form.Control let:attrs>
											<div class="flex gap-2">
												<Select.Root
													selected={selectedClient[i]}
													onSelectedChange={(s) => {
														s && ($formData.client_id[i] = s.value);
													}}
												>
													<Select.Input name="client_id[{i}]" bind:value={$formData.client_id[i]} />
													<Select.Trigger {...attrs}>
														<Select.Value placeholder="" />
													</Select.Trigger>
													{#if $page.data.clients.filter((c) => !$formData.client_id.includes(c._id)).length > 0}
														<Select.Content>
															{#each $page.data.clients.filter((c) => !$formData.client_id.includes(c._id)) as client}
																<Select.Item bind:value={client._id}>{client.name}</Select.Item>
															{/each}
														</Select.Content>
													{/if}
												</Select.Root>
												<Button
													variant="destructive"
													class="gap-2"
													on:click={() => removeClientByIndex(i)}
												>
													<Trash class="h-3.5 w-3.5" />
												</Button>
											</div>
										</Form.Control>
									</Form.ElementField>
								{/each}
								{#if $page.data.clients.length > $formData.client_id.length}
									<Button variant="outline" class="gap-2" on:click={addClient}>
										<PlusCircled class="h-3.5 w-3.5" />
										<span>Add Client</span>
									</Button>
								{/if}
								<Form.FieldErrors />
							</Form.Fieldset>
							<Separator class="my-4" />
							<div class="grid items-start gap-3 sm:grid-cols-8">
								<Form.Field {form} name="interviewee_id" class="grid gap-3 sm:col-span-5">
									<Form.Control let:attrs>
										<Form.Label>
											Interviewee <span class="font-bold text-destructive">*</span>
										</Form.Label>
										<Select.Root
											selected={selectedInterviewee}
											onSelectedChange={(s) => {
												s && ($formData.interviewee_id = s.value);
											}}
										>
											<Select.Input name={attrs.name} />
											<Select.Trigger {...attrs}>
												<Select.Value placeholder="" />
											</Select.Trigger>
											<Select.Content>
												{#each $page.data.clients as client}
													<Select.Item bind:value={client._id}>{client.name}</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="relationshipToClient" class="grid gap-3 sm:col-span-3">
									<Form.Control let:attrs>
										<Form.Label>
											Relation to Client <span class="font-bold text-destructive">*</span>
										</Form.Label>
										<Select.Root
											selected={selectedRelationshipToClient}
											onSelectedChange={(s) => {
												s && ($formData.relationshipToClient = s.value);
											}}
										>
											<Select.Input name={attrs.name} />
											<Select.Trigger {...attrs}>
												<Select.Value placeholder="" />
											</Select.Trigger>
											<Select.Content>
												{#each relationshipToClient as value}
													<Select.Item {value} />
												{/each}
											</Select.Content>
										</Select.Root>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
							<Separator />
							<Form.Field {form} name="lawyer_id" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Lawyer <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Select.Root
										selected={selectedLawyer}
										onSelectedChange={(s) => {
											s && ($formData.lawyer_id = s.value);
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
					{#if $formData.nature.includes('Administration of Oath')}
						<Card.Root>
							<Card.Header>
								<Card.Title>Administration of Oath</Card.Title>
								<Card.Description>
									Please provide additional information regarding the administration of oath.
								</Card.Description>
							</Card.Header>
							<Card.Content class="grid auto-rows-max items-start gap-3">
								<Form.Fieldset {form} name="natureOfInstrument" class="grid gap-3">
									<Form.Legend>Nature of Instrument</Form.Legend>
									{#each $formData.natureOfInstrument as _, i}
										<Form.ElementField {form} name="natureOfInstrument[{i}]">
											<Form.Control let:attrs>
												<div class="flex gap-2">
													<Select.Root
														selected={selectedNatureOfInstrument[i]}
														onSelectedChange={(s) => {
															s && ($formData.natureOfInstrument[i] = s.value);
														}}
													>
														<Select.Input
															name="natureOfInstrument[{i}]"
															bind:value={$formData.natureOfInstrument[i]}
														/>
														<Select.Trigger {...attrs}>
															<Select.Value placeholder="" />
														</Select.Trigger>
														<Select.Content class="max-h-[200px] overflow-y-auto">
															{#each natureOfInstrument.filter((n) => !$formData.natureOfInstrument.includes(n)) as nature}
																<Select.Item bind:value={nature}>{nature}</Select.Item>
															{/each}
														</Select.Content>
													</Select.Root>
													<Button
														variant="destructive"
														class="gap-2"
														on:click={() => removeInstrumentByIndex(i)}
													>
														<Trash class="h-3.5 w-3.5" />
													</Button>
												</div>
											</Form.Control>
										</Form.ElementField>
									{/each}
									{#if natureOfInstrument.length > $formData.natureOfInstrument.length}
										<Button variant="outline" class="gap-2" on:click={addInstrument}>
											<PlusCircled class="h-3.5 w-3.5" />
											<span>Add Nature of Instrument</span>
										</Button>
									{/if}
									<Form.FieldErrors />
								</Form.Fieldset>
								<Form.Field {form} name="witness" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Witness</Form.Label>
										<Input
											{...attrs}
											bind:value={$formData.witness}
											placeholder="Please type all witnesses, separated by commas."
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</Card.Content>
						</Card.Root>
					{/if}
					{#if $formData.nature.includes('Inquest Legal Assistance') || $formData.nature.includes('Jail Visitation Release')}
						<Card.Root>
							<Card.Header>
								<Card.Title>Additonal Information</Card.Title>
								<Card.Description>Please fill out all additional information.</Card.Description>
							</Card.Header>
							<Card.Content class="grid auto-rows-max items-start gap-3">
								{#if $formData.nature.includes('Jail Visitation Release')}
									<Form.Field {form} name="typeOfRelease" class="grid gap-3">
										<Form.Control let:attrs>
											<Form.Label>Type of Jail Visitation Release</Form.Label>
											<Select.Root
												selected={selectedTypeOfRelease}
												onSelectedChange={(s) => {
													s && ($formData.typeOfRelease = s.value);
												}}
											>
												<Select.Input name={attrs.name} />
												<Select.Trigger {...attrs}>
													<Select.Value placeholder="" />
												</Select.Trigger>
												<Select.Content>
													{#each typeOfRelease as value}
														<Select.Item {value} />
													{/each}
												</Select.Content>
											</Select.Root>
										</Form.Control>
										<Form.FieldErrors />
									</Form.Field>
								{/if}
								{#if $formData.nature.includes('Inquest Legal Assistance')}
									<Form.Field {form} name="typeOfAssistance" class="grid gap-3">
										<Form.Control let:attrs>
											<Form.Label>Type of Inquest Legal Assistance</Form.Label>
											<Select.Root
												selected={selectedTypeOfAssistance}
												onSelectedChange={(s) => {
													s && ($formData.typeOfAssistance = s.value);
												}}
											>
												<Select.Input name={attrs.name} />
												<Select.Trigger {...attrs}>
													<Select.Value placeholder="" />
												</Select.Trigger>
												<Select.Content>
													{#each typeOfAssistance as value}
														<Select.Item {value} />
													{/each}
												</Select.Content>
											</Select.Root>
										</Form.Control>
										<Form.FieldErrors />
										<Form.Field
											{form}
											name="duringOffice"
											class="flex w-fit flex-row items-center space-x-3 space-y-0 rounded-md border p-4"
										>
											<Form.Control let:attrs>
												<Checkbox {...attrs} bind:checked={$formData.duringOffice} />
												<div class="h-10 space-y-2 truncate leading-none">
													<Form.Label>Off-Hours Inquest</Form.Label>
													<Form.Description>
														Check if inquest was done outisde office hours.
													</Form.Description>
												</div>
												<input name={attrs.name} bind:value={$formData.duringOffice} hidden />
											</Form.Control>
											<Form.FieldErrors />
										</Form.Field>
									</Form.Field>
								{/if}
							</Card.Content>
						</Card.Root>
					{/if}
				{/if}
			</div>
			<div class="flex items-center justify-center gap-2 md:hidden">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Submit</Form.Button>
			</div>
		</div>
	</div>
</form>
