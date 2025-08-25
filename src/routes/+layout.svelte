<script lang="ts">
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import { t } from 'svelte-i18n';
	let {
		children
	}: {
		children: Snippet;
		data: any[];
	} = $props();

	// handle splash
	onMount(() => {
		const splash = document.getElementById('splash');
		if (splash) {
			splash.classList.add('exit');
			setTimeout(() => splash.remove(), 900);
		}
	});
</script>

<svelte:head>
	<title>{$t('site_name')}</title>
</svelte:head>
{@render children()}
