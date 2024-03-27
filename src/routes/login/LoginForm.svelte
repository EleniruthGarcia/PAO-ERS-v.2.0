<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="grid gap-4">
	<Form.Field {form} name="username" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Username</Form.Label>
			<Input {...attrs} bind:value={$formData.username} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password" class="gap=2 grid">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input type="password" {...attrs} bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button type="submit" class="w-full">Log In</Form.Button>
</form>
