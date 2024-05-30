<script lang="ts">
	import { DotsHorizontal } from 'svelte-radix';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	export let id: string;
	export let status: string;
</script>

<AlertDialog.Root>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
				<DotsHorizontal class="h-3.5 w-3.5" />
				<span class="sr-only">More</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item href="/requests/{id}/edit">Edit</DropdownMenu.Item>
			<!-- <DropdownMenu.Item href="/requests/{id}/export">Export</DropdownMenu.Item> -->
			<DropdownMenu.Separator />
			<AlertDialog.Trigger class="w-full">
				<DropdownMenu.Item>{status === 'Archived' ? 'Restore' : 'Delete'}</DropdownMenu.Item>
			</AlertDialog.Trigger>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{status === 'Archived' ? 'Restore' : 'Delete'} Request</AlertDialog.Title>
			<AlertDialog.Description>
				Are you absolutely sure? The request will be {status === 'Archived' ? 'restored' : 'archived'}.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel class="mt-2">Cancel</AlertDialog.Cancel>
			<form action="/requests/{id}/{status === 'Archived' ? 'restore' : 'delete'}" method="POST">
				<AlertDialog.Action type="submit" class="w-full bg-destructive hover:bg-destructive/90">
					{status === 'Archived' ? 'Restore' : 'Delete'}
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
