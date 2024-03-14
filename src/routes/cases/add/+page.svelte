<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	import Loading from '$lib/components/Loading.svelte';

	import Modal from '$lib/components/Modal.svelte';
	import Field from '$lib/components/Field.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Select from '$lib/components/Select.svelte';
	import Option from '$lib/components/Option.svelte';

	export let data: PageServerData;
	export let form: ActionData;

	let classification = [
    { name: "Child in Conflict with the Law" },
    { name: "Woman Client" },
    { name: "VAWC Victim" },
    { name: "Law Enforcer" },
    { name: "Drug-Related Duty" },
    { name: "OFW (Land-Based)" },
    { name: "OFW (Sea-Based)" },
    { name: "Former Rebels (FRs) and Former Violent Extremists (FVEs)" },
    { name: "Senior Citizen" },
    { name: "Refugee or Evacuee" },
    { name: "Tenant in Agrarian Case" },
    { name: "Victim of Terrorism (R.A. No. 9372)" },
    { name: "Victim of Torture (R.A. 9745)" },
    { name: "Victim of Trafficking (R.A. No. 9208)" },
    { name: "Foreign National" },
    { name: "Urban Poor" },
    { name: "Rural Poor" },
    { name: "Indigenous People" },
    { name: "PWD" },
    { name: "Petitioner for Voluntary Rehabilitation" }
  ];
</script>

{#if form?.invalid}
	<Modal title="Invalid Input" message="Please ensure that all fields are filled properly." />
{/if}

{#if form?.missing}
	<Modal title="Form Incomplete" message="Please fill out all necessary information." />
{/if}

{#if form?.error}
	<Modal title="Form Error" message="An error occurred while submitting the form." />
{/if}

{#if form?.success}
	<Modal
		title="Add Success!"
		message="Client has been successfully added."
		success={() => history.back()}
	/>
{/if}

<main
	class="h-full w-screen flex flex-col p-12 gap-6 bg-witness text-diligence lg:pl-14 lg:pr-28 overflow-x-hidden leading-tight"
>
	<div class="text-diligence">
		<h3 class="font-bold mb-2">Case Information</h3>
		<span class="font-bold">Please fill out all necessary information.</span> | Mangyaring punan ang
		lahat ng kinakailangang impormasyon.
	</div>
	<form method="POST" use:enhance class="flex flex-col gap-4">
		<h4 class="font-bold">Request Information</h4>
		<div class="inline-flex flex-wrap gap-4">
			<Select name="requestId" labelEng="Request" w="w-32" required>
				<Option value="" disabled hidden selected></Option>
				{#await data.requests}
					<Loading />
				{:then requests}
					{#if requests.length > 0}
						{#each requests as request}
							<Option value={String(request.id)}>{request.client.lastName} | {request.requestType}</Option>
						{/each}
					{:else}
						<Option value="" disabled>No requests available</Option>
					{/if}
				{/await}
			</Select>
		</div>
		
		<h4 class="font-bold">Client Classification</h4>
		<div class="grid grid-cols-3 gap-4">
			{#each classification as classify}
			<Checkbox name={classify.name} labelEng={classify.name} class="text-xs" />
			{/each}
		</div>

		<div class="flex gap-4 mt-6">
			<button class="bg-trust" type="submit">Submit</button>
			<button
				class="bg-diligence text-oath"
				type="reset"
				>Reset</button
			>
			<button class="border border-2 border-diligence" type="button" on:click={() => history.back()}
				>Go Back</button
			>
		</div>
	</form>
</main>
