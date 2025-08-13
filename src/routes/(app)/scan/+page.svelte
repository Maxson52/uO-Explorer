<script lang="ts">
	import MdiMap from '~icons/mdi/map';

	import { t } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { BarqodeStream, type DetectedBarcode } from 'barqode';

	let loading = $state(true);

	function onCameraOn() {
		loading = false;
	}

	function onDetect(detectedCodes: DetectedBarcode[]) {
		detectedCodes.map((code) => (code.rawValue ? goto(`/scan/${code.rawValue}`) : ''));
	}

	function track(detectedCodes: DetectedBarcode[], ctx: CanvasRenderingContext2D) {
		for (const detectedCode of detectedCodes) {
			const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

			ctx.strokeStyle = '#2563eb';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(firstPoint.x, firstPoint.y);

			for (const { x, y } of otherPoints) {
				ctx.lineTo(x, y);
			}

			ctx.lineTo(firstPoint.x, firstPoint.y);
			ctx.closePath();
			ctx.stroke();
		}
	}
</script>

<div class="mx-auto max-w-[720px] px-2">
	<div class="mt-4 text-center text-lg">
		{$t('scan.title')}
	</div>

	<div class="my-4" style="width: 100%; aspect-ratio: 4/3;">
		<BarqodeStream {onCameraOn} {onDetect} {track}>
			{#if loading}
				<div class="my-auto px-4 text-center font-bold">{$t('scan.camera_permission')}</div>
			{/if}
		</BarqodeStream>
	</div>

	<a
		href="/map"
		class="flex flex-row items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-center text-white shadow-md transition-colors hover:bg-blue-600"
	>
		<MdiMap />
		{$t('scan.back_to_map')}
	</a>
</div>
