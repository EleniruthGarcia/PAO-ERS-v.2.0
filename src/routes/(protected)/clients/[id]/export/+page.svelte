<script lang="ts">
	import type { PageServerData } from './$types';

	import { Button } from '$lib/components/ui/button';

	export let data: PageServerData;
</script>

<Button href="/clients/{data.client._id}/export/interview_sheet">Download Interview Sheet</Button>
<Button href="/clients/{data.client._id}/export/consent_form">Download Consent Form</Button>
