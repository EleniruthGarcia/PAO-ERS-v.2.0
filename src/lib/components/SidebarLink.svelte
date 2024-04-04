<script lang="ts">
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge';

	import { cn } from '$lib/utils';

	$: navLink = (href: string) =>
		cn(
			'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
			$page.url.pathname.startsWith(href) && 'bg-muted text-primary'
		);

	export let link: { href: string; label: string; icon: any };
	export let notificationCount = 0;
</script>

<main>
	<a href={link.href} class={navLink(link.href)}>
		<svelte:component this={link.icon} class="h-4 w-4" />
		<span class="hidden lg:block">
			{link.label}
		</span>
	</a>

	{#if notificationCount > 0}
		<Badge class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
			>{notificationCount}</Badge
		>
	{/if}
</main>
