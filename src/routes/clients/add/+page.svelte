<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import Modal from '$lib/components/Modal.svelte';
	import Field from '$lib/components/Field.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Select from '$lib/components/Select.svelte';
	import Option from '$lib/components/Option.svelte';

	export let form: ActionData;

	let detained: boolean;
	let civilStatus: string;
</script>

{#if form?.invalid}
	<Modal message="Invalid input values!" />
{/if}

{#if form?.missing}
	<Modal message="Please fill out all necessary information!" />
{/if}

{#if form?.error}
	<Modal message="An error occurred while submitting the form!" />
{/if}

{#if form?.success}
	<Modal
		message="Client's personal circumstances successfully added!"
		success={() => history.back()}
	/>
{/if}

<main
	class="h-[90%] lg:h-full w-screen flex flex-col pt-12 p-6 lg:p-12 gap-6 bg-witness text-diligence lg:pl-14 lg:pr-28 overflow-x-hidden leading-tight"
>
	<div class="text-diligence">
		<h3 class="font-bold mb-2">Client's Personal Circumstances</h3>
		<span class="font-bold">Please fill out all necessary information.</span> | Mangyaring punan ang
		lahat ng kinakailangang impormasyon.
	</div>
	<form method="POST" use:enhance class="flex flex-col gap-4">
		<h4 class="font-bold">Personal Information</h4>
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
			<Select name="civilStatus" labelEng="Civil Status" w="w-32" bind:value={civilStatus} required>
				<Option value="" disabled hidden selected></Option>
				<Option value="Single">Single</Option>
				<Option value="Married">Married</Option>
				<Option value="Divorced">Divorced</Option>
				<Option value="Widowed">Widowed</Option>
			</Select>
			<Field labelEng="Citizenship" name="citizenship" />
			<Field labelEng="Address" labelFil="Tirahan" name="address" class="w-96" required />
			<Field labelEng="Email" name="email" required autocomplete="email" />
			<Field labelEng="Contact Number" name="contactNumber" type="tel" />
			<Field
				labelEng="Language or Dialect"
				labelFil="Wika o Dayalekto"
				name="language"
				class="w-80"
			/>
			<Field labelEng="Educational Attainment" name="educationalAttainment" />
			<Field labelEng="Religion" labelFil="Relihiyon" name="religion" />
			<Field
				labelEng="Individual Monthly Income"
				name="individualMonthlyIncome"
				class="w-80 lg:max-w-96"
				type="number"
				required
			/>
		</div>
		<div class="flex gap-4 items-center">
			<p class="text-sm">Is the client detained?</p>
			<Checkbox name="detained" labelEng="Detained" bind:checked={detained} class="" />
		</div>

		{#if civilStatus === 'Married'}
			<h4 class="font-bold">Spouse Information</h4>
			<div class="flex flex-wrap gap-4">
				<Field labelEng="Spouse Name" labelFil="Pangalan ng Asawa" name="spouseName" required />
				<Field
					labelEng="Address of Spouse"
					labelFil="Tirahan ng Asawa"
					name="spouseAddress"
					w="w-96"
					required
				/>
				<Field labelEng="Spouse Contact Number" name="spouseContactNumber" type="tel" />
			</div>
		{/if}

		{#if detained}
			<h4 class="font-bold">Detainee Information</h4>
			<div class="flex flex-wrap gap-4">
				<Field labelEng="Place of Detention" name="detainedAt" class="w-96 lg:max-w-96" />
				<DatePicker
					labelEng="Detained Since"
					name="detainedSince"
					id="detainedSince"
					class="max-w-40"
				/>
			</div>
		{/if}

		<div class="flex gap-4 mt-6">
			<button class="bg-trust" type="submit">Submit</button>
			<button
				class="bg-diligence text-oath"
				type="reset"
				on:click={() => {
					detained = false;
					civilStatus = '';
				}}>Reset</button
			>
			<button class="border border-2 border-diligence" type="button" on:click={() => history.back()}
				>Go Back</button
			>
		</div>
	</form>
</main>
