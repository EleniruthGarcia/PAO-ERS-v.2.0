<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="h-screen w-screen flex flex-col p-12 gap-6 bg-witness">
	<div class="flex justify-between">
		<span>
			<h1 class="text-3xl font-bold">Reports</h1>
			<p>Generate and view reports here.</p>
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
					class="p-2 rounded-lg border border-innocence text-sm"
				/>
			</form>
		</span>
	</div>

	<!-- tab container -->
	<div class="flex flex-col">
		<!-- tab navigation -->
		<nav class="flex w-full overflow-x-visible">
			<a
				class={$page.url.pathname === '/reports'
					? 'py-2 px-4 bg-trust text-diligence border border-innocence rounded-t-md'
					: 'py-2 px-4 bg-oath border border-innocence rounded-t-md'}
				href="/reports/F.017">Overview</a
			>
			<a
				class={$page.url.pathname === '/reports/F.017'
					? 'py-2 px-4 bg-trust text-diligence border border-innocence rounded-t-md'
					: 'py-2 px-4 bg-oath border border-innocence rounded-t-md'}
				href="/reports/F.017">Monthly Inventory of Clients Served</a
			>
		</nav>
		<!-- tab content -->
		<div class="py-2 px-4 bg-oath border border-innocence rounded-b-md">
			<slot />
		</div>
	</div>
</main>
