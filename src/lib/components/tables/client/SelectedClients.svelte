<script lang="ts">
	import { page } from '$app/stores';
	import { ChevronLeft, ChevronRight, Copy, Person, DotsVertical } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Separator } from '$lib/components/ui/separator';

	import { getContext } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';

	const selectedClients = getContext('selectedData');

	$: i = 0;
	$: client = $selectedClients[i];
</script>

{#await $page.data.clients}
	<Loading />
{:then clients}
	<Card.Root class="overflow-hidden">
		<Card.Header class="flex flex-row items-start bg-muted/50">
			<div class="grid gap-0.5">
				<Card.Title class="group flex items-center gap-2 text-lg">
					{client.name}
					{#if $selectedClients.length > 1}
						<Button
							size="icon"
							variant="outline"
							class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
							on:click={() => (i > 0 ? i-- : (i = $selectedClients.length - 1))}
						>
							<ChevronLeft class="h-3 w-3" />
							<span class="sr-only">Previous Client</span>
						</Button>
						<Button
							size="icon"
							variant="outline"
							class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
							on:click={() => (i < $selectedClients.length - 1 ? i++ : (i = 0))}
						>
							<ChevronRight class="h-3 w-3" />
							<span class="sr-only">Next Client</span>
						</Button>
					{/if}
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<Copy class="h-3 w-3" />
						<span class="sr-only">Copy Order ID</span>
					</Button>
				</Card.Title>
				<Card.Description>Date: November 23, 2023</Card.Description>
			</div>
			<div class="ml-auto flex items-center gap-1">
				<Button size="sm" variant="outline" class="h-8 gap-1">
					<Person class="h-3.5 w-3.5" />
					<span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"> Track Client </span>
				</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
							<DotsVertical class="h-3.5 w-3.5" />
							<span class="sr-only">More</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item>Edit</DropdownMenu.Item>
						<DropdownMenu.Item>Export</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>Trash</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</Card.Header>
		<Card.Content class="p-6 text-sm">
			<div class="grid gap-3">
				<div class="font-semibold">Order Details</div>
				<ul class="grid gap-3">
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">
							Glimmer Lamps x <span>2</span>
						</span>
						<span>$250.00</span>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">
							Aqua Filters x <span>1</span>
						</span>
						<span>$49.00</span>
					</li>
				</ul>
				<Separator class="my-2" />
				<ul class="grid gap-3">
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">Subtotal</span>
						<span>$299.00</span>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">Shipping</span>
						<span>$5.00</span>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">Tax</span>
						<span>$25.00</span>
					</li>
					<li class="flex items-center justify-between font-semibold">
						<span class="text-muted-foreground">Total</span>
						<span>$329.00</span>
					</li>
				</ul>
			</div>
			<Separator class="my-4" />
			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-3">
					<div class="font-semibold">Shipping Information</div>
					<address class="grid gap-0.5 not-italic text-muted-foreground">
						<span>Liam Johnson</span>
						<span>1234 Main St.</span>
						<span>Anytown, CA 12345</span>
					</address>
				</div>
				<div class="grid auto-rows-max gap-3">
					<div class="font-semibold">Billing Information</div>
					<div class="text-muted-foreground">Same as shipping address</div>
				</div>
			</div>
			<Separator class="my-4" />
			<div class="grid gap-3">
				<div class="font-semibold">Customer Information</div>
				<dl class="grid gap-3">
					<div class="flex items-center justify-between">
						<dt class="text-muted-foreground">Customer</dt>
						<dd>Liam Johnson</dd>
					</div>
					<div class="flex items-center justify-between">
						<dt class="text-muted-foreground">Email</dt>
						<dd>
							<a href="mailto:">liam@acme.com</a>
						</dd>
					</div>
					<div class="flex items-center justify-between">
						<dt class="text-muted-foreground">Phone</dt>
						<dd>
							<a href="tel:">+1 234 567 890</a>
						</dd>
					</div>
				</dl>
			</div>
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
							on:click={() => (i > 0 ? i-- : (i = $selectedClients.length - 1))}
						>
							<ChevronLeft class="h-3.5 w-3.5" />
							<span class="sr-only">Previous Client</span>
						</Button>
					</Pagination.Item>
					<Pagination.Item>
						<Button
							size="icon"
							variant="outline"
							class="h-6 w-6"
							on:click={() => (i < $selectedClients.length - 1 ? i++ : (i = 0))}
						>
							<ChevronRight class="h-3.5 w-3.5" />
							<span class="sr-only">Next Client</span>
						</Button>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
		</Card.Footer>
	</Card.Root>
{/await}
