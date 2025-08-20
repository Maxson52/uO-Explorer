<script lang="ts">
	import '../app.css';
	import { type Snippet } from 'svelte';
	import { t } from 'svelte-i18n';
	import SplashScreen from '$lib/components/SplashScreen.svelte';
	let {
		children
	}: {
		children: Snippet;
		data: any[];
	} = $props();

	// handle offline
	import { online } from 'svelte/reactivity/window';
	import { goto } from '$app/navigation';

	$effect(() => {
		if (!online.current) goto('/error');
	});
</script>

<svelte:head>
	<title>{$t('site_name')}</title>
</svelte:head>
{@render children()}
<SplashScreen />
