<script lang="ts">
	import { HamburgerMenu } from 'svelte-radix';
	import { Button } from '$lib/components/ui/button';
	import NightToggle from '$lib/components/NightToggle.svelte';
</script>

<header
	class="sticky top-0 z-50 w-full flex-none border-b border-border/40 bg-background/95 backdrop-blur [view-transition-name:navbar] supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex h-16 max-w-screen-2xl items-center">
		<div class="mr-4 hidden md:flex">
			<Button
				variant="link"
				href="/"
				class="mr-6 gap-3 font-semibold text-foreground decoration-transparent"
			>
				<img src="/favicon.png" alt="PAO-ERS Logo" class="h-6 w-6" />
				<span class="hidden font-bold sm:inline-block">PAO-ERS</span>
			</Button>
			<nav class="flex items-center gap-6 text-sm">
				<!-- <Button variant="ghost" href="/dashboard">Dashboard</Button>
				<Button
					variant="ghost"
					href="https://pao.gov.ph/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Official Website
				</Button> -->
			</nav>
		</div>
		<Button variant="ghost" class=" gap-6 md:hidden">
			<HamburgerMenu />
			<a href="/" class="mr-6 hidden items-center space-x-2 min-[420px]:flex">
				<span class="font-bold">PAO-ERS</span>
			</a>
		</Button>
		<div class="flex flex-1 items-center justify-end space-x-2">
			<Button href="/dashboard">Go to Dashboard</Button>
			<NightToggle />
		</div>
	</div>
</header>
