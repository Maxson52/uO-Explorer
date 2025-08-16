<script lang="ts">
	import { page } from '$app/state';
	import { t } from 'svelte-i18n';
	import MdiEmoticonSadOutline from '~icons/mdi/emoticon-sad-outline';
	import MdiWifiOff from '~icons/mdi/wifi-off';
	import MdiHome from '~icons/mdi/home';
	import MdiRefresh from '~icons/mdi/refresh';
	import MdiInformationOutline from '~icons/mdi/information-outline';
</script>

<div class="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-6 text-center">
	<div class="mb-6 text-red-500">
		{#if page?.status === 404}
			<MdiEmoticonSadOutline class="h-24 w-24" />
		{:else}
			<MdiWifiOff class="h-24 w-24" />
		{/if}
	</div>

	<h1 class="mb-2 text-3xl font-bold text-gray-800">
		{page?.status || $t('error.status.default')} - {page?.error?.message ||
			$t('error.message.default')}
	</h1>

	<p class="mb-6 max-w-md text-gray-600">
		{#if page?.status === 404}
			{$t('error.404.message')}
		{:else}
			{$t('error.general.message')}
		{/if}
	</p>

	<div class="flex flex-col gap-3 sm:flex-row">
		<button
			on:click={() => window.location.reload()}
			class="bg-garnet-500 hover:bg-garnet-400 focus:ring-garnet-500 flex items-center justify-center gap-2 rounded-lg px-6 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
		>
			<MdiRefresh class="h-5 w-5" />
			{$t('error.actions.retry')}
		</button>
		<a
			href="/"
			class="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
		>
			<MdiHome class="h-5 w-5" />
			{$t('error.actions.home')}
		</a>
	</div>

	{#if page?.status !== 404}
		<div class="mt-6 flex items-center gap-2 text-sm text-gray-500">
			<MdiInformationOutline class="h-4 w-4" />
			<span>{$t('error.hints.connection')}</span>
		</div>
	{/if}
</div>
