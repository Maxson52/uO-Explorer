<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		id: string;
		isDrawerOpen: boolean;
		optionSnippet: Snippet;
		overlaySnippet: Snippet;
	};
	let { id, isDrawerOpen, optionSnippet, overlaySnippet }: Props = $props();
</script>

<div class="drawer drawer-end z-[501]">
	<input {id} type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />
	<div class="drawer-content"></div>
	<div class="drawer-side">
		{@render overlaySnippet()}
		<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			{@render optionSnippet()}
		</ul>
	</div>
</div>
