<script lang="ts">
	import MdiMap from '~icons/mdi/map';

	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import { locale, t } from 'svelte-i18n';
	const { pb } = getPocketBaseInstance();

	let events = pb.collection('events').getFullList({
		sort: 'start_time'
	});

	// localize date
	const formatDate = (dateString: any) => {
		const date = new Date(dateString);
		// @ts-ignore
		return date.toLocaleDateString($locale, {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};
</script>

<div class="container mx-auto max-w-3xl p-4">
	<div class="mb-6 py-3 text-center">
		<a
			href="/map"
			class="flex flex-row items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-center text-white shadow-md transition-colors hover:bg-blue-600"
		>
			<MdiMap />
			{$t('home.view_map')}
		</a>
	</div>

	<!-- Schedule section -->
	<h1 class="mb-4 text-2xl font-bold">{$t('home.schedule')}</h1>

	{#await events then eventData}
		<div class="space-y-4">
			{#each eventData as event}
				<div class="rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow">
					<div class="flex items-start justify-between">
						<h2 class="text-lg font-semibold">
							{$locale == 'en' ? event.name_en : event.name_fr}
						</h2>
						{#if event.location}
							<span class="rounded bg-gray-100 px-2 py-1 text-sm">
								{event.location}
							</span>
						{/if}
					</div>

					<p class="mb-2 mt-1 whitespace-pre-line text-gray-600">
						{$locale == 'en' ? event.description_en : event.description_fr}
					</p>

					<div class="mt-3 grid grid-cols-2 gap-2 text-sm">
						<div>
							<span class="font-medium text-gray-500">{$t('home.start')}:</span>
							<span class="block">{formatDate(event.start_time)}</span>
						</div>
						<div>
							<span class="font-medium text-gray-500">{$t('home.end')}:</span>
							<span class="block">{formatDate(event.end_time)}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:catch error}
		<p class="text-red-500">Error loading events: {error.message}</p>
	{/await}
</div>
