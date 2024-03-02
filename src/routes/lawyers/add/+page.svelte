<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
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
	<span class="text-green-500">Successfully registered!</span>
{/if}

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	<form method="POST" use:enhance class=" grid grid-cols-6 gap-4">
		<label for="username">Username</label>
		<input type="text" name="username" id="username" required autocomplete="username" />

		<label for="password">Password</label>
		<input type="password" name="password" id="password" required autocomplete="new-password" />

		<label for="title">Title</label>
		<input type="text" name="title" id="title" required autocomplete="honorific-prefix" />

		<label for="firstName">First Name</label>
		<input type="text" name="firstName" id="firstName" required autocomplete="given-name" />

		<label for="middleName">Middle Name</label>
		<input type="text" name="middleName" id="middleName" required autocomplete="additional-name" />

		<label for="lastName">Last Name</label>
		<input type="text" name="lastName" id="lastName" required autocomplete="family-name" />

		<label for="nameSuffix">Name Suffix</label>
		<input type="text" name="nameSuffix" id="nameSuffix" />

		<label for="age">Age</label>
		<input type="number" name="age" id="age" required />

		<label for="sex">Sex</label>
		<select name="sex" id="sex" required autocomplete="sex">
			<option value="" hidden selected></option>
			<option value="Male">Male</option>
			<option value="Female">Female</option>
		</select>

		<label for="address">Address</label>
		<input type="text" name="address" id="address" required autocomplete="address-level1" />

		<label for="email">Email</label>
		<input type="email" name="email" id="email" autocomplete="email" />

		<label for="contactNumber">Contact Number</label>
		<input type="tel" name="contactNumber" id="contactNumber" />

		<button type="submit">Submit</button>
		<button type="reset">Reset</button>
		<button type="button" on:click={() => history.back()}>Go Back</button>
	</form>
</main>
