<script>
	import { locale, t } from 'svelte-i18n';
</script>

<div class="container mx-auto max-w-3xl p-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
	<h1 class="mb-8 mt-4 text-4xl font-bold">{$t('partners.our_partners')}</h1>

	<div class="space-y-12">
		<!-- belairdirect -->
		<div>
			<a
				href={$locale == 'fr'
					? 'https://www.belairdirect.com/fr/assurance-groupe/uottawa.html'
					: 'https://www.belairdirect.com/en/group-insurance/uottawa.html'}
				target="_blank"
				rel="noreferrer"
			>
				<img
					src="/partners/belairdirect.png"
					alt="belairdirect"
					class="h-auto max-w-48 object-contain pb-4"
				/>
			</a>
			<p class="text-gray-700">
				{$t('partners.belairdirect')}
			</p>
		</div>

		<!-- CEED -->
		<div>
			<a
				href={$locale == 'fr'
					? 'https://www.uottawa.ca/faculte-genie/centre-genie-entrepreneurial-conception'
					: 'https://www.uottawa.ca/faculty-engineering/centre-entrepreneurship-engineering-design'}
				target="_blank"
				rel="noreferrer"
			>
				<img
					src={$locale == 'en' ? '/CEED_black.svg' : '/CGEC_black.svg'}
					alt="Manulife"
					class="h-auto max-w-36 object-contain pb-4"
				/>
			</a>

			<p class="text-gray-700">
				{$t('partners.ceed')}
				<a class="link" href="https://max.hapific.com" target="_blank" rel="noreferrer">Max Tully</a
				>.
			</p>
		</div>

		<!-- Manulife -->
		<div>
			<a
				href={$locale == 'fr'
					? 'https://www.assurance-manuvie.ca/uottawa/'
					: 'https://www.manulife-insurance.ca/uottawa/'}
				target="_blank"
				rel="noreferrer"
			>
				<img
					src={$locale == 'fr' ? '/partners/manulife_fr.png' : '/partners/manulife.png'}
					alt="Manulife"
					class="h-auto max-w-48 object-contain pb-4"
				/>
			</a>

			<p class="text-gray-700">
				{$t('partners.manulife')}
			</p>
		</div>
	</div>
</div>
