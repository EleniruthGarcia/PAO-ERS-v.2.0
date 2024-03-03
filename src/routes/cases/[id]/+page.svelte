<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;
	let edit = false;
</script>

{#if form?.invalid}
	<span class="text-red-500">Invalid input values!</span>
{/if}

{#if form?.missing}
	<span class="text-red-500">Please fill in all the required fields!</span>
{/if}

{#if form?.error}
	<span class="text-red-500">Failed to edit client!</span>
{/if}

{#if form?.success}
	<span class="text-trust">Successfully edited the client!</span>
{/if}

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	{#await data.client}
		<div class="animate-pulse flex flex-col gap-1">
			<div class="rounded-full bg-slate-500 h-2 w-40"></div>
			<div class="rounded-full bg-slate-500 h-1 w-20"></div>
			<div class="rounded-full bg-slate-500 h-1 w-10"></div>
		</div>
	{:then client}
		<h1 class="text-3xl font-bold">
			{client?.firstName +
				' ' +
				client?.middleName +
				' ' +
				client?.lastName +
				(client?.nameSuffix ? ' ' + client?.nameSuffix : '')}
		</h1>
		{#if edit}
			<form method="POST" action="?/edit" use:enhance class=" grid grid-cols-6 gap-4">
				<label for="firstName">First Name</label>
				<input type="text" name="firstName" id="firstName" required value={client?.firstName} />

				<label for="middleName">Middle Name</label>
				<input type="text" name="middleName" id="middleName" required value={client?.middleName} />

				<label for="lastName">Last Name</label>
				<input type="text" name="lastName" id="lastName" required value={client?.lastName} />

				<label for="nameSuffix">Name Suffix</label>
				<input type="text" name="nameSuffix" id="nameSuffix" value={client?.nameSuffix} />

				<label for="age">Age</label>
				<input type="number" name="age" id="age" required value={client?.age} />

				<label for="sex">Sex</label>
				<select name="sex" id="sex" required value={client?.sex}>
					<option value="" hidden selected></option>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
				</select>

				<label for="address">Address</label>
				<input
					type="text"
					name="address"
					id="address"
					required
					value={client?.address}
					autocomplete="address-level1"
				/>

				<label for="email">Email</label>
				<input type="email" name="email" id="email" value={client?.email} autocomplete="email" />

				<label for="contactNumber">Contact Number</label>
				<input type="tel" name="contactNumber" id="contactNumber" value={client?.contactNumber} />

				<label for="civilStatus">Civil Status</label>
				<select name="civilStatus" id="civilStatus" value={client?.civilStatus}>
					<option value="" hidden selected></option>
					<option value="Single">Single</option>
					<option value="Married">Married</option>
					<option value="Divorced">Divorced</option>
					<option value="Widowed">Widowed</option>
				</select>

				<label for="religion">Religion</label>
				<input type="text" name="religion" id="religion" value={client?.religion} />

				<label for="citizenship">Citizenship</label>
				<input type="text" name="citizenship" id="citizenship" value={client?.citizenship} />

				<label for="educationalAttainment">Educational Attainment</label>
				<input
					type="text"
					name="educationalAttainment"
					id="educationalAttainment"
					value={client?.educationalAttainment}
				/>

				<label for="language">Language/Dialect</label>
				<input type="text" name="language" id="language" value={client?.language} />

				<label for="individualMonthlyIncome">Individual Monthly Income</label>
				<input
					type="number"
					name="individualMonthlyIncome"
					id="individualMonthlyIncome"
					value={client?.individualMonthlyIncome}
				/>

				<label for="detained">Detained</label>
				{#if client?.detained}
					<input type="checkbox" name="detained" id="detained" checked />
				{:else}
					<input type="checkbox" name="detained" id="detained" />
				{/if}

				<label for="detainedSince">Detained Since</label>
				<input
					type="date"
					name="detainedSince"
					id="detainedSince"
					value={client?.detainedSince?.toLocaleDateString('en-CA', {
						timeZone: 'Asia/Manila'
					})}
				/>

				<label for="detainedAt">Detained At</label>
				<input type="text" name="detainedAt" id="detainedAt" value={client?.detainedAt} />

				<label for="spouseName">Spouse Name</label>
				<input type="text" name="spouseName" id="spouseName" value={client?.spouseName} />

				<label for="spouseAddress">Spouse Address</label>
				<input type="text" name="spouseAddress" id="spouseAddress" value={client?.spouseAddress} />

				<label for="spouseContactNumber">Spouse Contact Number</label>
				<input
					type="tel"
					name="spouseContactNumber"
					id="spouseContactNumber"
					value={client?.spouseContactNumber}
				/>

				<button type="submit">Save</button>
				<button on:click={() => (edit = !edit)}>Cancel</button>
			</form>
		{:else}
			<div class="grid grid-cols-2 gap-4 mt-6">
				<div class="flex flex-col gap-4 bg-oath p-4 rounded-lg shadow-md">
					<div class="flex justify-between">
						<h1 class="text-3xl font-bold">Profile</h1>
						<span class="flex gap-4">
							<button on:click={() => (edit = !edit)}>Edit</button>
							<button type="submit" formaction="?/delete" formmethod="POST">Delete</button>
						</span>
					</div>
					<table>
						<tr>
							<td>Age</td>
							<td>{client?.age}</td>
						</tr>
						<tr>
							<td>Sex</td>
							<td>{client?.sex}</td>
						</tr>
						<tr>
							<td>Address</td>
							<td>{client?.address}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{client?.email}</td>
						</tr>
						<tr>
							<td>Contact Number</td>
							<td>{client?.contactNumber}</td>
						</tr>
						<tr>
							<td>Civil Status</td>
							<td>{client?.civilStatus}</td>
						</tr>
						<tr>
							<td>Religion</td>
							<td>{client?.religion}</td>
						</tr>
						<tr>
							<td>Citizenship</td>
							<td>{client?.citizenship}</td>
						</tr>
						<tr>
							<td>Educational Attainment</td>
							<td>{client?.educationalAttainment}</td>
						</tr>
						<tr>
							<td>Language/Dialect</td>
							<td>{client?.language}</td>
						</tr>
						<tr>
							<td>Individual Monthly Income</td>
							<td>{client?.individualMonthlyIncome ? client?.individualMonthlyIncome : ''}</td>
						</tr>
						<tr>
							<td>Detained</td>
							<td>{client?.detained ? 'Yes' : 'No'}</td>
						</tr>
						{#if client?.detained}
							<tr>
								<td>Detained Since</td>
								<td
									>{client?.detainedSince?.toLocaleDateString('en-CA', {
										timeZone: 'Asia/Manila'
									})}</td
								>
							</tr>
							<tr>
								<td>Detained At</td>
								<td>{client?.detainedAt}</td>
							</tr>
						{/if}
						<tr>
							<td>Spouse Name</td>
							<td>{client?.spouseName}</td>
						</tr>
						<tr>
							<td>Spouse Address</td>
							<td>{client?.spouseAddress}</td>
						</tr>
						<tr>
							<td>Spouse Contact Number</td>
							<td>{client?.spouseContactNumber}</td>
						</tr>
					</table>
				</div>
			</div>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
