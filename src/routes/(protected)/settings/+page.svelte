<script lang="ts">
	import type { PageServerData } from './$types';
	import SettingsForm from '$lib/components/forms/SettingsForm.svelte';

	export let data: PageServerData;
</script>

<SettingsForm data={data.form} />
