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

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	<div class="text-diligence">
		<h2 class="font-bold">Client's Personal Circumstances</h2>
		<span class="font-bold">Please fill out all necessary information.</span> | Mangyaring punan ang
		lahat ng kinakailangang impormasyon.
	</div>
	<form method="POST" use:enhance class="flex flex-col gap-4">
		<div class="flex gap-4">
			<Field
				labelEng="First Name"
				labelFil="Unang Pangalan"
				w="w-64"
				name="firstName"
				required
				autocomplete="given-name"
			/>
			<Field
				labelEng="Middle Name"
				labelFil="Gitnang Pangalan"
				w="w-64"
				name="middleName"
				required
				autocomplete="additional-name"
			/>
			<Field
				labelEng="Last Name"
				labelFil="Apelyido"
				w="w-64"
				name="lastName"
				required
				autocomplete="family-name"
			/>
			<Field
				labelEng="Suffix"
				labelFil=""
				w="w-32"
				name="nameSuffix"
				autocomplete="additional-name"
			/>
		</div>
		<div class="flex gap-4">
			<Field
				labelEng="Age"
				labelFil="Edad"
				w="w-32"
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
				w="w-96"
				required
				autocomplete="address-level1"
			/>
		</div>
		<div class="flex gap-4">
			<Field labelEng="Citizenship" name="citizenship" />
			<Field labelEng="Email" name="email" required autocomplete="email" />
			<Field labelEng="Contact Number" name="contactNumber" type="tel" />
		</div>
		<div class="flex gap-4">
			<Field labelEng="Educational Attainment" name="educationalAttainment" />
			<Field labelEng="Language or Dialect" labelFil="Wika o Dayalekto" name="language" />
			<Field labelEng="Religion" labelFil="Relihiyon" name="religion" />
		</div>

		<div class="flex gap-4">
			<Field labelEng="Individual Monthly Income" name="individualMonthlyIncome" required />

			<label for="detained">Detained</label>
			<input type="checkbox" name="detained" id="detained" bind:checked={detained} />

			{#if detained}
				<label for="detainedSince">Detained Since</label>
				<input type="date" name="detainedSince" id="detainedSince" />

				<Field labelEng="Place of Detention" name="detainedAt" />
			{/if}
		</div>

		{#if civilStatus === 'Married'}
			<div class="flex gap-4">
				<Field labelEng="Spouse Name" labelFil="Pangalan ng Asawa" name="spouseName" required />
				<Field
					labelEng="Address of Spouse"
					labelFil="Tirahan ng Asawa"
					name="spouseAddress"
					w="w-96"
					required
					autocomplete="spouseAddress"
				/>
				<Field labelEng="Spouse Contact Number" name="spouseContactNumber" type="tel" />
			</div>
		{/if}

		<div class="flex gap-4">
			<button type="submit">Submit</button>
			<button type="reset">Reset</button>
			<button type="button" on:click={() => history.back()}>Go Back</button>
		</div>
	</form>
</main>
