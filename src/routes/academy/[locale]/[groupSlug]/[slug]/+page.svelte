<script lang="ts">
	export let data;
</script>

<div class="prose max-w-none">
	<svelte:component this={data.content} />
</div>
