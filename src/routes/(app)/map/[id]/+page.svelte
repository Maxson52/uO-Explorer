<script lang="ts">
	import MdiArrowLeft from '~icons/mdi/arrow-left';
	import MdiCamera from '~icons/mdi/camera';

	import { locale, t } from 'svelte-i18n';
	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte.js';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { PUBLIC_POCKETBASE_HOST } from '$env/static/public';
	import { goto } from '$app/navigation';

	const { pb } = getPocketBaseInstance();
	let location: any = null;
	let loading = true;
	let error: any = null;

	onMount(async () => {
		try {
			const id = page.params.id;
			if (!id) throw new Error('Location ID could not be found in URL');
			location = await pb.collection('locations').getOne(id, {
				expand: 'images'
			});
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	});

	function goBack() {
		window.history.length > 1 ? window.history.back() : goto('/map');
	}
</script>

<div class="mx-auto min-h-screen w-full max-w-[720px] bg-gray-50 pb-20">
	{#if loading}
		<div class="flex h-screen items-center justify-center">
			<div class="animate-pulse text-gray-500">{$t('loading')}...</div>
		</div>
	{:else if error}
		<div class="p-4 text-red-500">{error}</div>
	{:else if location}
		<div class="absolute z-10 flex items-center p-4">
			<button
				on:click={goBack}
				class="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 backdrop-blur-sm transition-colors hover:bg-gray-200/50"
				aria-label={$t('back')}
			>
				<MdiArrowLeft class="h-5 w-5 text-gray-700" />
			</button>
		</div>

		{#if location.image}
			<div class="relative aspect-[4/3] w-full overflow-hidden md:max-h-64">
				<img
					src={`${PUBLIC_POCKETBASE_HOST}/api/files/locations/${location.id}/${location.image}`}
					alt={$locale === 'fr' ? location.name_fr : location.name_en}
					class="h-full w-full object-cover"
				/>
			</div>
		{:else}
			<!-- Default image -->
			<div class="relative aspect-[4/3] w-full overflow-hidden md:max-h-64">
				<img src="/default-uottawa.jpg" alt="Default" class="h-full w-full object-cover" />
			</div>
		{/if}

		<div class="mt-6 px-4">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">
				{$locale === 'fr' ? location.name_fr : location.name_en}
			</h1>

			<div class="mt-4 max-w-none whitespace-pre-line leading-7 text-gray-700">
				{$locale === 'fr'
					? location.description_fr || location.description_preview_fr
					: location.description_en || location.description_preview_en}
			</div>
		</div>
	{:else}
		<div class="p-4 text-gray-500">Location not found</div>
	{/if}
</div>

{#if !loading && !location?.is_custom}
	<div class="fixed bottom-20 right-4 z-50">
		<a
			href="/scan"
			class="flex h-14 w-14 items-center justify-center rounded-full bg-garnet-500 p-3 shadow-lg transition-all hover:bg-garnet-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-garnet-400 focus:ring-opacity-75"
		>
			<MdiCamera class="h-8 w-8 text-white" />
			<span class="sr-only">Scan QR Code</span>
		</a>
	</div>
{/if}
