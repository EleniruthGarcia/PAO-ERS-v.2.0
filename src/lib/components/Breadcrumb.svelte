<script lang="ts">
	import { page } from '$app/stores';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
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
