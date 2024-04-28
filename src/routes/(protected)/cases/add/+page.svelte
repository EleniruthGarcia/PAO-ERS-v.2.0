<script lang="ts">
	import type { PageServerData } from './$types';
	import CaseForm from '$lib/components/forms/CaseForm.svelte';

	export let data: PageServerData;
</script>

<CaseForm data={data.form} />
