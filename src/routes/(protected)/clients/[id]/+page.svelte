<script lang="ts">
	import type { PageServerData } from './$types';

	import { Button } from '$lib/components/ui/button';

	export let data: PageServerData;
</script>

<Button href="/clients/{data.client._id}/edit">Edit Client</Button>
<Button href="/clients/{data.client._id}/delete">Delete Client</Button>
<Button href="/clients/{data.client._id}/export">Export Interview Sheet</Button>
