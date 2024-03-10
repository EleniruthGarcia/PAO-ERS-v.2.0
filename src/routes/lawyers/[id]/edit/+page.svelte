<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	import Modal from '$lib/components/Modal.svelte';
	import Field from '$lib/components/Field.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Select from '$lib/components/Select.svelte';
	import Option from '$lib/components/Option.svelte';
	import Loading from '$lib/components/Loading.svelte';

	export let data: PageServerData;
	export let form: ActionData;

	let changePassword = false;
</script>

{#if form?.invalid}
	<Modal title="Invalid Input" message="Please ensure that all fields are filled properly." />
{/if}

{#if form?.missing}
	<Modal title="Form Incomplete" message="Please fill out all necessary information." />
{/if}

{#if form?.mismatch}
	<Modal title="Password Mismatch" message="Passwords do not match." />
{/if}

{#if form?.error}
	<Modal title="Form Error" message="An error occurred while submitting the form." />
{/if}

{#if form?.success}
	<Modal
		title="Edit Success!"
		message="The lawyer profile has been successfully edited."
		success={() => history.back()}
	/>
{/if}

<main
	class="h-screen w-screen p-12 lg:p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence lg:overflow-y-hidden leading-tight"
>
	{#await data.lawyer}
		<div><Loading /></div>
	{:then lawyer}
		{#if lawyer}
			<div>
				<p class="font-bold text-equity mb-2">
					Lawyer Profile<span class="p-1 px-2 bg-diligence text-oath rounded-lg ml-2"
						>Edit Mode</span
					>
				</p>
				<h3 class="font-bold">
					{lawyer.title +
						' ' +
						lawyer.firstName +
						' ' +
						lawyer.middleName +
						' ' +
						lawyer.lastName +
						(lawyer.nameSuffix ? ' ' + lawyer.nameSuffix : '')}
				</h3>
			</div>
			<form method="POST" use:enhance class="flex flex-col gap-4">
				<h4 class="font-bold">Account Information</h4>
				<div class="flex flex-wrap gap-4">
					<Field
						labelEng="Username"
						name="username"
						class="w-80 max-w-[420px]"
						required
						value={lawyer.user.username}
					/>
					<div class="flex gap-4 items-center">
						<Checkbox
							name="changePassword"
							labelEng="Change Password"
							bind:checked={changePassword}
							class=""
						/>
					</div>
					{#if changePassword}
						<Field labelEng="New Password" name="password" type="password" required />
						<Field labelEng="Confirm Password" name="confirmPassword" type="password" required />
					{/if}
				</div>

				<h4 class="font-bold">Lawyer Information</h4>
				<div class="inline-flex flex-wrap gap-4">
					<Field
						labelEng="First Name"
						labelFil="Unang Pangalan"
						name="firstName"
						required
						autocomplete="given-name"
						value={lawyer.firstName}
					/>
					<Field
						labelEng="Middle Name"
						labelFil="Gitnang Pangalan"
						name="middleName"
						autocomplete="additional-name"
						value={lawyer.middleName}
					/>
					<Field
						labelEng="Last Name"
						labelFil="Apelyido"
						name="lastName"
						required
						autocomplete="family-name"
						value={lawyer.lastName}
					/>
					<Field labelEng="Title" name="title" value={lawyer.title} />
					<Field
						labelEng="Suffix"
						labelFil=""
						class="w-24"
						name="nameSuffix"
						autocomplete="additional-name"
						value={lawyer.nameSuffix}
					/>
					<Field
						labelEng="Age"
						labelFil="Edad"
						class="w-32"
						name="age"
						min="1"
						max="120"
						type="number"
						required
						value={lawyer.age}
					/>
					<Select
						name="sex"
						labelEng="Sex"
						labelFil="Kasarian"
						w="w-32"
						value={lawyer.sex ? lawyer.sex : ''}
						required
					>
						<Option value="" disabled hidden selected></Option>
						<Option value="Male">Male</Option>
						<Option value="Female">Female</Option>
					</Select>
					<Field labelEng="Address" name="address" class="w-96" required value={lawyer.address} />
				</div>

				<div class="flex gap-4 mt-6">
					<button class="bg-trust" type="submit">Save</button>
					<button
						type="button"
						class="bg-diligence text-oath"
						on:click={() => (location.href = `/lawyers/${lawyer.id}/delete`)}
					>
						Delete
					</button>
					<button
						type="button"
						class="border border-2 border-diligence"
						on:click={() => history.back()}>Cancel</button
					>
				</div>
			</form>
		{:else}
			<p>Lawyer not found!</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
