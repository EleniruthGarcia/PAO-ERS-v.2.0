<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getFlash, updateFlash } from 'sveltekit-flash-message';

	const flash = getFlash(page);
	$flash = { type: 'error', message: $page.error?.message || 'An error occurred' };
	updateFlash(page, () => goto('/'));
</script>
