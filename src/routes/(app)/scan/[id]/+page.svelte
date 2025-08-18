<script lang="ts">
	import MdiMap from '~icons/mdi/map';

	import { onMount } from 'svelte';
	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import { t, locale } from 'svelte-i18n';
	import { page } from '$app/state';
	import { PUBLIC_POCKETBASE_HOST } from '$env/static/public';

	const { pb } = getPocketBaseInstance();

	let location: any = null;
	let loading = true;
	let error: any = null;

	onMount(async () => {
		const id = page.params.id;
		try {
			if (!id) throw new Error('Location ID could not be found in URL');
			location = await pb.collection('locations').getOne(id);
			if (!location.has_qr_code) throw new Error('This location is not scannable');
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}

		// add visit
		try {
			await pb.collection('visits').create({
				user_id: pb.authStore.record?.id,
				location_id: id
			});
		} catch (err: any) {
			console.error(err);
		}
	});
</script>

<div class="container mx-auto p-4 text-center">
	{#if loading}
		<div class="flex h-screen items-center justify-center">
			<div class="animate-pulse text-gray-500">{$t('loading')}...</div>
		</div>
	{:else if error || !location}
		<div class="mb-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
			<p class="font-bold">{$t('scan.invalid_qr')}</p>
			<p>{$t('scan.location_doesnt_exist')}</p>
		</div>
	{:else}
		<div class="mb-4 border-l-4 border-green-500 bg-green-100 p-4 text-green-700" role="alert">
			{#if location.image}
				<div class="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md md:max-h-64">
					<img
						src={`${PUBLIC_POCKETBASE_HOST}/api/files/locations/${location.id}/${location.image}`}
						alt={$locale === 'fr' ? location.name_fr : location.name_en}
						class="h-full w-full object-cover"
					/>
				</div>
			{:else}
				<!-- Default image -->
				<div
					class="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 md:max-h-64"
				>
					<img
						src="/default-uottawa.jpg"
						alt="Default location"
						class="h-full w-full object-cover opacity-80"
					/>
				</div>
			{/if}

			<p class="mt-4 text-xl font-bold">
				{$locale == 'en' ? location.name_en : location.name_fr}
				{$t('scan.scanned')}!
			</p>
			<p>{$t('scan.draw_entered')}</p>
		</div>
	{/if}

	<a
		href="/map"
		class="flex flex-row items-center justify-center gap-2 rounded-full bg-garnet-500 px-6 py-3 text-center text-white shadow-md transition-colors hover:bg-garnet-400"
	>
		<MdiMap />
		{$t('scan.back_to_map')}
	</a>
</div>
