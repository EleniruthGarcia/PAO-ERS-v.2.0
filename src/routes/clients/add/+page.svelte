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

<main class="container">
	<form method="POST" use:enhance class=" grid grid-cols-6 gap-4">
		<label for="name">Name</label>
		<input type="text" name="name" id="name" required autocomplete="name" />

		<label for="age">Age</label>
		<input type="number" name="age" id="age" required />

		<label for="sex">Sex</label>
		<select name="sex" id="sex" required autocomplete="sex">
			<option value="" hidden selected></option>
			<option value="male">Male</option>
			<option value="female">Female</option>
		</select>

		<label for="address">Address</label>
		<input type="text" name="address" id="address" required autocomplete="address-level1" />

		<label for="email">Email</label>
		<input type="email" name="email" id="email" autocomplete="email" />

		<label for="contactNumber">Contact Number</label>
		<input type="tel" name="contactNumber" id="contactNumber" />

		<label for="civilStatus">Civil Status</label>
		<select name="civilStatus" id="civilStatus">
			<option value="" hidden selected></option>
			<option value="single">Single</option>
			<option value="married">Married</option>
			<option value="divorced">Divorced</option>
			<option value="widowed">Widowed</option>
		</select>

		<label for="religion">Religion</label>
		<input type="text" name="religion" id="religion" />

		<label for="citizenship">Citizenship</label>
		<input type="text" name="citizenship" id="citizenship" />

		<label for="educationalAttainment">Educational Attainment</label>
		<input type="text" name="educationalAttainment" id="educationalAttainment" />

		<label for="language">Language/Dialect</label>
		<input type="text" name="language" id="language" />

		<label for="individualMonthlyIncome">Individual Monthly Income</label>
		<input type="number" name="individualMonthlyIncome" id="individualMonthlyIncome" />

		<label for="detained">Detained</label>
		<input type="checkbox" name="detained" id="detained" />

		<label for="detainedSince">Detained Since</label>
		<input type="date" name="detainedSince" id="detainedSince" />

		<label for="detainedAt">Detained At</label>
		<input type="text" name="detainedAt" id="detainedAt" />

		<label for="spouseName">Spouse Name</label>
		<input type="text" name="spouseName" id="spouseName" />

		<label for="spouseAddress">Spouse Address</label>
		<input type="text" name="spouseAddress" id="spouseAddress" />

		<label for="spouseContactNumber">Spouse Contact Number</label>
		<input type="tel" name="spouseContactNumber" id="spouseContactNumber" />

		<button type="submit">Submit</button>
		<button type="reset">Reset</button>
		<button type="button" on:click={() => history.back()}>Cancel</button>
	</form>
</main>
