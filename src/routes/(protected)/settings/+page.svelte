<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary dependencies and components.
	import type { PageServerData } from './$types';
	import SettingsForm from '$lib/components/forms/SettingsForm.svelte';

	export let data: PageServerData;
</script>

<SettingsForm data={data.form} />
