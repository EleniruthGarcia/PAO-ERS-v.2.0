<script lang="ts">
	import type { Document } from 'mongodb';
	import { readable } from 'svelte/store';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import { createTable, createRender, Render, Subscribe } from 'svelte-headless-table';

	import { CaretSort, ChevronDown } from 'svelte-radix';

	import DataTableActions from './data-table-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';

	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { getContext, onDestroy, onMount } from 'svelte';

	export let data: Document[];

	const table = createTable(readable(data), {
		page: addPagination(),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});

	export let columns = table.createColumns([
		table.column({
			accessor: '_id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				filter: { exclude: true },
				sort: { disable: true }
			}
		}),
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'age',
			header: 'Age'
		}),
		table.column({
			accessor: 'address',
			header: 'Address'
		}),
		table.column({
			accessor: ({ _id }) => _id,
			header: '',
			cell: ({ value, row }) =>
				createRender(DataTableActions, { id: value ?? '', status: row.original.currentStatus }),
			plugins: {
				filter: { exclude: true },
				sort: { disable: true }
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { hiddenColumnIds } = pluginStates.hide;
	let { filterValue } = pluginStates.filter;
	let { selectedDataIds } = pluginStates.select;

	const selectedData = getContext('selectedClients');
	$: selectedData.set(data.filter((_, i) => $selectedDataIds[i]));

	export const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	let hidableCols = flatColumns
		.filter((col) => col.id !== '_id' && col.id !== '')
		.map((col) => col.id);

	let smBreakpoint = 640;

	function updateHiddenColumns() {
		hideForId = Object.fromEntries(ids.map((id) => [id, true]));
		if (window.innerWidth < smBreakpoint) {
			hideForId = Object.fromEntries(ids.map((id) => [id, id === 'name' || id === '_id']));
		}
		$hiddenColumnIds = Object.entries(hideForId)
			.filter(([, hide]) => !hide)
			.map(([id]) => id);
	}

	onMount(() => {
		$pageRows = $pageRows.reverse();
		updateHiddenColumns();
		window.addEventListener('resize', updateHiddenColumns);
	});

	onDestroy(() => {
		window.removeEventListener('resize', updateHiddenColumns);
	});
</script>

<div>
	<div class="flex items-center py-4">
		<Input class="max-w-sm" placeholder="Search..." type="text" bind:value={$filterValue} />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" class="ml-auto" builders={[builder]}>
					Columns <ChevronDown class="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#each flatColumns as col}
					{#if hidableCols.includes(col.id)}
						<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
							{col.header}
						</DropdownMenu.CheckboxItem>
					{/if}
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
										{#if !props.sort.disabled && cell.id !== 'name'}
											<div class="text-center font-medium">
												<Button variant="ghost" on:click={props.sort.toggle}>
													<Render of={cell.render()} />
													<CaretSort class={'ml-2 h-4 w-4'} />
												</Button>
											</div>
										{:else if cell.id === 'name'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<CaretSort class={'ml-2 h-4 w-4'} />
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs} class="[&:has([role=checkbox])]:pl-3">
										{#if cell.id === 'name'}
											<Button
												class="text-left font-medium text-foreground"
												variant="link"
												href="/clients/{row.original._id}"
											>
												<Render of={cell.render()} />
											</Button>
										{:else if cell.id === 'age' || cell.id === 'address'}
											<div class="text-center">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}
		>
			Previous
		</Button>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}
		>
			Next
		</Button>
	</div>
</div>
