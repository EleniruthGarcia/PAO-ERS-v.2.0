<script lang="ts">
	import { page } from '$app/stores';

	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';

	const initials = () => {
		const name = $page.data.username as string;
		const n = name.split(' ');

		if (n.length === 1) return n[0].slice(0, 2);

		return n[0][0] + n[-1][0];
	};

	let form: HTMLFormElement;
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button variant="outline" size="icon" class="overflow-hidden rounded-full" builders={[builder]}>
			<Avatar.Root>
				<Avatar.Fallback class="dark:bg-muted/30">{initials().toUpperCase()}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="rounded-xl sm:max-w-xs">
		<Sheet.Header>
			<div class="flex items-center gap-4 pr-5">
				<Avatar.Root>
					<Avatar.Fallback>{initials().toUpperCase()}</Avatar.Fallback>
				</Avatar.Root>
				<div class="grow">
					<Sheet.Title>
						{$page.data.username}
					</Sheet.Title>
					{#if $page.data.name}
						<Sheet.Description>
							{$page.data.name}
						</Sheet.Description>
					{/if}
				</div>
			</div>
		</Sheet.Header>
		<div class="grid gap-1 py-2">
			<Button variant="ghost" class="w-full items-start justify-start">My Account</Button>
			<Separator />
			<Button variant="ghost" class="w-full items-start justify-start">Settings</Button>
			<Button variant="ghost" class="w-full items-start justify-start">Support</Button>
			<Separator />
			<form bind:this={form} action="/logout" method="POST" />
			<Button
				variant="ghost"
				class="w-full items-start justify-start"
				on:click={() => form.submit()}>Logout</Button
			>
		</div>
	</Sheet.Content>
</Sheet.Root>
