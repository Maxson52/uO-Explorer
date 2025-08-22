<script lang="ts">
	import {
		Map,
		TileLayer,
		Marker,
		Popup,
		Circle,
		ControlZoom,
		Icon,
		GeoJSON,
		Polyline,
		Tooltip
	} from 'sveaflet';
	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import { locale, t } from 'svelte-i18n';
	import polyline from '@mapbox/polyline';
	import { onDestroy, onMount } from 'svelte';
	import { PUBLIC_POCKETBASE_HOST } from '$env/static/public';
	import { boundaries } from '$lib/uottawa-geo.js';
	import { fade, slide } from 'svelte/transition';
	import { page } from '$app/state';
	const { pb } = getPocketBaseInstance();

	const locationsPromise = pb.collection('locations').getFullList({
		sort: 'name_en'
	});
	const visitsPromise = pb.collection('visits').getFullList();
	const data = Promise.all([locationsPromise, visitsPromise]);

	let map: any = $state();
	let mapMarkers: Record<string, any> = $state({});

	$effect(() => {
		if (!map) return;
		// open popup to center of screen
		map.on('popupopen', (e: any) => map.panTo(e.target._popup._latlng));
		// remove selected location (from dropdown) if no directions are set
		map.on('popupclose', () => {
			if (selectedLocation && !routeDirections) selectedLocation = null;
		});
	});

	let userPosition: any[] | undefined = $state();
	let watchId: number | undefined;
	function getLocation() {
		if (navigator.geolocation) {
			watchId = navigator.geolocation.watchPosition(
				(pos) => {
					const newPosition = [pos.coords.latitude, pos.coords.longitude];
					// const newPosition = [45.421827, -75.682967];
					if (
						!userPosition ||
						newPosition[0] !== userPosition[0] ||
						newPosition[1] !== userPosition[1]
					)
						userPosition = newPosition;
					localStorage.removeItem('location-disabled-alert');
				},
				() => {
					if (localStorage.getItem('location-disabled-alert')) return;
					alert('Geolocation is disabled. Please enable it in your browser settings.');
					localStorage.setItem('location-disabled-alert', 'true');
				},
				{ enableHighAccuracy: true }
			);
		} else {
			if (localStorage.getItem('location-disabled-alert')) return;
			alert('Geolocation is not supported by this browser.');
			localStorage.setItem('location-disabled-alert', 'true');
		}
	}

	async function fetchWalkingRoute(from: [number, number], to: any) {
		if (!to?.location || !to?.location.lon) return;

		const res = await fetch('https://uo-explorer.makerepo.com/ors/v2/directions/foot-walking', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({
				coordinates: [
					[from[1], from[0]],
					[to?.location.lon, to?.location.lat]
				],
				language: $locale
			})
		});
		const json = await res.json();
		return {
			coords: polyline.decode(json.routes[0].geometry),
			distance: json.routes[0].summary.distance,
			duration: json.routes[0].summary.duration,
			directions: json.routes[0].segments[0].steps
		};
	}

	let routeCoords: [number, number][] = $state([]);
	let routeDistance: string | undefined = $state();
	let routeDuration: string | undefined = $state();
	let routeDirections: any[] | undefined = $state();

	let showMenu = $state(false);
	let selectedLocation: any = $state.raw();
	$effect(() => {
		if (selectedLocation) {
			// if a location is selected from dropdown, show popup
			const marker = mapMarkers[selectedLocation.id];
			if (marker) marker.openPopup();
		}
	});

	onMount(async () => {
		getLocation();

		// auto scroll to view and popup if the user is directed to the map from the schedule page
		if (page.url.searchParams.get('location_id'))
			selectedLocation = (await locationsPromise).find(
				(location) => location.id === page.url.searchParams.get('location_id')
			);
	});

	onDestroy(() => {
		if (watchId) navigator.geolocation.clearWatch(watchId);
	});
</script>

