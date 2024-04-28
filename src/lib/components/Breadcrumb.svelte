<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	$: open = false;
	$: isDesktop = browser && window.innerWidth >= 1000;
</script>

<Breadcrumb.Root class="hidden md:flex">
	<Breadcrumb.List>
		{#if $page.data.breadcrumbs && $page.data.breadcrumbs.length > 0}
			{#each $page.data.breadcrumbs as { text, href }, i}
				{#if i !== 0}
					<Breadcrumb.Separator />
				{/if}
				{#if i === $page.data.breadcrumbs.length - 1}
					<Breadcrumb.Page>
						<Breadcrumb.Link {href}>
							{text}
						</Breadcrumb.Link>
					</Breadcrumb.Page>
				{:else if !isDesktop && i > 0}
					{#if i === 1}
						<DropdownMenu.Root bind:open>
							<DropdownMenu.Trigger class="flex items-center gap-1" aria-label="Toggle menu">
								<Breadcrumb.Ellipsis class="h-4 w-4" />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="start">
								{#each $page.data.breadcrumbs.slice(1, -1) as { text, href }, i}
									<DropdownMenu.Item href={href ? href : '#'}>
										{text}
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/if}
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
