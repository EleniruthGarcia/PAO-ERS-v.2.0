<script lang="ts">
	import { page } from '$app/stores';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	$: open = false;
</script>

<Breadcrumb.Root class="hidden md:flex">
	<Breadcrumb.List>
		{#if $page.data.breadcrumbs && $page.data.breadcrumbs.length > 0}
			{#each $page.data.breadcrumbs as { text, href }, i}
				{#if i === $page.data.breadcrumbs.length - 1}
					{#if i !== 0}
						<Breadcrumb.Separator />
					{/if}
					<Breadcrumb.Page>
						<Breadcrumb.Link {href}>
							{text}
						</Breadcrumb.Link>
					</Breadcrumb.Page>
				{:else if i > 0}
					{#if i === 1}
						<Breadcrumb.Separator class="flex xl:hidden" />
						<DropdownMenu.Root bind:open>
							<DropdownMenu.Trigger
								class="flex items-center gap-1 xl:hidden"
								aria-label="Toggle menu"
							>
								<Breadcrumb.Ellipsis class="h-4 w-4" />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="start">
								{#each $page.data.breadcrumbs.slice(1, -1) as { text, href }, _}
									<DropdownMenu.Item href={href ? href : '#'}>
										{text}
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/if}

					<Breadcrumb.Separator class="hidden xl:flex" />
					<Breadcrumb.Item class="hidden xl:flex">
						<Breadcrumb.Link {href}>
							{text}
						</Breadcrumb.Link>
					</Breadcrumb.Item>
				{:else}
					<Breadcrumb.Item>
						<Breadcrumb.Link {href}>
							{text}
						</Breadcrumb.Link>
					</Breadcrumb.Item>
				{/if}
			{/each}
		{/if}
	</Breadcrumb.List>
</Breadcrumb.Root>