{#await data then [locationsData, visitsData]}
	<!-- visited locations bar -->
	{@const visitedCount = visitsData.filter((v) =>
		locationsData.some((l) => l.id === v.location_id)
	).length}
	{@const totalLocations = locationsData.length}
	{@const progressPercentage =
		totalLocations > 0 ? Math.round((visitedCount / totalLocations) * 100) : 0}
	<div
		in:fade={{ duration: 100 }}
		class="absolute inset-x-4 top-4 z-[500] max-w-[500px] rounded-lg bg-base-200 p-2 shadow-lg"
	>
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
		<div class="h-3 w-full rounded-full bg-gray-200">
			<div
				class="h-3 rounded-full bg-gradient-to-r from-garnet-400 to-garnet-500 transition-all duration-500"
				style={`width: ${progressPercentage}%`}
				aria-valuenow={progressPercentage}
				aria-valuemin="0"
				aria-valuemax="100"
			>
				<span class="sr-only">{progressPercentage}% complete</span>
			</div>
		</div>
	</div>

	<!-- locations burger -->
	<div in:fade={{ duration: 100 }} class="absolute left-4 top-20 z-[500]">
		<button
			onclick={() => (showMenu = !showMenu)}
			class="flex items-center rounded-full bg-garnet-500 px-4 py-2 font-bold text-white shadow-lg transition-all hover:bg-garnet-400"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-2 block h-5 w-5 cursor-pointer focus:outline-none active:outline-none"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				{#if !showMenu}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				{:else}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 4l16 16 M20 4l-16 16"
					/>
				{/if}
			</svg>

			<span>{$t('map.locations')}</span>
		</button>
	</div>

	{#if showMenu}
		<div
			class="absolute left-4 top-32 z-[501] max-h-[60vh] w-64 overflow-y-auto rounded-lg bg-white p-2 shadow-lg"
			in:slide={{ duration: 250 }}
		>
			<ul>
				{#each locationsData as location}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<li
						class="cursor-pointer rounded-md p-2 hover:bg-gray-100"
						class:text-garnet-500={selectedLocation === location}
						class:font-bold={selectedLocation == location}
						onclick={() => {
							if (selectedLocation == location) selectedLocation = null;
							else {
								// set new location and reset directions
								selectedLocation = location;
								routeCoords = [];
								routeDistance = undefined;
								routeDuration = undefined;
								routeDirections = undefined;
							}
							showMenu = false;
						}}
					>
						{$locale == 'en' ? location.name_en : location.name_fr}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{/await}

<!-- route directions -->
{#if selectedLocation && routeDirections}
	<div
		in:fade={{ duration: 100 }}
		class="absolute inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[500] mx-auto max-w-[500px] rounded-lg bg-base-200 p-2 shadow-lg"
	>
		<div class="relative mb-1.5 text-gray-600">
			<button class="absolute right-0 top-0" onclick={() => (selectedLocation = null)}>×</button>

			<div class="pb-2 font-bold">
				{$t('map.directions_to')}
				{$locale == 'en' ? selectedLocation.name_en : selectedLocation.name_fr}
			</div>

			<ul class="max-h-24 space-y-1.5 overflow-scroll">
				{#if routeDirections.length <= 1}
					<li class="flex flex-row justify-between rounded-md bg-white p-2 shadow-sm">
						<div class="text-sm font-medium text-gray-800">
							{$t('map.already_there')}
						</div>
					</li>
				{:else}
					{#each routeDirections as step, i}
						<li class="flex flex-row justify-between rounded-md bg-white p-2 shadow-sm">
							<div class="text-sm font-medium text-gray-800">
								{i + 1}. {step.instruction}
							</div>
							<div class="text-xs text-gray-500">
								{step.distance.toFixed(0)} m ({(step.duration / 60).toFixed(1)} min)
							</div>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
	</div>
{/if}

<!-- map -->
<div class="z-10 mx-2 mt-2 h-[calc(100dvh-64px-1rem-env(safe-area-inset-bottom))]">
	<Map
		bind:instance={map}
		options={{
			center: [45.421827, -75.682967],
			zoom: 16,
			maxBounds: [
				[45.430818, -75.698964], // top left
				[45.414538, -75.662871] // bottom right
			],
			minZoom: 13,
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
					radius: 5,
					color: '#8f001a'
				}}
			>
				<Tooltip options={{ content: $t('map.you_are_here') }} />
			</Circle>
		{/if}

		{#if userPosition && selectedLocation}
			<Polyline
				latLngs={routeCoords || [userPosition, selectedLocation.location]}
				options={{ color: 'blue', weight: 3, dashArray: '5, 10' }}
			/>

			{#if routeCoords && routeDistance && routeDuration}
				<Tooltip
					latLng={routeCoords[Math.floor(routeCoords.length / 2)] || userPosition}
					options={{ content: `${routeDistance} m (${routeDuration} min)` }}
				/>
			{/if}
		{/if}

		{#await data then [locationsData, visitsData]}
			{#each locationsData as location}
				{@const isVisited = visitsData.some((v) => v.location_id === location.id)}
				<Marker
					latLng={location.location}
					bind:instance={mapMarkers[location.id]}
					options={{
						opacity: isVisited ? 0.5 : 1
					}}
				>
					{#if location.custom_icon}
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
						<p style="margin: 0.5rem 0;">
							{$locale == 'en' ? location.description_preview_en : location.description_preview_fr}
						</p>

						{#if userPosition}
							<button
								class="text-blue-500 underline underline-offset-2"
								onclick={() => {
									selectedLocation = location;
									// @ts-ignore
									fetchWalkingRoute(userPosition, selectedLocation).then((res) => {
										routeCoords = res?.coords || [];
										routeDistance = res?.distance?.toFixed(0);
										routeDuration = (res?.duration / 60)?.toFixed(0);
										routeDirections = res?.directions;

										map.flyTo(routeCoords[Math.floor(routeCoords.length / 2)] || userPosition, 16);
										mapMarkers[location.id].closePopup();
									});
								}}
							>
								{$t('map.get_directions')}
							</button>
						{/if}

						<a
							class="mt-4 block w-full rounded-lg bg-garnet-500 p-1.5 text-center"
							style="color: white !important;"
							href={'/map/' + location.id}
							>{$t('map.learn_more')}
						</a>
					</Popup>
				</Marker>
			{/each}
		{/await}
	</Map>
</div>
