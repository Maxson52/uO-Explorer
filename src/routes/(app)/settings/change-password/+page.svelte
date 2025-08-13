<script lang="ts">
	import MdiArrowLeft from '~icons/mdi/arrow-left';

	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import Alert from '$lib/components/Alert.svelte';

	import { t } from 'svelte-i18n';

	const { pb } = getPocketBaseInstance();

	let alertType = $state('');
	let alertMessage = $state('');

	const handleChangePasswordClick = async () => {
		try {
			await pb.collection('users').requestPasswordReset(pb.authStore.record?.email);
			alertType = 'success';
			alertMessage = $t('settings.check_inbox');
		} catch (e) {
			alertType = 'error';
			alertMessage = (e as Error)?.message;
		}
	};
</script>

<div class="flex items-center justify-center flex-grow">
	<div class="container p-4 mx-auto">
		<div class="max-w-md p-6 mx-auto shadow-xl card bg-base-100 lg:rounded-lg">
			<a href="/settings" class="text-xl text-left btn btn-circle btn-ghost"
				><MdiArrowLeft></MdiArrowLeft></a
			>
			<h2 class="mb-4 text-2xl font-bold text-center">{$t('nav.change_password')}</h2>
			<p class="mb-4 text-center">
				{$t('settings.change_password.message')}
			</p>
			{#if alertType && alertMessage}
				<div class="mb-4">
					<Alert type={alertType} message={alertMessage}></Alert>
				</div>
			{/if}
			<div class="text-center">
				<button class="min-w-full btn btn-primary" onclick={handleChangePasswordClick}
					>{$t('nav.change_password')}</button
				>
			</div>
		</div>
	</div>
</div>
