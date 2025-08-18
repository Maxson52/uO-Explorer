<script>
	import { t } from 'svelte-i18n';
</script>

<div class="container mx-auto max-w-3xl p-4">
	<h1 class="mb-8 mt-4 text-4xl font-bold">{$t('sponsors.our_sponsors')}</h1>

	<div class="space-y-12">
		<!-- Manulife -->
		<div>
			<img
				src="/sponsors/manulife.png"
				alt="Manulife"
				class="h-auto max-w-48 object-contain pb-4"
			/>

			<p class="text-gray-700">
				{$t('sponsors.manulife')}
			</p>
		</div>

		<!-- belairdirect -->
		<div>
			<img
				src="/sponsors/belairdirect.png"
				alt="belairdirect"
				class="h-auto max-w-48 object-contain pb-4"
			/>
			<p class="text-gray-700">
				{$t('sponsors.belairdirect')}
			</p>
		</div>

		<!-- TD Small Business -->
		<div>
			<img src="/sponsors/td.png" alt="TD Small Business" class="h-auto max-w-48 object-contain" />
			<p class="text-gray-700">
				{$t('sponsors.td')}
			</p>
		</div>
	</div>
</div>
