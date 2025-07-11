<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary dependencies and components.
	import type { PageServerData } from './$types';
	import { Copy, PlusCircled, DotsVertical } from 'svelte-radix';
	import { toast } from 'svelte-sonner';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';

	export let data: PageServerData;
</script>

<main class="grid gap-4 md:grid-cols-2">
	<!-- MAIN SERVICE INFORMATION
	Note that some information are conditional (if they exist). -->

	<div class="grid auto-rows-max items-start gap-4 md:gap-8">
		<Card.Root class="overflow-hidden">
			<Card.Header class="flex flex-row items-start bg-muted/50">
				<div class="grid gap-0.5">
					<Card.Title class="group flex items-center gap-2 text-lg">
						<Button
							variant="link"
							class="p-0 text-lg text-foreground"
							href="/clients/{data.client._id}"
						>
							{data.client.name}
						</Button>
						<Button
							size="icon"
							variant="outline"
							class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
							on:click={() =>
								navigator.clipboard
									.writeText(data.client._id)
									.then(() => toast(`Copied data.client ID '${data.client._id}'!`))}
						>
							<Copy class="h-3 w-3" />
							<span class="sr-only">Copy Client ID</span>
						</Button>
					</Card.Title>
					<Card.Description>ID: {data.client._id}</Card.Description>
				</div>
				<div class="invisible ml-auto flex items-center gap-1 md:visible">
					<Button
						size="sm"
						variant="outline"
						class="h-7 gap-1 text-sm"
						href="/clients/{data.client._id}/edit"
					>
						Edit
					</Button>
					<AlertDialog.Root>
						<AlertDialog.Trigger>
							<Button size="sm" variant="destructive" class="h-7 gap-1 bg-destructive text-sm">
								{data.client.currentStatus === 'Archived' ? 'Restore' : 'Delete'}
							</Button>
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>
									{data.client.currentStatus === 'Archived' ? 'Restore' : 'Delete'} Client
								</AlertDialog.Title>
								<AlertDialog.Description>
									Are you absolutely sure? The client will be {data.client.currentStatus ===
									'Archived'
										? 'restored'
										: 'archived'} and will {data.client.currentStatus === 'Archived' ? '' : 'not'} show
									up in Active Clients. If you want the client to be permanently deleted, please contact
									the administrator.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
								<form
									method="POST"
									action="/clients/{data.client._id}/{data.client.currentStatus === 'Archived'
										? 'restore'
										: 'delete'}"
								>
									<AlertDialog.Action
										type="submit"
										class="w-full bg-destructive hover:bg-destructive/90"
									>
										{data.client.currentStatus === 'Archived' ? 'Restore' : 'Delete'}
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
								<DropdownMenu.Item href="/clients/{data.client._id}/edit">Edit</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>
									<AlertDialog.Trigger class="w-full text-left">
										{data.client.currentStatus === 'Archived' ? 'Restore' : 'Delete'}
									</AlertDialog.Trigger>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>
									{data.client.currentStatus === 'Archived' ? 'Restore' : 'Delete'} Client
								</AlertDialog.Title>
								<AlertDialog.Description>
									Are you absolutely sure? The client will be {data.client.currentStatus ===
									'Archived'
										? 'restored'
										: 'archived'} and will {data.client.currentStatus === 'Archived' ? '' : 'not'} show
									up in Active Clients. If you want the client to be permanently deleted, please contact
									the administrator.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
								<form
									method="POST"
									action="/clients/{data.client._id}/{data.client.currentStatus === 'Archived'
										? 'restore'
										: 'delete'}"
								>
									<AlertDialog.Action
										type="submit"
										class="w-full bg-destructive hover:bg-destructive/90"
									>
										{data.client.currentStatus === 'Archived' ? 'Restore' : 'Delete'}
									</AlertDialog.Action>
								</form>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</div>
			</Card.Header>
			<Card.Content class="p-6 text-sm">
				<div class="grid gap-3">
					<div class="font-semibold">Personal Information</div>
					<ul class="grid gap-3">
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Age</span>
							<span>{data.client.age ?? 'N/A'}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Sex</span>
							<span>{data.client.sex ?? 'N/A'}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Civil Status</span>
							<span>{data.client.civilStatus ?? 'N/A'}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Citizenship</span>
							<span
								>{data.client.citizenship !== '' && data.client.citizenship
									? data.client.citizenship
									: 'N/A'}</span
							>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Language</span>
							<span
								>{data.client.language !== '' && data.client.language
									? data.client.language
									: 'N/A'}</span
							>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Religion</span>
							<span
								>{data.client.religion !== '' && data.client.religion
									? data.client.religion
									: 'N/A'}</span
							>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Educational Attainment</span>
							<span>{data.client.educationalAttainment ?? 'N/A'}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Individual Monthly Income</span>
							<span
								>{data.client.individualMonthlyIncome !== '' && data.client.individualMonthlyIncome
									? data.client.individualMonthlyIncome
									: 'N/A'}</span
							>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Proof of Indigency</span>
							<span
								>{data.client.proofOfIndigency !== '' && data.client.proofOfIndigency
									? data.client.proofOfIndigency
									: 'N/A'}</span
							>
						</li>
					</ul>
				</div>
				<Separator class="my-4" />
				<div class="grid gap-3">
					<div class="font-semibold">Contact Information</div>
					<ul class="grid gap-3">
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Address</span>
							<span>{data.client.address ?? 'N/A'}</span>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Email</span>
							<span
								>{data.client.email !== '' && data.client.email ? data.client.email : 'N/A'}</span
							>
						</li>
						<li class="flex items-center justify-between gap-2 truncate">
							<span class="text-muted-foreground">Contact Number</span>
							<span>{data.client.contactNumber ?? 'N/A'}</span>
						</li>
					</ul>
				</div>
				{#if data.client.civilStatus === 'Married'}
					<Separator class="my-4" />
					<div class="grid gap-3">
						<div class="font-semibold">Spouse Information</div>
						<ul class="grid gap-3">
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Name</span>
								<span>{data.client.spouseName ?? 'N/A'}</span>
							</li>
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Address</span>
								<span>{data.client.spouseAddress ?? 'N/A'}</span>
							</li>
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Email</span>
								<span>{data.client.spouseEmail ?? 'N/A'}</span>
							</li>
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Contact Number</span>
								<span>{data.client.spouseContactNumber ?? 'N/A'}</span>
							</li>
						</ul>
					</div>
				{/if}
				{#if data.client.detained}
					<Separator class="my-4" />
					<div class="grid gap-3">
						<div class="font-semibold">Detainee Information</div>
						<ul class="grid gap-3">
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Place of Detention</span>
								<span>{data.client.detainedAt ?? 'N/A'}</span>
							</li>
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Detained Since</span>
								<span>{data.client.detainedSince ?? 'N/A'}</span>
							</li>
						</ul>
					</div>
				{/if}
				{#if data.client.foreignNational || data.client.pwd || data.client.indigenousPeople || data.client.urbanPoor || data.client.ruralPoor}
					<Separator class="my-4" />
					<div class="grid gap-3">
						<div class="font-semibold">Special Classifications</div>
						<ul class="grid gap-3">
							{#if data.client.foreignNational}
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Foreign Nationality</span>
									<span>{data.client.foreignNational ?? 'N/A'}</span>
								</li>
							{/if}
							{#if data.client.pwd}
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Disability</span>
									<span>{data.client.pwd ?? 'N/A'}</span>
								</li>
							{/if}
							{#if data.client.indigenousPeople}
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Indigenous Group</span>
									<span>{data.client.indigenousPeople ?? 'N/A'}</span>
								</li>
							{/if}
							{#if data.client.lawEnforcer}
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Enforcer Rank</span>
									<span>{data.client.lawEnforcer ?? 'N/A'}</span>
								</li>
							{/if}
							{#if data.client.urbanPoor}
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Urban Poor</span>
									<span>{data.client.urbanPoor ?? 'N/A'}</span>
								</li>
							{/if}
							{#if data.client.ruralPoor}
								<li class="flex items-center justify-between gap-2 truncate">
									<span class="text-muted-foreground">Rural Poor</span>
									<span>{data.client.ruralPoor ?? 'N/A'}</span>
								</li>
							{/if}
						</ul>
					</div>
				{/if}
				{#if data.client.classification}
					<Separator class="my-4" />
					<div>
						<div class="mb-3 font-semibold">Classifications</div>
						{#each data.client.classification as classification}
							<Badge class="m-1">{classification ?? 'N/A'}</Badge>
						{/each}
					</div>
				{/if}
			</Card.Content>
			<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div class="text-xs text-muted-foreground">
					Updated <time>
						{data.client.status[data.client.status.length - 1].date.toLocaleString()}
					</time>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>

	<!-- CLIENT-RELATED SERVICES -->

	<div>
		<Card.Root class="overflow-hidden">
			<Card.Header class="flex flex-row items-start bg-muted/50">
				<div class="grid gap-0.5">
					<Card.Title class="text-md group flex items-center gap-2">Services</Card.Title>
					<Card.Description>All active services are shown here.</Card.Description>
				</div>
				<div class="ml-auto flex items-center gap-1">
					<form method="POST">
						<Button type="submit" size="sm" variant="outline" class="h-7 gap-2 text-sm">
							<PlusCircled class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only">Add</span>
						</Button>
					</form>
				</div>
			</Card.Header>
			<Card.Content class="p-6 text-sm">
				{#each data.services as service, i}
					<div class="grid gap-3">
						<ul class="grid gap-3">
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Nature</span>
								<span>{service.otherNature ? service.otherNature : service.nature}</span>
							</li>
							<li class="flex items-center justify-between gap-2 truncate">
								<span class="text-muted-foreground">Lawyer</span>
								<span>{service.lawyer.name}</span>
							</li>
						</ul>
					</div>
					{#if data.services.length - 1 !== i}
						<Separator class="my-4" />
					{/if}
				{/each}
			</Card.Content>
			<!-- This part has been commented out temporarily. The update time mechanism hasn't been implemented. -->
			<!-- <Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div class="text-xs text-muted-foreground">
					Updated <time>{data.services[0].status[data.services.status.length - 1].date.toLocaleString()}</time>
				</div>
			</Card.Footer> -->
		</Card.Root>
	</div>
</main>
