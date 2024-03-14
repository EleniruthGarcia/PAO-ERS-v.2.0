<script lang="ts">
	import { page } from '$app/stores';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiFileDownloadOutline } from '@mdi/js';
	import type { ActionData } from './$types';
	import Modal from '$lib/components/Modal.svelte';
	import { saveAs } from '$lib/utils';

	export let form: ActionData;

	let date = new Date().toLocaleDateString('en-CA', {
		year: 'numeric',
		month: '2-digit',
		timeZone: 'Asia/Manila'
	});

	let reports = [
		{
			name: 'Individual Report on Children In Conflict With The Law, Women, Torture, Rape Case, and Other Specific Mandates',
			action: 'http://example.com/individual_report'
		},
		{
			name: 'Brgy. Service Day Outreach Program',
			action: 'http://example.com/service_day_outreach'
		},
		{
			name: 'Precinct/Jail Visitation Report',
			action: 'http://example.com/precinct_visitation'
		},
		{
			name: 'Report on Victim’s Cases Handled',
			action: 'http://example.com/victims_report'
		},
		{
			name: 'Report on The Rendition of Free Legal Assistance To Children In Conflict With The Law',
			action: 'http://example.com/legal_assistance_report'
		},
		{
			name: 'Report on The Assistance of Detainees In The Execution of Waiver/Manifestation In Relation to R.A. 10592',
			action: 'http://example.com/detainee_assistance_report'
		},
		{
			name: 'Report on Clients Assisted on Drug Cases (Involving Voluntary Submission For Confinement And Rehabilitation)',
			action: 'http://example.com/drug_assistance_report'
		},
		{
			name: 'Monthly Report on Legal Assistance Extended To Taiwanese Nationals',
			action: 'http://example.com/monthly_taiwanese_report'
		},
		{
			name: 'Monthly Inventory of Clients Served',
			action: 'http://example.com/monthly_clients_inventory'
		},
		{
			name: 'Monthly Report on Legal Assistance Extended To Non-Filipino Citizens',
			action: 'http://example.com/monthly_non_filipino_report'
		},
		{
			name: 'Monthly Inventory of Cases',
			action: 'http://example.com/monthly_cases_inventory'
		},
		{
			name: 'Monthly Report on Persons With Disability (PWD)',
			action: 'http://example.com/monthly_pwd_report'
		},
		{
			name: 'Report on Documents Notarized/Oaths Administered',
			action: 'http://example.com/notarized_documents_report'
		},
		{
			name: 'Report on Documents Notarized/Oaths Administered For Philippines Statistic Authority (Census)',
			action: 'http://example.com/notarized_census_report'
		},
		{
			name: 'For Philippines Statistic Authority (Census) For Pao Legal Assistance',
			action: 'http://example.com/census_pao_legal_report'
		},
		{
			name: 'Consolidated List of Clients Who Benefitted From R.A. 10951',
			action: 'http://example.com/ra_10951_clients_list'
		},
		{
			name: 'Consolidated Gender-Related Cases Handled',
			action: 'http://example.com/gender_related_cases'
		},
		{
			name: 'Deadline For Action on Cases / Assignment Monthly Report',
			action: 'http://example.com/deadline_monthly_report'
		},
		{
			name: 'Individual Report on Status of Special And Appealed Cases',
			action: 'http://example.com/special_appealed_cases_report'
		},
		{
			name: 'Individual Performance Report',
			action: 'http://example.com/individual_performance_report'
		},
		{
			name: 'List of Favorable Decisions/Dispositions',
			action: 'http://example.com/favorable_decisions_list'
		},
		{
			name: 'List of Detainees Represented In Court',
			action: 'http://example.com/detainees_represented_report'
		},
		{
			name: 'List of Assisted Law Enforcement officers Who Were Sued In The Performance of Their Duties Involving Drug Related Cases',
			action: 'http://example.com/assisted_law_enforcement_report'
		},
		{
			name: 'Year-End Inventory of Cases',
			action: 'http://example.com/year_end_cases_inventory'
		},
		{
			name: 'Year End Inventory of Clients Served',
			action: 'http://example.com/year_end_clients_inventory'
		},
		{
			name: 'Innovation Report',
			action: 'http://example.com/innovation_report'
		},
		{
			name: 'Age And Sex Disaggregated Report on Released Pdls',
			action: 'http://example.com/age_sex_disaggregated_report'
		},
		{
			name: 'Consolidated Report',
			action: 'http://example.com/consolidated_report'
		},
		{
			name: 'On Legal Assistance Rendered To Former Rebels (FRS) And Former Violent Extremists (FVES)',
			action: 'http://example.com/legal_assistance_former_rebels'
		},
		{
			name: 'Summary Report on Legal Outreach Activities Related To Illegal Drugs And Gad',
			action: 'http://example.com/summary_legal_outreach_report'
		},
		{
			name: 'Report on Home Visit',
			action: 'http://example.com/home_visit_report'
		},
		{
			name: 'Consolidated Report on Clients Assisted on Drug Cases (Involving Voluntary Submission For Confinement And Rehabilitation)',
			action: 'http://example.com/consolidated_drug_assistance_report'
		}
	];
