<script lang="ts">
	import { page } from '$app/stores';
	import { ChevronLeft, ChevronRight, Copy, Person, DotsVertical } from 'svelte-radix';

	import { toast } from 'svelte-sonner';

	import Loading from '$lib/components/Loading.svelte';

	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Separator } from '$lib/components/ui/separator';

	import type { Writable } from 'svelte/store';
	import type { Case } from '$lib/schema';
	import { getContext } from 'svelte';

	const selectedCases = getContext<Writable<Case[]>>('selectedCases');

	$: i = 0;
	$: _case = $selectedCases[i];
</script>

<Card.Root class="overflow-hidden">
	<Card.Header class="flex flex-row items-start bg-muted/50">
		<div class="grid gap-0.5">
			<Card.Title class="group flex items-center gap-2 text-lg">
				<Button variant="link" class="p-0 text-lg text-foreground" href="/cases/{_case._id}">
					{_case.titleOfTheCase}
				</Button>
				{#if $selectedCases.length > 1}
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						on:click={() => (i > 0 ? i-- : (i = $selectedCases.length - 1))}
					>
						<ChevronLeft class="h-3 w-3" />
						<span class="sr-only">Previous Case</span>
					</Button>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						on:click={() => (i < $selectedCases.length - 1 ? i++ : (i = 0))}
					>
						<ChevronRight class="h-3 w-3" />
						<span class="sr-only">Next Case</span>
					</Button>
				{/if}
				<Button
					size="icon"
					variant="outline"
					class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
					on:click={() =>
						navigator.clipboard
							.writeText(_case._id)
							.then(() => toast(`Copied Client ID '${_case._id}'!`))}
				>
					<Copy class="h-3 w-3" />
					<span class="sr-only">Copy Client ID</span>
				</Button>
			</Card.Title>
			<Card.Description><Badge class="m-1">{_case.currentStatus}</Badge></Card.Description>
		</div>
		<div class="ml-auto flex items-center gap-1">
			<!-- <Button size="sm" variant="outline" class="h-8 gap-1">
					<Person class="h-3.5 w-3.5" />
					<span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"> Track Client </span>
				</Button> -->
			<AlertDialog.Root>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
							<DotsVertical class="h-3.5 w-3.5" />
							<span class="sr-only">More</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item href="/cases/{_case._id}/edit">Edit</DropdownMenu.Item>
						<DropdownMenu.Item href="/cases/{_case._id}/export">Export</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<AlertDialog.Trigger class="w-full">
							<DropdownMenu.Item>Delete</DropdownMenu.Item>
						</AlertDialog.Trigger>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Delete Case</AlertDialog.Title>
						<AlertDialog.Description>
							Are you absolutely sure? The case will be archived and will not show up in Active
							cases. If you want the client to be permanently deleted, please contact the
							administrator.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<form action="/cases/{_case._id}/delete" method="POST">
							<AlertDialog.Action type="submit" class="bg-destructive hover:bg-destructive/90"
								>Delete</AlertDialog.Action
							>
						</form>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</Card.Header>
	<Card.Content class="p-6 text-sm">
		<div class="grid gap-3">
			<div class="font-semibold">Case Information</div>
			<ul class="grid gap-3">
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground"> Nature </span>
					<span>{_case.natureOfTheCase}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground"> Specification </span>
					<span>{_case.caseSpecs}</span>
				</li>
			</ul>
		</div>
		<Separator class="my-4" />
		<div class="grid gap-3">
			<div class="font-semibold">Adverse Party's Information</div>
			<ul class="grid gap-3">
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground"> Name </span>
					<span>{_case.adversePartyName}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground"> Involvement </span>
					<span>{_case.adversePartyInvolvement}</span>
				</li>
				<li class="flex items-center justify-between gap-2 truncate">
					<span class="text-muted-foreground"> Address </span>
					<span>{_case.adversePartyAddress}</span>
				</li>
			</ul>
		</div>
		{#if _case.pendingInCourt}
			<Separator class="my-4" />
			<div class="grid gap-3">
				<div class="font-semibold">Court Information</div>
				<ul class="grid gap-3">
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground"> Case Title </span>
						<span>{_case.titleOfTheCase}</span>
					</li>
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground"> Docket No. </span>
						<span>{_case.docketNumber}</span>
					</li>
					<li class="flex items-center justify-between gap-2 truncate">
						<span class="text-muted-foreground"> Court </span>
						<span>{_case.court}</span>
					</li>
				</ul>
			</div>
		{/if}
	</Card.Content>
	<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
		<div class="text-xs text-muted-foreground">
			Updated <time dateTime="2023-11-23">November 23, 2023</time>
		</div>
		<Pagination.Root count={10} class="ml-auto mr-0 w-auto">
			<Pagination.Content>
				<Pagination.Item>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6"
						on:click={() => (i > 0 ? i-- : (i = $selectedCases.length - 1))}
					>
						<ChevronLeft class="h-3.5 w-3.5" />
						<span class="sr-only">Previous Case</span>
					</Button>
				</Pagination.Item>
				<Pagination.Item>
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6"
						on:click={() => (i < $selectedCases.length - 1 ? i++ : (i = 0))}
					>
						<ChevronRight class="h-3.5 w-3.5" />
						<span class="sr-only">Next Case</span>
					</Button>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	</Card.Footer>
</Card.Root>
