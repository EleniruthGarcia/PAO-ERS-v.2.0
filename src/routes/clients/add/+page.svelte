<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import Field from '$lib/components/Field.svelte';
	import * as Dropdown from '$lib/components/Dropdown';

	export let form: ActionData;

	let detained: boolean;
	let civilStatus: string;
</script>

{#if form?.invalid}
	<span class="text-red-500">Invalid input values!</span>
{/if}

{#if form?.missing}
	<span class="text-red-500">Please fill in all the required fields!</span>
{/if}

{#if form?.error}
	<span class="text-red-500">Failed to create user!</span>
{/if}

{#if form?.success}
	<span class="text-trust">Successfully registered!</span>
{/if}

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness text-diligence pl-14">
	<div class="text-diligence">
		<h2 class="font-bold">Client's Personal Circumstances</h2>
		<span class="font-bold">Please fill out all necessary information.</span> | Mangyaring punan ang
		lahat ng kinakailangang impormasyon.
	</div>
	<form method="POST" use:enhance class="flex flex-col gap-4">
		<h3 class="font-bold">Personal Information</h3>
		<div class="flex gap-4">
			<Field
				labelEng="First Name"
				labelFil="Unang Pangalan"
				name="firstName"
				grow
				required
				autocomplete="given-name"
			/>
			<Field
				labelEng="Middle Name"
				labelFil="Gitnang Pangalan"
				name="middleName"
				grow
				autocomplete="additional-name"
			/>
			<Field
				labelEng="Last Name"
				labelFil="Apelyido"
				name="lastName"
				required
				grow
				autocomplete="family-name"
			/>
			<Field
				labelEng="Suffix"
				labelFil=""
				class="w-32"
				name="nameSuffix"
				autocomplete="additional-name"
			/>
		</div>
		<div class="flex gap-4">
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
			<Dropdown.Root labelEng="Sex" labelFil="Kasarian" w="w-32" required>
				<Dropdown.Option value="" disabled hidden selected></Dropdown.Option>
				<Dropdown.Option value="Male">Male</Dropdown.Option>
				<Dropdown.Option value="Female">Female</Dropdown.Option>
			</Dropdown.Root>
			<Dropdown.Root labelEng="Civil Status" w="w-32" bind:value={civilStatus} required>
				<Dropdown.Option value="" disabled hidden selected></Dropdown.Option>
				<Dropdown.Option value="Single">Single</Dropdown.Option>
				<Dropdown.Option value="Married">Married</Dropdown.Option>
				<Dropdown.Option value="Divorced">Divorced</Dropdown.Option>
				<Dropdown.Option value="Widowed">Widowed</Dropdown.Option>
			</Dropdown.Root>
			<Field
				labelEng="Address"
				labelFil="Tirahan"
				name="address"
				grow
				required
				autocomplete="address-level1"
			/>
		</div>
		<div class="flex gap-4">
			<Field labelEng="Citizenship" name="citizenship" grow />
			<Field labelEng="Email" name="email" grow required autocomplete="email" />
			<Field labelEng="Contact Number" name="contactNumber" grow type="tel" />
		</div>
		<div class="flex gap-4">
			<Field labelEng="Educational Attainment" name="educationalAttainment" grow />
			<Field labelEng="Language or Dialect" labelFil="Wika o Dayalekto" name="language" grow />
			<Field labelEng="Religion" labelFil="Relihiyon" name="religion" grow />
		</div>
		<Field
			labelEng="Individual Monthly Income"
			name="individualMonthlyIncome"
			class="w-80"
			required
		/>

		{#if civilStatus === 'Married'}
			<h3 class="font-bold">Spouse Information</h3>
			<div class="flex gap-4">
				<Field
					labelEng="Spouse Name"
					labelFil="Pangalan ng Asawa"
					name="spouseName"
					grow
					required
				/>
				<Field
					labelEng="Address of Spouse"
					labelFil="Tirahan ng Asawa"
					name="spouseAddress"
					w="w-96"
					grow
					required
					autocomplete="spouseAddress"
				/>
				<Field labelEng="Spouse Contact Number" name="spouseContactNumber" grow type="tel" />
			</div>
		{/if}

		<h3 class="font-bold">Detainee Information</h3>
		<div class="flex gap-4">
			<label for="detained">Detained</label>
			<input type="checkbox" name="detained" id="detained" bind:checked={detained} />

			{#if detained}
				<Field labelEng="Detained Since" type="date" name="detainedSince" id="detainedSince" />

				<Field labelEng="Place of Detention" name="detainedAt" grow />
			{/if}
		</div>

		<div class="flex gap-4">
			<button type="submit">Submit</button>
			<button type="reset">Reset</button>
			<button type="button" on:click={() => history.back()}>Go Back</button>
		</div>
	</form>
</main>
