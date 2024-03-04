<script lang="ts">
	export let value: string;
</script>

<option {value} {...$$restProps}>
	<slot />
</option>
