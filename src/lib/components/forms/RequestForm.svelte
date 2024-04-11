<script lang="ts">
	import { page } from '$app/stores';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		districtProvince,
		nature,
		typeOfAssistance,
		typeOfRelease,
		formSchema,
		type FormSchema
	} from '$lib/schema/request';
	import {
		type SuperValidated,
		type Infer,
		superForm,
		dateProxy,
		intProxy
	} from 'sveltekit-superforms';

	import { ChevronLeft, PlusCircled, Trash } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';

	import DatePicker from '$lib/components/DatePicker.svelte';
	import { FieldErrors } from 'formsnap';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	const proxyDate = dateProxy(form, 'date', {
		format: 'date',
		empty: 'undefined'
	});

	$: selectedLawyer = {
		label: $page.data.lawyers.find((lawyer: any) => lawyer._id === $formData.lawyer_id)?.name ?? '',
		value: $formData.lawyer_id
	};
	$: selectDistrictProvince = {
		label: $formData.districtProvince,
		value: $formData.districtProvince
	};
	$: selectTypeOfAssistance = {
		label: $formData.typeOfAssistance,
		value: $formData.typeOfAssistance
	};
	$: selectTypeOfRelease = {
		label: $formData.typeOfRelease,
		value: $formData.typeOfRelease
	};

	function removeClientByIndex(index: number) {
		$formData.client_id = $formData.client_id.filter((_, i) => i !== index);
	}

	function addClient() {
		$formData.client_id = [...$formData.client_id, ''];
	}

	function removeNatureByIndex(index: number) {
		$formData.otherNature = $formData.otherNature.filter((_, i) => i !== index);
	}

	function addNature() {
		$formData.otherNature = [...$formData.otherNature, ''];
	}
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	<div class="mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				{!$formData._id ? 'Add Request' : 'Update Request'}
			</h1>
			<!-- <Badge class="ml-auto sm:ml-0">In stock</Badge> -->
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm"
					>{!$formData._id ? 'Add Request' : 'Update Request'}</Form.Button
				>
			</div>
		</div>
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-5 lg:gap-8">
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Request Information</Card.Title>
						<Card.Description>Please fill out all necessary information.</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<div class="grid grid-cols-3 items-start gap-3">
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
										disabled
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
						</div>
						<Form.Field {form} name="client_id" class="grid gap-3">
							<Form.Control let:attrs>
								<Form.Label>Client</Form.Label>
								{#each $formData.client_id as _, i}
									<div class="flex gap-2">
										<Select.Root
											selected={selectedLawyer}
											onSelectedChange={(s) => {
												s && ($formData.lawyer_id = s.value);
											}}
										>
											<Select.Input name="client[{i}]" />
											<Select.Trigger {...attrs}>
												<Select.Value placeholder="" />
											</Select.Trigger>
											<Select.Content>
												{#each $page.data.clients as client}
													<Select.Item bind:value={$formData.client_id[i]}
														>{client.name}</Select.Item
													>
												{/each}
											</Select.Content>
										</Select.Root>
										<Button
											variant="destructive"
											class="gap-2"
											on:click={() => removeClientByIndex(i)}
										>
											<Trash class="h-3.5 w-3.5" />
										</Button>
									</div>
								{/each}
							</Form.Control>
							<Button variant="outline" class="gap-2" on:click={addClient}>
								<PlusCircled class="h-3.5 w-3.5" />
								<span>Add Client</span>
							</Button>
							<Form.FieldErrors />
						</Form.Field>
						<Separator />
						<Form.Field {form} name="lawyer_id" class="grid gap-3">
							<Form.Control let:attrs>
								<Form.Label>Lawyer</Form.Label>
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
				{#if $formData.nature.includes('Inquest Legal Assistance') || $formData.nature.includes('Jail Visitation Release')}
					<Card.Root>
						<Card.Header>
							<Card.Title>Additonal Information</Card.Title>
						</Card.Header>
						<Card.Content class="grid auto-rows-max items-start gap-3">
							{#if $formData.nature.includes('Inquest Legal Assistance')}
								<Form.Field {form} name="typeOfAssistance" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Type of Inquest Legal Assistance</Form.Label>
										<Select.Root
											selected={selectTypeOfAssistance}
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
								</Form.Field>
							{/if}
							{#if $formData.nature.includes('Jail Visitation Release')}
								<Form.Field {form} name="typeOfRelease" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Type of Jail Visitation Release</Form.Label>
										<Select.Root
											selected={selectTypeOfRelease}
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
						</Card.Content>
					</Card.Root>
				{/if}
			</div>
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
				<Card.Root>
					<Form.Fieldset {form} name="nature" class="space-y-0">
						<Card.Header>
							<Card.Title><Form.Legend>Nature of Request</Form.Legend></Card.Title>
							<Card.Description
								><Form.Description>Please select all the apply.</Form.Description></Card.Description
							>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								{#each nature as item}
									{@const checked = $formData.nature?.includes(item) ?? false}
									<div class="flex flex-row items-start space-x-3">
										<Form.Control let:attrs
											><Checkbox
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
							{#if $formData.nature.includes('Others')}
								<Separator class="my-4" />
								<Form.Field {form} name="otherNature" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Others</Form.Label>
										{#each $formData.otherNature as _, i}
											<div class="flex gap-2">
												<Input {...attrs} />
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
			</div>
			<div class="flex items-center justify-center gap-2 md:hidden">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Add Request</Form.Button>
			</div>
		</div>
	</div>
</form>
