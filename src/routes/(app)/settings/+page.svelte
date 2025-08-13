<script lang="ts">
	import MdiArrowRight from '~icons/mdi/arrow-right';
	import { accountSettings } from '$lib/constants';
	import { t } from 'svelte-i18n';
</script>

<div class="container p-6 mx-auto">
	<div class="p-6 rounded-lg shadow-md bg-base-100">
		<h1 class="mb-6 text-2xl font-bold">{$t('nav.settings')}</h1>
		{#each accountSettings as setting, i}
			<a
				class="block p-4 transition rounded-lg cursor-pointer hover:bg-base-200"
				href={setting.pathName}
			>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-lg font-semibold">{$t(`nav.${setting.name}`)}</h2>
						<p>{$t(`settings.${setting.name}.description`)}</p>
					</div>
					<span class="self-end mt-2 whitespace-nowrap md:ml-4 md:mt-0 md:self-center"
						><MdiArrowRight></MdiArrowRight></span
					>
				</div>
			</a>
			{#if i + 1 < accountSettings.length}
				<hr class="my-4" />
			{/if}
		{/each}
	</div>
</div>
