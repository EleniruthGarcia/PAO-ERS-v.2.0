<script lang="ts">
	import { HamburgerMenu } from 'svelte-radix';
	import NightToggle from '$lib/components/night-toggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex h-14 max-w-screen-2xl items-center">
		<div class="mr-4 hidden md:flex">
			<a href="/" class="mr-6 flex items-center space-x-2">
				<img src="/favicon.png" alt="PAO-ERS Logo" class="h-6 w-6" />
				<span class="hidden font-bold sm:inline-block">PAO-ERS</span>
			</a>
			<nav class="flex items-center gap-6 text-sm">
				<a href="/dashboard" class="text-foreground/60 transition-colors hover:text-foreground/80">
					Dashboard
				</a>
				<a
					href="https://pao.gov.ph/"
					target="blank"
					rel="noopener noreferrer"
					class="text-foreground/60 transition-colors hover:text-foreground/80"
				>
					Official Website
				</a>
			</nav>
		</div>
		<button
			class="mr-2 inline-flex h-9 items-center justify-center gap-6 whitespace-nowrap rounded-md px-0 py-2 text-base font-medium transition-colors hover:bg-transparent hover:text-accent-foreground focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 md:hidden"
		>
			<HamburgerMenu />
			<a href="/" class="mr-6 flex items-center space-x-2">
				<span class="font-bold">PAO-ERS</span>
			</a>
		</button>
		<div class="flex flex-1 items-center justify-end space-x-2">
			<NightToggle />
			<Button href="/login">Log In</Button>
		</div>
	</div>
</header>

<slot />
