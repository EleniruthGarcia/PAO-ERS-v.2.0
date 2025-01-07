<script lang="ts" context="module">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	type T = Record<string, unknown>;
	type U = unknown;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import { intProxy } from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input';

	export let form: SuperForm<T>;
	export let name: U;

	const proxy = intProxy(form, name, { empty: 'undefined' });
</script>

<Input bind:value={$proxy} type="number" {...$$restProps} />
