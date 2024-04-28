<script lang="ts">
	import clsx from 'clsx';

	import { page } from '$app/stores';

	export let link: {
		href: string;
		label: string;
	};

	const className = clsx(
		'transition-colors hover:text-foreground',
		$page.url.href.includes(link.href) ? 'text-foreground' : 'text-muted-foreground'
	);
</script>

<main>
	<a href={link.href} class={className}>{link.label}</a>
</main>
