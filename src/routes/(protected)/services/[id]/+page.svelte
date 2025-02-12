<script lang="ts">
	import type { PageServerData } from './$types';
	import { ChevronLeft, Copy, DotsVertical } from 'svelte-radix';

	import { toast } from 'svelte-sonner';

	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import { otherNature } from '$lib/schema/service';

	import * as Table from '$lib/components/ui/table';
	import { PageEmbeddingMismatchedContextError } from 'pdf-lib';

	export let data: PageServerData;
</script>

<main class="grid gap-4 md:grid-cols-2">
	<div class="flex items-center gap-4 md:col-span-2">
		<Button variant="outline" size="icon" class="h-7 w-7" on:click={() => history.back()}>
			<ChevronLeft class="h-4 w-4" />
			<span class="sr-only">Back</span>
		</Button>
		<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
			View Service
		</h1>
		<!-- <Badge class="ml-auto sm:ml-0">In stock</Badge> -->
		<div class="ml-auto hidden items-center gap-1 md:flex">
			<Button
				size="sm"
				variant="outline"
				class="h-7 gap-1 text-sm"
				href="/services/{data.service._id}/edit"
			>
				Edit
			</Button>
			<Button size="sm" class="h-7 gap-1 text-sm" href="/services/{data.service._id}/export"
				>Export</Button
			>
			<AlertDialog.Root>
				<AlertDialog.Trigger>
					<Button size="sm" variant="destructive" class="h-7 gap-1 bg-destructive text-sm">
						{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
					</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>
							{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'} Service
						</AlertDialog.Title>
						<AlertDialog.Description>
							Are you absolutely sure? The service will be
							{data.service.status?.at(-1)?.type === 'Archived' ? 'restored' : 'archived'}.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
						<form
							method="POST"
							action="/services/{data.service._id}/{data.service.status?.at(-1)?.type === 'Archived'
								? 'restore'
								: 'delete'}"
						>
							<AlertDialog.Action
								type="submit"
								class="w-full bg-destructive hover:bg-destructive/90"
							>
								{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
							</AlertDialog.Action>
						</form>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
		<div class="visible ml-auto flex items-center gap-1 md:hidden">
			<AlertDialog.Root>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
							<DotsVertical class="h-3.5 w-3.5" />
							<span class="sr-only">More</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item href="/services/{data.service._id}/edit">Edit</DropdownMenu.Item>
						<DropdownMenu.Item href="/services/{data.service._id}/export">Export</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<AlertDialog.Trigger class="w-full text-left">
							<DropdownMenu.Item>
								{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
							</DropdownMenu.Item>
						</AlertDialog.Trigger>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>
							{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'} Service
						</AlertDialog.Title>
						<AlertDialog.Description>
							Are you absolutely sure? The service will be
							{data.service.status?.at(-1)?.type === 'Archived' ? 'restored' : 'archived'}.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
						<form
							method="POST"
							action="/services/{data.service._id}/{data.service.status?.at(-1)?.type === 'Archived'
								? 'restore'
								: 'delete'}"
						>
							<AlertDialog.Action
								type="submit"
								class="w-full bg-destructive hover:bg-destructive/90"
							>
								{data.service.status?.at(-1)?.type === 'Archived' ? 'Restore' : 'Delete'}
							</AlertDialog.Action>
						</form>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</div>
	<div class="grid auto-rows-max items-start gap-4">
		<Card.Root class="overflow-hidden">
			<Card.Header class="flex flex-row items-start bg-muted/50">
				<div class="grid gap-0.5">
					<Card.Title class="group flex items-center gap-2 text-lg">
						<Button
							variant="link"
							class="p-0 text-lg text-foreground"
							href="/services/{data.service._id}"
						>
							{data.service.nature.includes('Barangay Outreach')
								? data.service.barangay
								: data.client.length > 1
									? data.client.length > 2
										? `${data.client[0].lastName} et al.`
										: `${data.client[0].lastName} and ${data.client[1].lastName}`
									: data.client[0].name}
						</Button>
						<Button
							size="icon"
							variant="outline"
							class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
							on:click={() =>
								navigator.clipboard
									.writeText(data.service._id)
									.then(() => toast(`Copied data.service ID '${data.service._id}'!`))}
						>
							<Copy class="h-3 w-3" />
							<span class="sr-only">Copy Case ID</span>
						</Button>
					</Card.Title>
					<Card.Description>
						<Badge variant="outline" class="mr-2">{data.service.typeOfService}</Badge> ID: {data
							.service._id}
						<!-- {data.client.length > 1
							? data.client.length > 2
								? `${data.client[0].lastName} et. al.`
								: `${data.client[0].lastName} and ${data.client[1].lastName}`
							: data.client[0].name} -->
					</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="p-6 text-sm">
				{#if data.service.client.length > 0}
					<div>
						<div class="mb-3 font-semibold">Nature of Service</div>
						{#each [...data.service.nature, ...(data.service.otherNature ?? [])] as nature}
							<Badge class="m-1">{nature}</Badge>
						{/each}
					</div>
					<Separator class="my-4" />
					<div class="grid gap-3">
						<div class="font-semibold">Interviewee Information</div>
						<ul class="grid gap-3">
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Interviewee</span>
								<span>
									<Button
										variant="link"
										class="m-0 h-auto p-0 text-foreground underline-offset-auto"
										href="/clients/{data.service.interviewee._id}"
									>
										{data.service.interviewee.name ?? 'N/A'}
									</Button>
								</span>
							</li>
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Relationship to Client</span>
								<span>{data.service.relationshipToClient ?? 'N/A'}</span>
							</li>
						</ul>
					</div>
					<Separator class="my-4" />
					<div class="grid gap-3">
						<div class="font-semibold">Lawyer Information</div>
						<ul class="grid gap-3">
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Lawyer</span>
								<span>{data.service.lawyer.name ?? 'N/A'}</span>
							</li>
						</ul>
					</div>
					{#if data.service.nature.includes('Administration of Oath')}
						<Separator class="my-4" />
						<div class="grid gap-3">
							<div class="font-semibold">Oath Information</div>
							<ul class="grid gap-3">
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Witness</span>
									<span>{data.service.witness ?? 'N/A'}</span>
								</li>
								<li class="flex items-start justify-between gap-2 truncate">
									<span class="text-muted-foreground">Nature of Instrument</span>
									<div class="grid gap-1">
										{#each data.service.natureOfInstrument as instrument}
											<span class="text-right">{instrument ?? 'N/A'}</span>
										{/each}
									</div>
								</li>
							</ul>
						</div>
					{/if}
					{#if data.service.nature.includes('Inquest Legal Assistance')}
						<Separator class="my-4" />
						<div class="grid gap-3">
							<div class="font-semibold">Inquest Information</div>
							<ul class="grid gap-3">
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Type</span>
									<span>{data.service.typeOfAssistance ?? 'N/A'}</span>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Off-Hours Inquest</span>
									<span>{data.service.duringOffice ? 'Yes' : 'No'}</span>
								</li>
							</ul>
						</div>
					{/if}
					{#if data.service.nature.includes('Jail Visitation')}
						<Separator class="my-4" />
						<div class="grid gap-3">
							<div class="font-semibold">Jail Visitation Information</div>
							<ul class="grid gap-3">
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Case</span>
									<span>{data.service.case_id ?? 'N/A'}</span>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Date of Visitation</span>
									<span>{data.service.dateOfVisit.toDateString() ?? 'N/A'}</span>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Type</span>
									<span>{data.service.typeOfRelease ?? 'N/A'}</span>
								</li>
							</ul>
						</div>
						<Separator class="my-4" />
						<div class="grid gap-3">
							<div class="font-semibold">Recommendation</div>
							<span>{data.service.recommendation ?? 'N/A'}</span>
						</div>
					{/if}
					{#if data.service.nature.includes('Legal Advice')}
						<Separator class="my-4" />
						<div class="grid gap-3">
							<div class="font-semibold">Advice Information</div>
							<ul class="grid gap-3">
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Mode of Legal Advice</span>
									<span>{data.service.legalAdviceMode ?? 'N/A'}</span>
								</li>
							</ul>
						</div>
					{/if}
					{#if data.service.nature.includes('Mediation or Conciliation')}
						<Separator class="my-4" />
						<div class="grid gap-3">
							<div class="font-semibold">Mediation Information</div>
							<ul class="grid gap-3">
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Termination Condition</span>
									<span>{data.service.terminationMediaCon ?? 'N/A'}</span>
								</li>
								<li class="flex items-start justify-between gap-2 truncate">
									<span class="text-muted-foreground">Mediation Dates</span>
									<div class="grid gap-1">
										{#each data.service.mediationDates as medDate}
											<span class="text-right">{medDate.toDateString() ?? 'N/A'}</span>
										{/each}
									</div>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Settlement Date</span>
									<span>{data.service.settlementDate.toDateString() ?? 'N/A'}</span>
								</li>
							</ul>
						</div>
					{/if}
				{/if}
				{#if data.service.barangay}
					<div class="grid gap-3">
						<div class="font-semibold">Barangay Information</div>
						<ul class="grid gap-3">
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Barangay</span>
								<span>{data.service.barangay ?? 'N/A'}</span>
							</li>
						</ul>
					</div>
					<Separator class="my-4" />
					<div class="grid gap-3">
						<div class="font-semibold">Problems Presented</div>
						<span>{data.service.problemsPresented ?? 'N/A'}</span>
					</div>
					<Separator class="my-4" />
					<div class="grid gap-3">
						<div class="font-semibold">Activities Undertaken</div>
						<span>{data.service.activitiesUndertaken ?? 'N/A'}</span>
					</div>
				{/if}
			</Card.Content>
			<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div class="text-xs text-muted-foreground">
					Updated <time>
						{data.service.status[data.service.status.length - 1].date.toLocaleString()}
					</time>
				</div>
			</Card.Footer>
		</Card.Root>
		{#if data.service.additionalNotes}
			<Card.Root class="overflow-hidden">
				<Card.Header class="flex flex-row items-start bg-muted/50">
					<div class="grid gap-0.5">
						<Card.Title class="text-md group flex items-center gap-2">Notes</Card.Title>
					</div>
				</Card.Header>
				<Card.Content class="p-6 text-sm">
					<div class="grid gap-3">
						<span>{data.service.additionalNotes}</span>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
	<div>
		<Card.Root class="overflow-hidden">
			<Card.Header class="flex flex-row items-start bg-muted/50">
				<div class="grid gap-0.5">
					<Card.Title class="text-md group flex items-center gap-2">Client List</Card.Title>
					<Card.Description>All clients connected to this service are shown here. The list contains <span class="font-bold">{data.client.length > 0 ? data.client.length : data.service.beneficiary.length}</span> client(s).</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="p-6 text-sm">
				{#if data.client.length > 0}
					{#each data.client as client, i}
						<div class="grid gap-3">
							<ul class="grid gap-3">
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Name</span>
									<span>
										<Button
											variant="link"
											class="m-0 h-auto p-0 text-foreground underline-offset-auto"
											href="/clients/{client._id}"
										>
											{client.name ?? 'N/A'}
										</Button>
									</span>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Age</span>
									<span>{client.age ?? 'N/A'}</span>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Sex</span>
									<span>{client.sex ?? 'N/A'}</span>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Civil Status</span>
									<span>{client.civilStatus ?? 'N/A'}</span>
								</li>
							</ul>
						</div>
						{#if data.client.length - 1 !== i}
							<Separator class="my-4" />
						{/if}
					{/each}
				{:else}
				<div class="max-h-[23.5rem] overflow-y-scroll">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Name</Table.Head>
								<Table.Head>Age</Table.Head>
								<Table.Head>Sex</Table.Head>
								<Table.Head>Ethnicity</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body class="overflow-y-scroll">
							{#each data.service.beneficiary as client}
								<Table.Row>
									<Table.Cell class="font-medium">{client.name}</Table.Cell>
									<Table.Cell>{client.age}</Table.Cell>
									<Table.Cell>{client.sex === 'Male' ? 'M' : 'F'}</Table.Cell>
									<Table.Cell>{client.ethnicity}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
					</div>
					<!-- {#each data.service.beneficiary as client, i}
						<div class="grid gap-3">
							<ul class="grid gap-3">
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Name</span>
									<span>{client.name ?? 'N/A'}</span>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Age</span>
									<span>{client.age ?? 'N/A'}</span>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Sex</span>
									<span>{client.sex ?? 'N/A'}</span>
								</li>
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Ethnicity</span>
									<span>{client.ethnicity ?? 'N/A'}</span>
								</li>
							</ul>
						</div>
						{#if data.client.length - 1 !== i}
							<Separator class="my-4" />
						{/if}
					{/each} -->
				{/if}
			</Card.Content>
			<!-- <Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div class="text-xs text-muted-foreground">
					Updated <time dateTime="2023-11-23">November 23, 2023</time>
				</div>
			</Card.Footer> -->
		</Card.Root>
	</div>
</main>
