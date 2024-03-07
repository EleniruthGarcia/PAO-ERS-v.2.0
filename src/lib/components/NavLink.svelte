<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	export let title: string;
</script>

{#if href !== '/'}
	<a
		{href}
		class={($page.url.pathname?.startsWith(href) ? 'text-oath font-bold ' : '') +
			'flex hover:bg-equity p-4 py-2 pr-6 rounded-lg gap-4'}
	>
		<slot />
		<h4 class="hidden md:block">{title}</h4>
	</a>
{:else}
	<a
		{href}
		class={($page.url.pathname === href ? 'font-bold ' : '') +
			'flex hover:bg-equity p-4 py-2 pr-6 rounded-lg gap-4'}
	>
		<slot />
		<h4 class="hidden md:block">{title}</h4>
	</a>
{/if}
