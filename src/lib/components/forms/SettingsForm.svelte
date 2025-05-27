<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary components and dependencies.

	import { page } from '$app/stores';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, role, rank, position, type FormSchema, type User } from '$lib/schema/user';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import type { Branch } from '$lib/server/database';
	import { ChevronLeft } from 'svelte-radix';
	import Loading from '$lib/components/Loading.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { toast } from 'svelte-sonner';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, delayed, errors, message } = form;

	$: $errors._errors && $errors._errors.map((error) => toast.error(error));
	$: $message && toast.success($message);

	$: $formData.name = `${$formData.firstName}${$formData.middleName ? ' ' + $formData.middleName : ''} ${
		$formData.lastName
	}${$formData.nameSuffix ? ', ' + $formData.nameSuffix : ''}`;

	$: selectedRole = {
		label: $formData.role,
		value: $formData.role
	};

	$: selectedRank = {
		label: $formData.rank,
		value: $formData.rank
	};

	$: selectedPosition = {
		label: $formData.position,
		value: $formData.position
	};

	$: selectedBranch = {
		label: $page.data.branches.find((branch: Branch) => branch._id === $formData.branch_id)?.name,
		value: $formData.branch_id
	};

	$: selectedReportsTo = {
		label: $page.data.users.find((user: User) => user._id === $formData.reportsTo)?.name,
		value: $formData.name
	};

	$: $formData.hashedPassword =
		$formData.hashedPassword ||
		'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4';

	$: filteredRoles =
		$page.data.user.role === 'Administrator' ? role : role.filter((r) => r !== 'Administrator');
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	{#if $delayed}
		<Loading />
	{/if}
	<!-- Show loading interface while data is loading. -->

	<!-- PAGE HEADER -->

	<input type="hidden" name="_id" bind:value={$formData._id} />
	<input type="hidden" name="name" bind:value={$formData.name} />
	<input type="hidden" name="hashedPassword" bind:value={$formData.hashedPassword} />
	<input type="hidden" name="currentStatus" bind:value={$formData.currentStatus} />
	<div class="mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				Settings
			</h1>
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">Submit</Form.Button>
			</div>
		</div>
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-5 lg:gap-8">
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
				<!-- MAIN ACCOUNT INFORMATION -->

				<Card.Root>
					<Card.Header>
						<Card.Title>Account Information</Card.Title>
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
						<div class="grid items-start gap-3 sm:grid-cols-2">
							<Form.Field {form} name="username" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Username <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Input {...attrs} bind:value={$formData.username} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="role" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Role <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Select.Root
										selected={selectedRole}
										onSelectedChange={(s) => {
											s && ($formData.role = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content>
											{#each filteredRoles as value}
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
							name="changePassword"
							class="flex w-fit flex-row items-center space-x-3 space-y-0 rounded-md border p-4"
						>
							<Form.Control let:attrs>
								<Checkbox {...attrs} bind:checked={$formData.changePassword} />
								<div class="h-10 space-y-2 truncate leading-none">
									<Form.Label>Change Password</Form.Label>
									<Form.Description>Check if you want to change your password.</Form.Description>
								</div>
								<input name={attrs.name} bind:value={$formData.changePassword} hidden />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
				</Card.Root>
				{#if $formData.changePassword}
					<Card.Root>
						<Card.Header>
							<Card.Title>Password Information</Card.Title>
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
							<div class="grid items-start gap-3 sm:grid-cols-2">
								<Form.Field {form} name="password" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Password</Form.Label>
										<Input {...attrs} type="password" bind:value={$formData.password} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="confirmPassword" class="grid gap-3">
									<Form.Control let:attrs>
										<Form.Label>Confirm Password</Form.Label>
										<Input {...attrs} type="password" bind:value={$formData.confirmPassword} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</Card.Content>
					</Card.Root>
				{:else}
					<input type="hidden" name="password" bind:value={$formData.password} />
					<input type="hidden" name="confirmPassword" bind:value={$formData.confirmPassword} />
				{/if}

				<!-- This client information will show up in the reports. -->

				<Card.Root>
					<Card.Header>
						<Card.Title>Personal Information</Card.Title>
						<Card.Description>Please fill out all necessary information.</Card.Description>
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
							<Form.Field {form} name="nameSuffix" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label class="hidden sm:block">&nbsp;</Form.Label>
									<Input {...attrs} bind:value={$formData.nameSuffix} placeholder="Suffix" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid items-start gap-3 sm:grid-cols-7">
							<Form.Field {form} name="position" class="col-span-5 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Position <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Select.Root
										selected={selectedPosition}
										onSelectedChange={(s) => {
											s && ($formData.position = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content class="max-h-[200px] overflow-y-auto">
											{#each position as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="rank" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>
										Rank <span class="font-bold text-destructive">*</span>
									</Form.Label>
									<Select.Root
										selected={selectedRank}
										onSelectedChange={(s) => {
											s && ($formData.rank = s.value);
										}}
									>
										<Select.Input name={attrs.name} />
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="" />
										</Select.Trigger>
										<Select.Content class="max-h-[200px] overflow-y-auto">
											{#each rank as value}
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
			</div>

			<!-- BRANCH INFORMATION -->

			<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Branch Information</Card.Title>
						<Card.Description>Please select all the apply.</Card.Description>
					</Card.Header>
					<Card.Content>
						<Form.Field {form} name="branch_id" class="grid gap-3">
							<Form.Control let:attrs>
								<Form.Label>
									Branch <span class="font-bold text-destructive">*</span>
								</Form.Label>
								<Select.Root
									selected={selectedBranch}
									onSelectedChange={(s) => {
										s && ($formData.branch_id = s.value);
									}}
								>
									<Select.Input name={attrs.name} />
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="" />
									</Select.Trigger>
									<Select.Content>
										{#each $page.data.branches as branch}
											<Select.Item value={branch._id}>{branch.name}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
				</Card.Root>

				<!-- HIERARCHY INFORMATION
				This is also necessary for the reports. -->

				<Card.Root>
					<Card.Header>
						<Card.Title>Hierarchy Information</Card.Title>
						<Card.Description>Please select all the apply.</Card.Description>
					</Card.Header>
					<Card.Content>
						<Form.Field {form} name="reportsTo" class="grid gap-3">
							<Form.Control let:attrs>
								<Form.Label>
									Reports To<!--  <span class="font-bold text-destructive">*</span> -->
								</Form.Label>
								<Select.Root
									selected={selectedReportsTo}
									onSelectedChange={(s) => {
										s && ($formData.reportsTo = s.value);
									}}
								>
									<Select.Input name={attrs.name} />
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="" />
									</Select.Trigger>
									<Select.Content>
										{#each $page.data.users as user}
											<Select.Item value={user._id}>{user.name}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
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
