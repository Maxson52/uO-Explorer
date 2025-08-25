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

	<meta name="title" content="uOttawa Explorer" />
	<meta
		name="description"
		content="Redécouvrez l’Université d’Ottawa! Profitez d’une visite interactive du campus riche en démonstrations, en surprises et en plaisir. // Rediscover uOttawa! Join our interactive campus tour with fun stops, demos, and surprises for everyone."
	/>
	<meta
		name="keywords"
		content="uottawa explorer, uo explorer, uottawa interactive map, uottawa campus tour"
	/>
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://uo-explorer.makerepo.com" />
	<meta property="og:title" content="uOttawa Explorer" />
	<meta
		property="og:description"
		content="Redécouvrez l’Université d’Ottawa! Profitez d’une visite interactive du campus riche en démonstrations, en surprises et en plaisir. // Rediscover uOttawa! Join our interactive campus tour with fun stops, demos, and surprises for everyone."
	/>
	<meta property="og:image" content="/og_image.png" />
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://uo-explorer.makerepo.com" />
	<meta property="twitter:title" content="uOttawa Explorer" />
	<meta
		property="twitter:description"
		content="Redécouvrez l’Université d’Ottawa! Profitez d’une visite interactive du campus riche en démonstrations, en surprises et en plaisir. // Rediscover uOttawa! Join our interactive campus tour with fun stops, demos, and surprises for everyone."
	/>
	<meta property="twitter:image" content="/og_image.png" />
</svelte:head>
{@render children()}
