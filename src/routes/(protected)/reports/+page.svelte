<script lang="ts">
	import { save } from '$lib/utils';
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';
	import ReportForm from '$lib/components/forms/ReportForm.svelte';

	export let data: PageServerData;

	$: $page.form?.report && save($page.form?.report);
</script>

<ReportForm data={data.form} />
