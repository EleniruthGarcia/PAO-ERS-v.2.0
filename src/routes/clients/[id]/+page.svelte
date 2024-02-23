<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	let edit = false;
</script>

<main class="container">
	{#await data.client}
		<p>Loading client...</p>
	{:then client}
		{#if edit}
			<form method="POST" action="?/edit" use:enhance class=" grid grid-cols-6 gap-4">
				<label for="name">Name</label>
				<input type="text" name="name" id="name" required value={client?.name} />

				<label for="age">Age</label>
				<input type="number" name="age" id="age" required value={client?.age} />

				<label for="sex">Sex</label>
				<select name="sex" id="sex" required value={client?.sex}>
					<option value="" hidden selected></option>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</select>

				<label for="address">Address</label>
				<input type="text" name="address" id="address" required value={client?.address} />

				<label for="email">Email</label>
				<input type="email" name="email" id="email" value={client?.email} />

				<label for="contactNumber">Contact Number</label>
				<input type="tel" name="contactNumber" id="contactNumber" value={client?.contactNumber} />

				<label for="civilStatus">Civil Status</label>
				<select name="civilStatus" id="civilStatus" value={client?.civilStatus}>
					<option value="" hidden selected></option>
					<option value="single">Single</option>
					<option value="married">Married</option>
					<option value="divorced">Divorced</option>
					<option value="widowed">Widowed</option>
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
			<div class="flex flex-col gap-4">
				<h1 class="text-3xl font-bold">{client?.name}</h1>
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

				<span>
					<button on:click={() => (edit = !edit)}>Edit</button>
					<button type="submit" formaction="?/delete" formmethod="POST">Delete</button>
				</span>
			</div>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
