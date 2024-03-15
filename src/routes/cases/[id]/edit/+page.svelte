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

	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiChevronRight, mdiChevronLeft } from '@mdi/js';

	export let data: PageServerData;
	export let form: ActionData;

	let request = 'value';
	let otherProof = false;
	let otherInvolvement: false;
	let pending: boolean;
	let steps = ['Nature', 'Parties', 'Facts', 'Proof'], currentActive = 1;
	let active_step = steps[currentActive - 1];

	export const handleProgress = (stepIncrement) => {
		if(stepIncrement == 1){
			currentActive++
		} else {
			currentActive--
			if(currentActive < 1) {
					currentActive = 1 
			}
		}
		active_step = steps[currentActive - 1]
	}

	let nature = [
		{ name: 'Criminal' },
		{ name: 'Administrative' },
		{ name: 'Civil' },
		{ name: 'Appealed' },
		{ name: 'Labor' }
	];

	let proofs = [
		{ name: 'Income Tax Return' },
		{ name: 'Certification of Barangay' },
		{ name: 'Certification from DSWD' },
		{ name: 'Others' }
	];

	
	let involvement = [
		{ name: 'Plaintiff' },
		{ name: 'Petitioner' },
		{ name: 'Complainant' },
		{ name: 'Defendant' },
		{ name: 'Respondent' },
		{ name: 'Accused' },
		{ name: 'Oppositor' },
		{ name: 'Others' }
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
		message="The client profile has been successfully edited."
		success={() => history.back()}
	/>
{/if}

<main
	class="h-screen w-full p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence lg:overflow-y-hidden leading-tight"
>
	{#await data._case}
		<div><Loading /></div>
	{:then _case}
		{#if _case}
			<div>
				<p class="font-bold text-equity mb-2">
					Case Information<span class="p-1 px-2 bg-diligence text-oath rounded-lg ml-2"
						>Edit Mode</span
					>
				</p>
				<h3 class="font-bold">
					{_case.title}
				</h3>
			</div>
			<form method="POST" use:enhance class="flex flex-col gap-4">
				{#if currentActive == 1}
				<h4 class="font-bold">Request Information</h4>
				<div class="inline-flex flex-wrap gap-4">
					<Select name="requestId" labelEng="Request" w="w-32" bind:value={request} required>
						<Option value="" disabled hidden selected></Option>
						{#await data.requests}
							<Loading />
						{:then requests}
							{#if requests.length > 0}
								{#each requests as request}
									<Option value={String(request.id)}
										>{request.client.lastName} | {request.requestType}</Option
									>
								{/each}
							{:else}
								<Option value="" disabled>No requests available</Option>
							{/if}
						{/await}
					</Select>
				</div>
				{/if}
				{#if request}
					{#if active_step == 'Nature'}
					<h4 class="font-bold">Nature of Case</h4>
					<div class="flex flex-col gap-4">
						<div class="grid grid-cols-3 gap-4">
							{#each nature as nat}
								<Checkbox name={nat.name} labelEng={nat.name} class="text-xs" />
							{/each}
						</div>
						<div class="flex flex-col gap-2">
							<label for="addinfo" class="text-sm font-bold">Additional Information</label>
							<input
								class="p-2 rounded outline outline-equity outline-1 focus:outline-2 focus:outline-equity text-sm w-full"
								id="addinfo"
								name="addinfo"
								type="text"
								placeholder="Type additional information about the case here."
							/>
						</div>
					</div>
		
					{:else if active_step == 'Parties'}
		
					<h4 class="font-bold">Client's Case Involvement</h4>
					<div class="flex flex-col gap-4">
						<div class="grid grid-cols-3 gap-4">
							{#each involvement as involve}
								{#if involve.name === 'Others'}
									<Checkbox
										name={involve.name}
										labelEng={involve.name}
										class="text-xs"
										bind:checked={otherInvolvement}
									/>
								{:else}
									<Checkbox name={involve.name} labelEng={involve.name} class="text-xs" />
								{/if}
							{/each}
							{#if otherInvolvement}
								<Field
									labelEng="Other Involvement"
									name="otherInvolvement"
									class="w-full text-xs"
									required
								/>
							{/if}
						</div>
					</div>
		
					<h4 class="font-bold">Adverse Party</h4>
					<div class="flex flex-col gap-4">
						<div class="grid grid-cols-3 gap-4">
							<Checkbox name="plaintiff" labelEng="Plaintiff or Complainant" class="text-xs" />
							<Checkbox name="defendant" labelEng="Defendant, Respondent, or Accused" class="text-xs" />
							<Checkbox name="oppositor" labelEng="Oppositor or Others" class="text-xs" />
						</div>
						<div class="flex flex-wrap gap-4">
							<Field labelEng="Name" name="advName" required />
							<Field labelEng="Address" name="advAddress" w="w-96" required />
						</div>
					</div>
		
					{:else if active_step == 'Facts'}
		
					<h4 class="font-bold">Facts of the Case</h4>
					<textarea
						class="p-2 rounded outline outline-equity outline-1 focus:outline-2 focus:outline-equity text-sm w-full"
						id="facts"
						name="facts"
						placeholder="Type the facts about the case here."
					/>
		
					<h4 class="font-bold">Cause of Action or Nature of Offense</h4>
					<textarea
						class="p-2 rounded outline outline-equity outline-1 focus:outline-2 focus:outline-equity text-sm w-full"
						id="coa"
						name="coa"
						placeholder="Type the cause of action or nature of offense here."
					/>
		
					<div class="flex gap-4 items-center">
						<p class="text-sm">Is the case pending in court?</p>
						<Checkbox name="pending" labelEng="Pending" bind:checked={pending} class="" />
					</div>
		
					{#if pending}
						<h4 class="font-bold">Pending Case Information</h4>
						<div class="flex flex-wrap gap-4">
							<Field labelEng="Title of the Case" name="caseTitle" required />
							<Field labelEng="Docket Number" name="docketNumber" required />
							<Field labelEng="Court" name="court" required />
						</div>
					{/if}
		
					{:else if active_step == 'Proof'}
		
					<h4 class="font-bold">Proof of Indigency</h4>
					<div class="flex flex-col gap-4">
						<div class="grid grid-cols-3 gap-4">
							{#each proofs as proof}
								<Checkbox name={proof.name} labelEng={proof.name} class="text-xs" />
							{/each}
							<Checkbox name="Others" labelEng="Others" class="text-xs" bind:checked={otherProof} />
							{#if otherProof}
								<Field labelEng="Other Proof" name="otherProof" class="w-full text-xs" required />
							{/if}
						</div>
					</div>
		
					{/if}
		
					<div class="flex gap-4 mt-6">
						<button class="bg-equity text-oath disabled:hidden" on:click={() => handleProgress(-1)} disabled={currentActive == 1} type="button"><SvgIcon size="15px" type="mdi" path={mdiChevronLeft}></SvgIcon></button>
						<button class="bg-equity text-oath disabled:hidden" on:click={() => handleProgress(+1)} disabled={currentActive == steps.length} type="button"><SvgIcon size="15px" type="mdi" path={mdiChevronRight}></SvgIcon></button>
						<button class="bg-trust disabled:hidden" disabled={currentActive != steps.length} type="submit">Submit</button>
						<button class="bg-diligence text-oath" type="reset">Reset</button>
						<button
							class="border border-2 border-diligence"
							type="button"
							on:click={() => history.back()}>Cancel</button
						>
					</div>
				{/if}
			</form>
		{:else}
			<p>Case not found.</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
