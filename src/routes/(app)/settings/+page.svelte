<script lang="ts">
	import MdiArrowRight from '~icons/mdi/arrow-right';
	import { accountSettings } from '$lib/constants';
	import { t } from 'svelte-i18n';
</script>

<div class="container mx-auto max-w-3xl p-4">
	<h1 class="mb-8 mt-4 text-4xl font-bold">{$t('nav.settings')}</h1>

	{#each accountSettings as setting}
		<div class="mb-4 rounded-lg bg-base-100 p-6 shadow-md">
			<a
				class="block cursor-pointer rounded-lg p-4 transition hover:bg-base-200"
				href={setting.pathName}
			>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-lg font-semibold">{$t(`nav.${setting.name}`)}</h2>
						<p>{$t(`settings.${setting.name}.description`)}</p>
					</div>
					<span class="mt-2 self-end whitespace-nowrap md:ml-4 md:mt-0 md:self-center"
						><MdiArrowRight></MdiArrowRight></span
					>
				</div>
			</a>
		</div>
	{/each}
</div>
