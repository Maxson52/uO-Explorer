<script>
	import { t } from 'svelte-i18n';
</script>

<div class="container mx-auto max-w-3xl p-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
	<h1 class="mb-8 mt-4 text-4xl font-bold">{$t('nav.help')}</h1>

	<div class="mb-6">
		<h2 class="mb-2 text-2xl font-semibold">{$t('help.contact_us')}</h2>

		<div class="space-y-2">
			<a href="tel:613-793-0713" class="btn w-full bg-garnet-500 text-white">
				{$t('help.call')} Pamela (613-793-0713)
			</a>
			<a href="tel:343-999-4606" class="btn w-full bg-garnet-500 text-white">
				Call Andréanne (343-999-4606)
			</a>
		</div>
	</div>

	<div>
		<h2 class="mb-2 text-2xl font-semibold">{$t('help.guide')}</h2>

		<div class="mb-6">
			<h3 class="mb-1 text-xl font-medium">📅 {$t('help.schedule')}</h3>
			<p class="text-gray-700">
				{$t('help.schedule_desc')}
			</p>
		</div>

		<div class="mb-6">
			<h3 class="mb-1 text-xl font-medium">🗺️ {$t('help.map')}</h3>
			<p class="text-gray-700">
				{$t('help.map_desc')}
			</p>
		</div>

		<div>
			<h3 class="mb-1 text-xl font-medium">📍 {$t('help.location')}</h3>
			<p class="text-gray-700">
				{$t('help.location_desc')}
			</p>
		</div>
	</div>
</div>
