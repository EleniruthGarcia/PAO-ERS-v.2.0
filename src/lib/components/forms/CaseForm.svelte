<script lang="ts">
	import { page } from '$app/stores';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		formSchema,
		natureOfTheCase,
		type FormSchema,
		clientInvolvement,
		adversePartyInvolvement,
		status
	} from '$lib/schema/case';
	import { type SuperValidated, type Infer, superForm, stringProxy } from 'sveltekit-superforms';

	import { ChevronLeft, PlusCircled, Trash } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	import { Textarea } from '$lib/components/ui/textarea';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	$: selectedNatureOfTheCase = {
		label: $formData.natureOfTheCase,
		value: $formData.natureOfTheCase
	};
	$: selectedCurrentStatus = {
		label: $formData.currentStatus,
		value: $formData.currentStatus
	};
	$: newStatus = {
		type: selectedCurrentStatus.value,
		date: new Date()
	};
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	<input type="hidden" name="_id" bind:value={$formData._id} />
	<input type="hidden" name="status" bind:value={newStatus} />
	<div class="mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				{!$formData._id ? 'Add Case' : 'Update Case'}
			</h1>
			<!-- <Badge class="ml-auto sm:ml-0">In stock</Badge> -->
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm"
					>{!$formData._id ? 'Add Case' : 'Update Case'}</Form.Button
				>
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
						<div class="grid grid-cols-2 items-start gap-3">
							<Form.Field {form} name="natureOfTheCase" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Nature of the Case</Form.Label>
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
									<Form.Label>Case Specification</Form.Label>
									<Input
										{...attrs}
										bind:value={$formData.caseSpecs}
										placeholder="Case Specification"
									/>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
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
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Card.Title>Adverse Party's Information</Card.Title>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<div class="grid grid-cols-5 items-start gap-3">
							<Form.Field {form} name="adversePartyName" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Adverse Party Name</Form.Label>
									<Input {...attrs} bind:value={$formData.adversePartyName} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="adversePartyAddress" class="col-span-3 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Adverse Party Address</Form.Label>
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
							<div class="grid grid-cols-2 items-start gap-3">
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
						<Card.Description
							>Type the cause of action or the nature of offence here.</Card.Description
						>
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
			</div>
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Case Status</Card.Title>
						<Card.Description>Please fill out all necessary information.</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<div class="grid items-start gap-3">
							<Form.Field {form} name="currentStatus" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Case Status</Form.Label>
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
						</div>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Form.Fieldset {form} name="clientInvolvement" class="space-y-0">
						<Card.Header>
							<Card.Title><Form.Legend>Client's Case Involvement</Form.Legend></Card.Title>
							<Card.Description
								><Form.Description>Please select all the apply.</Form.Description></Card.Description
							>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								{#each clientInvolvement as item}
									{@const checked = $formData.clientInvolvement?.includes(item) ?? false}
									<div class="flex flex-row items-start space-x-3">
										<Form.Control let:attrs
											><Checkbox
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
				<Card.Root>
					<Form.Fieldset {form} name="adversePartyInvolvement" class="space-y-0">
						<Card.Header>
							<Card.Title><Form.Legend>Adverse Party's Case Involvement</Form.Legend></Card.Title>
							<Card.Description
								><Form.Description>Please select all the apply.</Form.Description></Card.Description
							>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								{#each adversePartyInvolvement as item}
									{@const checked = $formData.adversePartyInvolvement?.includes(item) ?? false}
									<div class="flex flex-row items-start space-x-3">
										<Form.Control let:attrs
											><Checkbox
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
			<div class="flex items-center justify-center gap-2 md:hidden">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Add Request</Form.Button>
			</div>
		</div>
	</div>
</form>
