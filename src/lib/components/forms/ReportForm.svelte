<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from '$lib/schema/report';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="grid gap-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Generate Report</Card.Title>
			<Card.Description>Generate monthly reports.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="month" class="grid gap-2">
				<Form.Control let:attrs>
					<Form.Label>Month</Form.Label>
					<Input {...attrs} bind:value={$formData.month} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="year" class="gap=2 grid">
				<Form.Control let:attrs>
					<Form.Label>Year</Form.Label>
					<Input {...attrs} bind:value={$formData.year} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="notedBy" class="gap=2 grid">
				<Form.Control let:attrs>
					<Form.Label>Noted By</Form.Label>
					<Input {...attrs} bind:value={$formData.notedBy} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button type="submit" class="w-full">Generate Report</Form.Button>
		</Card.Footer>
	</Card.Root>
</form>
