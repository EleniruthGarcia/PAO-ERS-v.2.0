<script lang="ts" context="module">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	type T = Record<string, unknown>;
	type U = unknown;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import { dateProxy } from 'sveltekit-superforms';
	import DatePicker from '$lib/components/DatePicker.svelte';

	export let form: SuperForm<T>;
	export let name: U;

	const proxy = dateProxy(form, name, { format: 'date', empty: 'undefined' });
</script>

<DatePicker bind:value={$proxy} />
