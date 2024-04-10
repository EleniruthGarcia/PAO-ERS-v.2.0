<script lang="ts">
	import type { PageServerData } from './$types';
	import UserForm from '$lib/components/forms/UserForm.svelte';

	export let data: PageServerData;
</script>

<UserForm data={data.form} />
