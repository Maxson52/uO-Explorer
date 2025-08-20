<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import { locale, t } from 'svelte-i18n';
	const { pb } = getPocketBaseInstance();

	let events = pb.collection('events').getFullList({
		sort: 'start_time',
		expand: 'location_id'
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

<div class="tour-step-1 container mx-auto max-w-3xl p-4">
	<!-- Schedule section -->
	<h1 class="mb-8 mt-4 text-4xl font-bold">{$t('home.schedule')}</h1>

	<div class="space-y-4 pb-[env(safe-area-inset-bottom)]">
		{#await events}
			<!-- skeleton load -->
			{#each Array(3) as _}
				<div class="animate-pulse rounded-lg border-l-4 border-gray-300 bg-white p-4 shadow">
					<div class="flex items-start justify-between">
						<div class="h-6 w-3/4 rounded bg-gray-300"></div>
					</div>

					<div class="mb-2 mt-1 space-y-2">
						<div class="h-4 w-full rounded-full bg-gray-200"></div>
						<div class="h-4 w-3/4 rounded-full bg-gray-200"></div>
					</div>

					<div class="mt-3 grid grid-cols-2 gap-2">
						<div>
							<div class="mb-1 h-4 w-12 rounded-full bg-gray-300"></div>
							<div class="h-4 w-20 rounded-full bg-gray-200"></div>
						</div>
						<div>
							<div class="mb-1 h-4 w-10 rounded-full bg-gray-300"></div>
							<div class="h-4 w-20 rounded-full bg-gray-200"></div>
						</div>
					</div>
				</div>
			{/each}
		{:then eventData}
			{#each eventData as event}
				<div class="rounded-lg border-l-4 border-garnet-500 bg-white p-4 shadow">
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

					{#if event.location_id && event?.expand?.location_id}
						<div class="mt-3 text-sm">
							<span class="font-medium text-gray-500">{$t('home.where')}:</span>
							<a href={`/map?location_id=${event.location_id}`} class="link text-garnet-500"
								>{$locale == 'en'
									? event.expand.location_id.name_en
									: event.expand.location_id.name_fr}</a
							>
						</div>
					{/if}
				</div>
			{/each}
		{:catch error}
			<p class="text-red-500">Error loading events: {error.message}</p>
		{/await}
	</div>
</div>
