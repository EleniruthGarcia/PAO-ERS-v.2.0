<script lang="ts">
	import { page } from '$app/stores';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, sex, role, rank, type FormSchema } from '$lib/schema/user';
	import { type SuperValidated, type Infer, superForm, dateProxy } from 'sveltekit-superforms';
	import type { Branch } from '$lib/server/database';

	import { ChevronLeft } from 'svelte-radix';

	import Loading from '$lib/components/Loading.svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	import DatePicker from '$lib/components/DatePicker.svelte';
	import { toast } from 'svelte-sonner';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, delayed, errors, message } = form;

	$: $errors._errors && $errors._errors.map((error) => toast.error(error));
	$: $message && toast.success($message);

	const proxyDateOfBirth = dateProxy(form, 'dateOfBirth', {
		format: 'date',
		empty: 'undefined'
	});

	$: $formData.name = `${$formData.firstName}${$formData.middleName ? ' ' + $formData.middleName : ''} ${
		$formData.lastName
	}${$formData.nameSuffix ? ', ' + $formData.nameSuffix : ''}`;

	$: selectedSex = {
		label: $formData.sex,
		value: $formData.sex
	};

	$: selectedRole = {
		label: $formData.role,
		value: $formData.role
	};

	$: selectedRank = {
		label: $formData.rank,
		value: $formData.rank
	};

	$: selectedBranch = {
		label: $page.data.branches.find((branch: Branch) => branch._id === $formData.branch_id)?.name,
		value: $formData.branch_id
	};

	$: $formData.hashedPassword =
		'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4';
</script>

<form class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" use:enhance method="POST">
	{#if $delayed}<Loading />{/if}
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
				{$formData.currentStatus === 'New' ? 'Add User' : 'Update User'}
			</h1>
			<!-- <Badge class="ml-auto sm:ml-0">In stock</Badge> -->
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
				<Form.Button type="submit" size="sm">
					{$formData.currentStatus === 'New' ? 'Add User' : 'Update User'}
				</Form.Button>
			</div>
		</div>
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-5 lg:gap-8">
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Account Information</Card.Title>
						<Card.Description>Please fill out all necessary information.</Card.Description>
					</Card.Header>
					<Card.Content class="grid auto-rows-max items-start gap-3">
						<div class="grid grid-cols-4 items-start gap-3">
							<Form.Field {form} name="username" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Username</Form.Label>
									<Input {...attrs} bind:value={$formData.username} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="role" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Role</Form.Label>
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
											{#each role as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid grid-cols-4 items-start gap-3">
							<Form.Field {form} name="password" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Password</Form.Label>
									<Input {...attrs} type="password" bind:value={$formData.password} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="confirmPassword" class="col-span-2 grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Confirm Password</Form.Label>
									<Input {...attrs} type="password" bind:value={$formData.confirmPassword} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</Card.Content>
				</Card.Root>
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
							<Form.Field {form} name="rank" class="grid gap-3">
								<Form.Control let:attrs>
									<Form.Label>Rank</Form.Label>
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
										<Select.Content>
											{#each rank as value}
												<Select.Item {value} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
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
						</div>
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
			</div>
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
				<Card.Root>
					<Card.Header>
						<Card.Title>Branch Information</Card.Title>
						<Card.Description>Please select all the apply.</Card.Description>
					</Card.Header>
					<Card.Content>
						<Form.Field {form} name="branch_id" class="grid gap-3">
							<Form.Control let:attrs>
								<Form.Label>Branch</Form.Label>
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
			</div>
		</div>
		<div class="flex items-center justify-center gap-2 md:hidden">
			<Form.Button type="reset" variant="outline" size="sm">Reset</Form.Button>
			<Form.Button type="submit" size="sm"
				>{$formData.currentStatus === 'New' ? 'Add User' : 'Update User'}</Form.Button
			>
		</div>
	</div>
</form>
