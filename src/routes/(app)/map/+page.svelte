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
	import { onMount } from 'svelte';
	import { PUBLIC_POCKETBASE_HOST, PUBLIC_OPENROUTE_API_KEY } from '$env/static/public';
	import { boundaries } from '$lib/uottawa-geo';
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	const { pb } = getPocketBaseInstance();

	const locationsPromise = pb.collection('locations').getFullList({
		sort: 'name_en'
	});
	const visitsPromise = pb.collection('visits').getFullList();
	const data = Promise.all([locationsPromise, visitsPromise]);

	let userPosition = $state();
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((pos) => {
				// userPosition = [45.421827, -75.682967];
				userPosition = [pos.coords.latitude, pos.coords.longitude];
				setTimeout(getLocation, 15000);
			});
		}
	}

	async function fetchWalkingRoute(from: [number, number], to: any) {
		if (!to?.location || !to?.location.lon) return;

		const res = await fetch(
			`https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${PUBLIC_OPENROUTE_API_KEY}&start=${from[1]},${from[0]}&end=${to?.location.lon},${to?.location.lat}`
		);
		const json = await res.json();
		return {
			// @ts-ignore
			coords: json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]),
			distance: json.features[0].properties.summary.distance,
			duration: json.features[0].properties.summary.duration
		};
	}

	let routeCoords: [number, number][] = $state([]);
	let routeDistance: string | undefined = $state();
	let routeDuration: string | undefined = $state();
	$effect(() => {
		if (userPosition && selectedLocation) {
			// @ts-ignore
			fetchWalkingRoute(userPosition, selectedLocation).then((res) => {
				routeCoords = res?.coords;
				routeDistance = res?.distance.toFixed(0);
				routeDuration = ((res?.duration || 0) / 60).toFixed(0);
			});
		}
	});

	onMount(async () => {
		getLocation();

		if (page.url.searchParams.get('location_id'))
			selectedLocation = (await locationsPromise).find(
				(location) => location.id === page.url.searchParams.get('location_id')
			);
	});

	let showMenu = $state(false);
	let selectedLocation: any = $state.raw();
</script>

<!-- visited locations bar -->
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

<!-- locations burger -->
<div class="absolute left-4 top-20 z-[500]">
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
	{#await data then [locationsData]}
		<div
			class="absolute left-4 top-32 z-[500] max-h-[60vh] w-64 overflow-y-auto rounded-lg bg-white p-2 shadow-lg"
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
							else selectedLocation = location;
							showMenu = false;
						}}
					>
						{$locale == 'en' ? location.name_en : location.name_fr}
					</li>
				{/each}
			</ul>
		</div>
	{/await}
{/if}

<!-- map -->
<div class="z-10 mx-2 mt-2 h-[calc(100dvh-64px-1rem-env(safe-area-inset-bottom))]">
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
					radius: 5,
					color: '#8f001a'
				}}
			>
				<Popup options={{ content: $t('map.you_are_here') }} />
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
