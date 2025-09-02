<script>
	import { locale, t } from 'svelte-i18n';
</script>

<div class="container mx-auto max-w-3xl p-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
	<h1 class="mb-8 mt-4 text-4xl font-bold">{$t('partners.our_partners')}</h1>

	<div class="space-y-12">
		<!-- belairdirect -->
		<div>
			<img
				src="/partners/belairdirect.png"
				alt="belairdirect"
				class="h-auto max-w-48 object-contain pb-4"
			/>
			<p class="text-gray-700">
				{$t('partners.belairdirect')}
			</p>
		</div>

		<!-- CEED -->
		<div>
			<img
				src={$locale == 'en' ? '/CEED_black.svg' : '/CGEC_black.svg'}
				alt="Manulife"
				class="h-auto max-w-36 object-contain pb-4"
			/>

			<p class="text-gray-700">
				{$t('partners.ceed')}
				<a class="link" href="https://max.hapific.com" target="_blank" rel="noreferrer">Max Tully</a
				>.
			</p>
		</div>

		<!-- Manulife -->
		<div>
			<img
				src="/partners/manulife.png"
				alt="Manulife"
				class="h-auto max-w-48 object-contain pb-4"
			/>

			<p class="text-gray-700">
				{$t('partners.manulife')}
			</p>
		</div>

		<!-- TD Small Business -->
		<div>
			<img src="/partners/td.png" alt="TD Small Business" class="h-auto max-w-48 object-contain" />
			<p class="text-gray-700">
				{$t('partners.td')}
			</p>
		</div>
	</div>
</div>
