<script lang="ts">
	import { page } from '$app/stores';

	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet';

	const { id, username, name, role } = $page.data.user ?? {};

	const initials = () => {
		const n = username.split(' ');

		if (n.length === 1) return n[0].slice(0, 2);

		return n[0][0] + n[-1][0];
	};
</script>

{#if id}
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button
				variant="outline"
				size="icon"
				class="overflow-hidden rounded-full"
				builders={[builder]}
			>
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
							{name}
						</Sheet.Title>
						<Sheet.Description>
							<span class="text-xs text-muted-foreground">ID: {id}</span>
							<Badge variant="outline" class="ml-1">{role}</Badge>
						</Sheet.Description>
					</div>
				</div>
			</Sheet.Header>
			<div class="grid gap-1 py-2">
				<Sheet.Close asChild let:builder>
					<!-- <Button variant="ghost" class="w-full items-start justify-start">My Account</Button>
				<Separator /> -->
					<Button
						variant="ghost"
						class="w-full items-start justify-start"
						href="/settings"
						builders={[builder]}>Settings</Button
					>
					<!-- <Button variant="ghost" class="w-full items-start justify-start" href="/" builders={[builder]}>Report Error</Button> -->
					<Separator />
					<form action="/logout" method="POST">
						<Form.Button variant="ghost" class="w-full items-start justify-start" type="submit"
							>Logout</Form.Button
						>
					</form>
				</Sheet.Close>
			</div>
		</Sheet.Content>
	</Sheet.Root>
{:else}
	<Button href="/login">Login</Button>
{/if}
