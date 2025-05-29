<!-- Public Attorney's Office - Electronic Records System
Creators: Daniel David Bador, Jude Gatchalian, Rance Bobadilla, and Lance Rimando -->

<script lang="ts">
	// Import all necessary dependencies and components.
	import { save } from '$lib/utils';
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';
	import ReportForm from '$lib/components/forms/ReportForm.svelte';

	export let data: PageServerData;

	$: $page.form?.report && save($page.form?.report);
</script>

<ReportForm data={data.form} />
