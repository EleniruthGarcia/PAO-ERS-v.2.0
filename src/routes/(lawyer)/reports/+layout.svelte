<script lang="ts">
	import { page } from '$app/stores';
</script>

<main>
	<div class="flex justify-between">
		<span>
			<h1 class="text-3xl font-bold">Reports</h1>
			<p>Generate and view your reports here.</p>
		</span>
		<span class="flex items-center">
			<form method="POST" action="filter">
				<input
					type="month"
					name="month"
					id="month"
					required
					value={new Date().toLocaleDateString('en-CA', {
						year: 'numeric',
						month: '2-digit',
						timeZone: 'Asia/Manila'
					})}
				/>
				<select name="type" id="type" required>
					<option value="All Cases" selected>All Cases</option>
					<option value="Legal Counseling">Legal Counseling</option>
					<option value="Criminal Cases">Criminal Cases</option>
					<option value="Civil Cases">Civil Cases</option>
					<option value="Administrative Cases">Administrative Cases</option>
					<option value="Cases Assigned by the Court">Cases Assigned by the Court</option>
					<option value="Affidavits">Affidavits</option>
					<option value="Outreach">Outreach</option>
				</select>
			</form>
		</span>
	</div>

	<!-- tab container -->
	<div class="flex flex-col mt-6">
		<!-- tab navigation -->
		<nav class="flex w-full overflow-x-visible">
			<a
				class={$page.url.pathname === '/reports/F.017'
					? 'py-2 px-4 bg-green-800 text-white border border-gray-300 rounded-t-md'
					: 'py-2 px-4 bg-white border border-gray-300 rounded-t-md'}
				href="/reports/F.017">Monthly Inventory of Clients Served</a
			>
		</nav>
		<!-- tab content -->
		<div class="py-2 px-4 bg-white border border-gray-300 rounded-b-md">
			<slot />
		</div>
	</div>
</main>
