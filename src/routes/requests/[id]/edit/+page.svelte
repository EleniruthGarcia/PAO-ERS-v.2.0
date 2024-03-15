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

	let otherNature: false;

	let natures = [
		{ name: 'Legal Advice' },
		{ name: 'Legal Documentation' },
		{ name: 'Representation in Court or Quasi-Judicial Bodies' },
		{ name: 'Inquest Legal Assistance' },
		{ name: 'Mediation or Conciliation' },
		{ name: 'Administration of Oath' }
	];
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
		message="The request profile has been successfully edited."
		success={() => history.back()}
	/>
{/if}

<main
	class="h-screen w-full p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence lg:overflow-y-hidden leading-tight"
>
	{#await data.request}
		<div><Loading /></div>
	{:then request}
		{#if request}
			<div>
				<p class="font-bold text-equity mb-2">
					Request Information<span class="p-1 px-2 bg-diligence text-oath rounded-lg ml-2"
						>Edit Mode</span
					>
				</p>
				<h3 class="font-bold">
					Request ID: {request.id}
				</h3>
			</div>
			<form method="POST" use:enhance class="flex flex-col gap-4">
				<div class="inline-flex flex-wrap gap-4">
					<Select name="districtOffice" labelEng="District Office" required>
						<Option value="" disabled hidden selected></Option>
						<Option value="Baguio">Baguio City</Option>
					</Select>
					<DatePicker labelEng="Date of Request" name="date" id="date" class="max-w-40" />
					<Field labelEng="Control Number" name="controlNum" required />
					<Field labelEng="Assigned to" name="assgnTo" required />
					<Field labelEng="Referred to" name="rffrdTo" required />
					<Field labelEng="Referred by" name="rffrdBy" required />
					<Field labelEng="Interviewer" name="interviewer" required />
					<Field labelEng="Approved by" name="apprvBy" required />
				</div>

				<h4 class="font-bold">Client and Lawyer</h4>
				<div class="inline-flex flex-wrap gap-4">
					<Select name="client" labelEng="Client" w="w-32" required>
						<Option value="" disabled hidden selected></Option>
						{#await data.clients}
							<Loading />
						{:then clients}
							{#if clients.length > 0}
								{#each clients as client}
									<Option value={String(client.id)}
										>{client.firstName +
											' ' +
											client.middleName +
											' ' +
											client.lastName +
											(client.nameSuffix ? ' ' + client.nameSuffix : '')}</Option
									>
								{/each}
							{:else}
								<Option value="" disabled>No clients available.</Option>
							{/if}
						{/await}
					</Select>
					<Select name="lawyer" labelEng="Lawyer" w="w-32" required>
						<Option value="" disabled hidden selected></Option>
						{#await data.lawyers}
							<Loading />
						{:then lawyers}
							{#if lawyers.length > 0}
								{#each lawyers as lawyer}
									<Option value={String(lawyer.id)}
										>{lawyer.title +
											' ' +
											lawyer.firstName +
											' ' +
											lawyer.middleName +
											' ' +
											lawyer.lastName +
											(lawyer.nameSuffix ? ' ' + lawyer.nameSuffix : '')}</Option
									>
								{/each}
							{:else}
								<Option value="" disabled>No requests available.</Option>
							{/if}
						{/await}
					</Select>
				</div>

				<h4 class="font-bold">Nature of Request</h4>
				<div class="flex flex-col gap-4">
					<div class="grid grid-cols-3 gap-4">
						{#each natures as nature}
							<Checkbox name={nature.name} labelEng={nature.name} class="text-xs" />
						{/each}

						<Checkbox name="Others" labelEng="Others" class="text-xs" bind:checked={otherNature} />
						{#if otherNature}
							<Field labelEng="Other Nature" name="otherNature" class="w-full text-xs" required />
						{/if}
					</div>
				</div>

				<div class="flex gap-4 mt-6">
					<button class="bg-trust" type="submit">Submit</button>
					<button class="bg-diligence text-oath" type="reset">Reset</button>
					<button
						class="border border-2 border-diligence"
						type="button"
						on:click={() => history.back()}>Cancel</button
					>
				</div>
			</form>
		{:else}
			<p>request not found!</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
