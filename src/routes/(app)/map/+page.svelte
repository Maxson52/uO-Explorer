<script lang="ts">
	import {
		Map,
		TileLayer,
		Marker,
		Popup,
		Control,
		Circle,
		ControlZoom,
		Icon,
		GeoJSON
	} from 'sveaflet';
	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import { locale, t } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { PUBLIC_POCKETBASE_HOST } from '$env/static/public';
	import { boundaries } from '$lib/uottawa-geo';
	const { pb } = getPocketBaseInstance();

	const locationsPromise = pb.collection('locations').getFullList();
	const visitsPromise = pb.collection('visits').getFullList();
	const data = Promise.all([locationsPromise, visitsPromise]);

	let userPosition = $state();
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((pos) => {
				userPosition = [pos.coords.latitude, pos.coords.longitude];
				setTimeout(getLocation, 15000);
			});
		}
	}

	onMount(() => {
		getLocation();
	});
</script>

<div class="absolute inset-x-4 top-4 z-[500] max-w-[500px] rounded-lg bg-base-200 p-2 shadow-lg">
	{#await data then [locationsData, visitsData]}
		{@const visitedCount = visitsData.filter((v) =>
			locationsData.some((l) => l.id === v.location_id)
		).length}
		{@const totalLocations = locationsData.length}
		{@const progressPercentage =
			totalLocations > 0 ? Math.round((visitedCount / totalLocations) * 100) : 0}

		<div class="mb-1.5 text-center font-bold text-gray-600">
			{$t('map.progress', {
				values: {
					visited: visitedCount,
					total: totalLocations,
					percentage: progressPercentage,
					defaultValue: 'Discovered {visited}/{total} locations ({percentage}%)'
				}
			})}
		</div>
		<div
			class="h-3 rounded-full bg-gradient-to-r from-garnet-400 to-garnet-500 transition-all duration-500"
			style={`width: ${progressPercentage}%`}
			aria-valuenow={progressPercentage}
			aria-valuemin="0"
			aria-valuemax="100"
		>
			<span class="sr-only">{progressPercentage}% complete</span>
		</div>
	{/await}
</div>

<div class="z-10 mx-2 mt-2 h-[calc(100vh-64px-1rem)]">
	<Map
		options={{
			center: [45.421827, -75.682967],
			zoom: 16,
			maxBounds: [
				[45.430818, -75.698964], // top left
				[45.414538, -75.662871] // bottom right
			],
			minZoom: 15,
			maxZoom: 18,
			maxBoundsViscosity: 0.8,
			zoomControl: false
		}}
	>
		<TileLayer url={'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'} />
		<ControlZoom options={{ position: 'bottomright' }} />

		<GeoJSON
			json={boundaries}
			options={{
				style: {
					color: '#9c1c30',
					fillOpacity: 0.04
				}
			}}
		/>

		{#if userPosition}
			<Circle
				latLng={userPosition}
				options={{
					fillOpacity: 0.5,
					radius: 4
				}}
			/>
		{/if}

		{#await data then [locationsData, visitsData]}
			{#each locationsData as location}
				{@const isVisited = visitsData.some((v) => v.location_id === location.id)}
				<Marker
					latLng={location.location}
					options={{
						opacity: isVisited ? 0.5 : 1
					}}
				>
					{#if location.is_custom}
						<Icon
							options={{
								iconUrl: `${PUBLIC_POCKETBASE_HOST}/api/files/locations/${location.id}/${location.custom_icon}`,
								iconSize: [30, 30]
							}}
						/>
					{/if}

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
