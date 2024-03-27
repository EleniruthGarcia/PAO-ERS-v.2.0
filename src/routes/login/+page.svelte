<script lang="ts">
	import type { PageData } from './$types.js';
	import LoginForm from './LoginForm.svelte';
	export let data: PageData;
</script>

<LoginForm data={data.form} />
