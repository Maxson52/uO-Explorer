<script lang="ts">
	import MdiCameraSwitch from '~icons/mdi/camera-switch';

	import { t } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { BarqodeStream, type DetectedBarcode } from 'barqode';
	import Alert from '$lib/components/Alert.svelte';

	let loading = $state(true);

	function onCameraOn() {
		loading = false;
		error = '';
	}

	function onDetect(detectedCodes: DetectedBarcode[]) {
		detectedCodes.map((code) => (code.rawValue ? goto(code.rawValue) : ''));
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

	let error: any = $state('');
	function onError(err: { name: string; message: string }) {
		error = `(${err.name}): `;

		if (err.name === 'NotAllowedError') {
			error += 'you need to grant camera access permission';
		} else if (err.name === 'NotFoundError') {
			error += 'no camera on this device';
		} else if (err.name === 'NotSupportedError') {
			error += 'secure context required (HTTPS, localhost)';
		} else if (err.name === 'NotReadableError') {
			error += 'is the camera already in use?';
		} else if (err.name === 'OverconstrainedError') {
			error += 'installed cameras are not suitable';
		} else if (err.name === 'StreamApiNotSupportedError') {
			error += 'Stream API is not supported in this browser';
		} else {
			error += err.message;
		}
	}

	let selectedConstraints = $state({ facingMode: 'environment' });
</script>

<div class="mx-auto max-w-[720px] px-2">
	<div class="mt-4 text-center text-lg">
		{$t('scan.title')}
	</div>

	<div class="my-4" style="width: 100%; aspect-ratio: 4/3;">
		<BarqodeStream constraints={selectedConstraints} {onCameraOn} {onDetect} {track} {onError}>
			{#if loading}
				<div class="my-auto px-4 text-center font-bold">{$t('scan.camera_permission')}</div>
			{:else}
				<button
					class="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border-4 border-white bg-transparent p-4 text-center text-lg text-white shadow-md transition-colors active:border-gray-400 active:text-gray-400"
					onclick={() =>
						selectedConstraints.facingMode == 'environment'
							? (selectedConstraints = { facingMode: 'user' })
							: (selectedConstraints = { facingMode: 'environment' })}
				>
					<MdiCameraSwitch />
				</button>
			{/if}
		</BarqodeStream>
	</div>

	{#if error}
		<div class="my-2">
			<Alert type="error" message={error}></Alert>
		</div>
	{/if}
</div>
