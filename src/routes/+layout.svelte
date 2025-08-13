<script lang="ts">
	import '../app.css';
	import { type Snippet } from 'svelte';
	import { t } from 'svelte-i18n';
	let {
		children
	}: {
		children: Snippet;
		data: any[];
	} = $props();
</script>

<svelte:head>
	<title>{$t('site_name')}</title>
</svelte:head>
{@render children()}
