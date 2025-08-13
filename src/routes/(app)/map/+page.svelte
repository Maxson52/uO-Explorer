<script lang="ts">
	import { Map, TileLayer, Marker, Popup } from 'sveaflet';

	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import { locale, t } from 'svelte-i18n';
	const { pb } = getPocketBaseInstance();

	const locationsPromise = pb.collection('locations').getFullList();
	const visitsPromise = pb.collection('visits').getFullList();
	const data = Promise.all([locationsPromise, visitsPromise]);
</script>

<div class="z-10 mx-auto mt-2 h-[calc(100vh-64px-1rem)] w-[95%]">
	<Map
		options={{
			center: [45.421827, -75.682967],
			zoom: 16,
			maxBounds: [
				[45.430818, -75.698964], // top left
				[45.414538, -75.662871] // bottom right
			],
			minZoom: 15,
			maxZoom: 18
		}}
	>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />

		{#await data then [locationsData, visitsData]}
			{#each locationsData as location}
				{@const isVisited = visitsData.some((v) => v.location_id === location.id)}
				<Marker
					latLng={location.location}
					options={{
						opacity: isVisited ? 0.4 : 1
					}}
				>
					<Popup>
						<h1 class="font-bold">
							{$locale == 'en' ? location.name_en : location.name_fr}
						</h1>
						<p>
							{$locale == 'en' ? location.description_preview_en : location.description_preview_fr}
						</p>
						<a class="underline underline-offset-2" href={'/map/' + location.id}
							>{$t('map.learn_more')}</a
						>
					</Popup>
				</Marker>
			{/each}
		{/await}
	</Map>
</div>
