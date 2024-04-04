<script lang="ts">
	import type { PageServerData } from './$types.js';
	import ReportForm from '$lib/components/forms/ReportForm.svelte';
	export let data: PageServerData;
</script>

<ReportForm data={data.form} />
