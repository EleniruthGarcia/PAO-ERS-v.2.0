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
	<span class="text-red-500">Failed to edit lawyer!</span>
{/if}

{#if form?.success}
	<span class="text-trust">Successfully edited the lawyer!</span>
{/if}

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	{#await data.lawyer}
		<div class="animate-pulse flex flex-col gap-1">
			<div class="rounded-full bg-slate-500 h-2 w-40"></div>
			<div class="rounded-full bg-slate-500 h-1 w-20"></div>
			<div class="rounded-full bg-slate-500 h-1 w-10"></div>
		</div>
	{:then lawyer}
		<h1 class="text-3xl font-bold">
			{lawyer?.firstName +
				' ' +
				lawyer?.middleName +
				' ' +
				lawyer?.lastName +
				(lawyer?.nameSuffix ? ' ' + lawyer?.nameSuffix : '')}
		</h1>
		{#if edit}
			<form method="POST" action="?/edit" use:enhance class=" grid grid-cols-6 gap-4">
				<label for="username">Username</label>
				<input
					type="text"
					name="username"
					id="username"
					required
					autocomplete="username"
					value={lawyer?.user.username}
				/>

				<label for="title">Title</label>
				<input
					type="text"
					name="title"
					id="title"
					required
					autocomplete="honorific-prefix"
					value={lawyer?.title}
				/>

				<label for="firstName">First Name</label>
				<input type="text" name="firstName" id="firstName" required value={lawyer?.firstName} />

				<label for="middleName">Middle Name</label>
				<input type="text" name="middleName" id="middleName" required value={lawyer?.middleName} />

				<label for="lastName">Last Name</label>
				<input type="text" name="lastName" id="lastName" required value={lawyer?.lastName} />

				<label for="nameSuffix">Name Suffix</label>
				<input type="text" name="nameSuffix" id="nameSuffix" value={lawyer?.nameSuffix} />

				<label for="age">Age</label>
				<input type="number" name="age" id="age" required value={lawyer?.age} />

				<label for="sex">Sex</label>
				<select name="sex" id="sex" required value={lawyer?.sex}>
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
					value={lawyer?.address}
					autocomplete="address-level1"
				/>

				<label for="email">Email</label>
				<input type="email" name="email" id="email" value={lawyer?.email} autocomplete="email" />

				<label for="contactNumber">Contact Number</label>
				<input type="tel" name="contactNumber" id="contactNumber" value={lawyer?.contactNumber} />

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
							<td>Username</td>
							<td>{lawyer?.user.username}</td>
						</tr>
						<tr>
							<td>Title</td>
							<td>{lawyer?.title}</td>
						</tr>
						<tr>
							<td>Age</td>
							<td>{lawyer?.age}</td>
						</tr>
						<tr>
							<td>Sex</td>
							<td>{lawyer?.sex}</td>
						</tr>
						<tr>
							<td>Address</td>
							<td>{lawyer?.address}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{lawyer?.email}</td>
						</tr>
						<tr>
							<td>Contact Number</td>
							<td>{lawyer?.contactNumber}</td>
						</tr>
					</table>
				</div>
			</div>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
