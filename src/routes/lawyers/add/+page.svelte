<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import Modal from '$lib/components/Modal.svelte';
	import Field from '$lib/components/Field.svelte';
	import Select from '$lib/components/Select.svelte';
	import Option from '$lib/components/Option.svelte';

	export let form: ActionData;
</script>

{#if form?.invalid}
	<Modal message="Invalid input values!" />
{/if}

{#if form?.mismatch}
	<Modal title="Password Mismatch" message="Passwords do not match." />
{/if}

{#if form?.user}
	<Modal title="Username Taken" message="Username is already taken." />
{/if}

{#if form?.missing}
	<Modal message="Please fill out all necessary information!" />
{/if}

{#if form?.error}
	<Modal message="An error occurred while submitting the form!" />
{/if}

{#if form?.success}
	<Modal
		title="Account Creation Success!"
		message="Lawyer successfully added!"
		success={() => history.back()}
	/>
{/if}

<main
	class="h-screen w-full flex flex-col p-12 gap-6 bg-witness text-diligence pl-14 pr-28 overflow-x-hidden leading-tight"
>
	<div class="text-diligence">
		<h3 class="font-bold mb-2">Lawyer Profile</h3>
		<span class="font-bold">Create a new lawyer account.</span> | Lumikha ng bagong account para sa abogado.
	</div>
	<form method="POST" use:enhance class="flex flex-col gap-4">
		<h4 class="font-bold">Account Information</h4>
		<div class="inline-flex flex-wrap gap-4">
			<Field labelEng="Username" name="username" required />
			<Field labelEng="Password" name="password" type="password" required />
			<Field labelEng="Confirm Password" name="confirmPassword" type="password" required />
		</div>
		<h4 class="font-bold">Lawyer Information</h4>
		<div class="inline-flex flex-wrap gap-4">
			<Field
				labelEng="First Name"
				labelFil="Unang Pangalan"
				name="firstName"
				required
				autocomplete="given-name"
			/>
			<Field
				labelEng="Middle Name"
				labelFil="Gitnang Pangalan"
				name="middleName"
				autocomplete="additional-name"
			/>
			<Field
				labelEng="Last Name"
				labelFil="Apelyido"
				name="lastName"
				required
				autocomplete="family-name"
			/>
			<Field labelEng="Title" name="title" required />
			<Field
				labelEng="Suffix"
				labelFil=""
				class="w-24"
				name="nameSuffix"
				autocomplete="additional-name"
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
			/>
			<Select name="sex" labelEng="Sex" labelFil="Kasarian" w="w-32" required>
				<Option value="" disabled hidden selected></Option>
				<Option value="Male">Male</Option>
				<Option value="Female">Female</Option>
			</Select>
			<Field labelEng="Address" name="address" class="w-96" required />
		</div>
		<div class="flex gap-4 mt-6">
			<button class="bg-trust" type="submit">Submit</button>
			<button class="bg-diligence text-oath" type="reset">Reset</button>
			<button class="border border-2 border-diligence" type="button" on:click={() => history.back()}
				>Cancel</button
			>
		</div>
	</form>
</main>
