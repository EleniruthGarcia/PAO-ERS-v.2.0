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

	let detained: boolean;
	let civilStatus: string;

	data.client.then((client) => {
		civilStatus = client?.civilStatus ? client?.civilStatus : '';
		detained = client?.detained ? client?.detained : false;
	});
</script>

{#if form?.invalid}
	<Modal message="Invalid input values." />
{/if}

{#if form?.missing}
	<Modal message="Please fill out all necessary information." />
{/if}

{#if form?.error}
	<Modal message="An error occurred while submitting the form." />
{/if}

{#if form?.success}
	<Modal
		title="Edit Success!"
		message="The client profile has been successfully edited."
		success={() => history.back()}
	/>
{/if}

<main
	class="h-screen w-full p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence lg:overflow-y-hidden leading-tight"
>
	{#await data.client}
		<div><Loading /></div>
	{:then client}
		{#if client}
			<div>
				<p class="font-bold text-equity mb-2">
					Client Profile<span class="p-1 px-2 bg-diligence text-oath rounded-lg ml-2"
						>Edit Mode</span
					>
				</p>
				<h3 class="font-bold">
					{client?.firstName +
						' ' +
						client?.middleName +
						' ' +
						client?.lastName +
						(client?.nameSuffix ? ' ' + client?.nameSuffix : '')}
				</h3>
			</div>
			<form method="POST" use:enhance class="flex flex-col gap-4">
				<div class="inline-flex flex-wrap gap-4">
					<Field
						labelEng="First Name"
						labelFil="Unang Pangalan"
						name="firstName"
						required
						autocomplete="given-name"
						value={client.firstName}
					/>
					<Field
						labelEng="Middle Name"
						labelFil="Gitnang Pangalan"
						name="middleName"
						autocomplete="additional-name"
						value={client.middleName}
					/>
					<Field
						labelEng="Last Name"
						labelFil="Apelyido"
						name="lastName"
						required
						autocomplete="family-name"
						value={client.lastName}
					/>
					<Field
						labelEng="Suffix"
						labelFil=""
						class="w-24"
						name="nameSuffix"
						autocomplete="additional-name"
						value={client.nameSuffix}
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
						value={client.age}
					/>
					<Select
						name="sex"
						labelEng="Sex"
						labelFil="Kasarian"
						w="w-32"
						value={client.sex ? client.sex : ''}
						required
					>
						<Option value="" disabled hidden selected></Option>
						<Option value="Male">Male</Option>
						<Option value="Female">Female</Option>
					</Select>
					<Select
						name="civilStatus"
						labelEng="Civil Status"
						w="w-32"
						bind:value={civilStatus}
						required
					>
						<Option value="" disabled hidden selected></Option>
						<Option value="Single">Single</Option>
						<Option value="Married">Married</Option>
						<Option value="Divorced">Divorced</Option>
						<Option value="Widowed">Widowed</Option>
					</Select>
					<Field labelEng="Citizenship" name="citizenship" value={client.citizenship} />
					<Field
						labelEng="Address"
						labelFil="Tirahan"
						name="address"
						class="w-96"
						required
						value={client.address}
					/>
					<Field labelEng="Email" name="email" required autocomplete="email" value={client.email} />
					<Field
						labelEng="Contact Number"
						name="contactNumber"
						type="tel"
						value={client.contactNumber}
					/>
					<Field
						labelEng="Language or Dialect"
						labelFil="Wika o Dayalekto"
						name="language"
						class="w-80"
						value={client.language}
					/>
					<Field
						labelEng="Educational Attainment"
						name="educationalAttainment"
						value={client.educationalAttainment}
					/>
					<Field labelEng="Religion" labelFil="Relihiyon" name="religion" value={client.religion} />
					<Field
						labelEng="Individual Monthly Income"
						name="individualMonthlyIncome"
						class="w-80 lg:max-w-96"
						type="number"
						required
						value={client.individualMonthlyIncome}
					/>
				</div>
				<div class="flex gap-4 items-center">
					<p class="text-sm">Is the client detained?</p>
					<Checkbox name="detained" labelEng="Detained" bind:checked={detained} class="" />
				</div>
				{#if civilStatus === 'Married'}
					<h4 class="font-bold">Spouse Information</h4>
					<div class="flex flex-wrap gap-4">
						<Field
							labelEng="Spouse Name"
							labelFil="Pangalan ng Asawa"
							name="spouseName"
							required
							value={client.spouseName}
						/>
						<Field
							labelEng="Address of Spouse"
							labelFil="Tirahan ng Asawa"
							name="spouseAddress"
							w="w-96"
							required
							value={client.spouseAddress}
						/>
						<Field
							labelEng="Spouse Contact Number"
							name="spouseContactNumber"
							type="tel"
							value={client.spouseContactNumber}
						/>
					</div>
				{/if}

				{#if detained}
					<h4 class="font-bold">Detainee Information</h4>
					<div class="flex flex-wrap gap-4">
						<Field
							labelEng="Place of Detention"
							name="detainedAt"
							class="w-96 lg:max-w-96"
							value={client.detainedAt}
						/>
						<DatePicker
							labelEng="Detained Since"
							name="detainedSince"
							id="detainedSince"
							class="max-w-40"
							value={client.detainedSince?.toLocaleDateString('en-CA', {
								timeZone: 'Asia/Manila'
							})}
						/>
					</div>
				{/if}

				<div class="flex gap-4 mt-6">
					<button class="bg-trust" type="submit">Save</button>
					<button
						type="button"
						class="bg-diligence text-oath"
						on:click={() => (location.href = `/clients/${client.id}/delete`)}
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
			<p>Client not found!</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
