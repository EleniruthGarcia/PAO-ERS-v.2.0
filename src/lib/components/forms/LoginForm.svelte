<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from '$lib/schema/login';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import Loading from '$lib/components/Loading.svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<form method="POST" use:enhance class="grid gap-4">
	{#if $delayed}<Loading />{/if}
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your email below to login to your account.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="username" class="grid gap-2">
				<Form.Control let:attrs>
					<Form.Label>Username</Form.Label>
					<Input {...attrs} bind:value={$formData.username} autocomplete="username" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password" class="gap=2 grid">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input
						type="password"
						{...attrs}
						bind:value={$formData.password}
						autocomplete="current-password"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button type="submit" class="w-full">Log In</Form.Button>
		</Card.Footer>
	</Card.Root>
</form>
