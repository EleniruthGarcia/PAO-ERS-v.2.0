<script lang="ts">
	import { Rows, Home, Person, Gear, FileText } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
			<Rows class="h-5 w-5" />
			<span class="sr-only">Toggle Menu</span>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="left" class="rounded-xl sm:max-w-xs">
		<nav class="grid gap-6 text-lg font-medium">
			<Sheet.Header>
				<Sheet.Title>
					<a
						href="/"
						class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
					>
						<img
							src="/favicon.png"
							alt="PAO Logo"
							class="h-9 w-9 transition-all group-hover:scale-110"
						/>
						<span class="sr-only">PAO-ERS</span>
					</a>
				</Sheet.Title>
			</Sheet.Header>
			<a
				href="##"
				class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
			>
				<Home class="h-5 w-5" />
				Dashboard
			</a>
			<a href="##" class="flex items-center gap-4 px-2.5 text-foreground">
				<Person class="h-5 w-5" />
				Clients
			</a>
			<a
				href="##"
				class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
			>
				<FileText class="h-5 w-5" />
				Reports
			</a>
			<a
				href="##"
				class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
			>
				<Gear class="h-5 w-5" />
				Settings
			</a>
		</nav>
	</Sheet.Content>
</Sheet.Root>