</script>

{#if form?.success && form?.report}
	<Modal
		title="Report Generated!"
		message="Reports have been successfully generated."
		success={() => {
			saveAs(form?.report, 'Monthly Report.xlsx');
			close();
		}}
	/>
{/if}

<main
	class="h-screen w-full py-12 p-6 lg:p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence lg:overflow-y-hidden"
>
	<form method="POST">
		<div class="flex items-center justify-between">
			<div class="pl-6 lg:pl-0 mb-4">
				<h2 class="font-bold mb-2">Reports</h2>
				<span class="font-bold">Generate reports here.</span> After generation, reports will be automatically
				downloaded.
			</div>
			<span class="flex flex-col text-sm items-end justify-center gap-2">
				<span>You are viewing reports for: </span>
				<input
					bind:value={date}
					type="month"
					name="month"
					id="month"
					required
					class="p-2 font-bold rounded-lg border border-2 border-diligence bg-transparent text-sm"
				/>
			</span>
		</div>
		<div class="flex flex-col gap-4">
			<!-- {#await}
			<div><Loading /></div>
		{:then} -->
			<div class="flex flex-col gap-4 lg:col-span-7 col-span-10 p-2 pt-0">
				<div
					class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
				>
					<div class="flex items-center justify-between px-6">
						<h4 class="font-bold text-equity">Reports</h4>
					</div>
					{#if reports.length === 0}
						<p>No reports found.</p>
					{:else}
						<table class="text-left w-full">
							<thead class="w-full">
								<tr class=" px-6 flex w-full border border-0 border-t border-innocence">
									<th class="p-3 w-5/6">Name</th>
									<th class="p-3 w-1/6"></th>
								</tr>
							</thead>
							<tbody class="text-sm flex flex-col overflow-y-scroll w-full h-72">
								{#each reports as report}
									<tr
										class="h-auto px-6 flex w-full hover:bg-oath border border-0 border-b border-t border-innocence"
									>
										<td class="p-3 w-5/6">
											<span class="hidden sm:block text-balance">{report.name}</span>
										</td>
										<td class="w-1/6 flex items-center justify-center gap-2">
											<form method="POST" action={report.action}>
												<input type="hidden" name="month" value={date} />
												<button class="flex items-center gap-2 px-2 lg:px-4">
													<SvgIcon
														size="15px"
														type="mdi"
														path={mdiFileDownloadOutline}
														class="lg:w-15"
													/>
													<span class="hidden lg:block">Generate</span>
												</button>
											</form>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
					<div class="flex gap-4 px-6">
						<button class="bg-trust" type="submit">Download All Reports</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</main>
