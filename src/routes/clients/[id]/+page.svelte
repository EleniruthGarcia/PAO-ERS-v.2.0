<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	{#await data.client}
		<div class="animate-pulse flex flex-col gap-1">
			<div class="rounded-full bg-slate-500 h-2 w-40"></div>
			<div class="rounded-full bg-slate-500 h-1 w-20"></div>
			<div class="rounded-full bg-slate-500 h-1 w-10"></div>
		</div>
	{:then client}
		<div class="flex justify-between">
			<h1 class="text-3xl font-bold">
				{client?.firstName +
					' ' +
					client?.middleName +
					' ' +
					client?.lastName +
					(client?.nameSuffix ? ' ' + client?.nameSuffix : '')}
			</h1>
			<span class="flex gap-4">
				<a href="/clients/{client?.id}/edit">Edit</a>
				<a href="/clients/{client?.id}/delete">Delete</a>
			</span>
		</div>
		<div class="grid grid-cols-2 gap-4 mt-6">
			<div class="flex flex-col gap-4 bg-oath p-4 rounded-lg shadow-md">
				<h1 class="text-3xl font-bold">Requests</h1>
				<table>
					{#if client?.request && client?.request.length > 0}
						{#each client?.request as request}
							<tr>
								<td>{request.requestType}</td>
								<td>{request.requestDate}</td>
							</tr>
						{/each}
					{:else}
						<span class="flex flex-col gap-4">
							<p>No requests found!</p>
							<a
								href="/requests/add?clientId={client?.id}"
								class="px-4 py-2 rounded-lg bg-trust text-diligence">New Request</a
							>
						</span>
					{/if}
				</table>
			</div>
			<div class="flex flex-col gap-4 bg-oath p-4 rounded-lg shadow-md">
				<h1 class="text-3xl font-bold">Personal Information</h1>
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
				</table>
			</div>
			{#if client?.detained}
				<div class="flex flex-col gap-4 bg-oath p-4 rounded-lg shadow-md">
					<h1 class="text-3xl font-bold">Detainee Information</h1>
					<table>
						<tr>
							<td>Detained</td>
							<td>{client?.detained ? 'Yes' : 'No'}</td>
						</tr>
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
					</table>
				</div>
			{/if}
			{#if client?.civilStatus === 'Married'}
				<div class="flex flex-col gap-4 bg-oath p-4 rounded-lg shadow-md">
					<h1 class="text-3xl font-bold">Spouse Information</h1>
					<table>
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
			{/if}
		</div>
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
