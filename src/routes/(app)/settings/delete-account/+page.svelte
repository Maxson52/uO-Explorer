<script lang="ts">
	import MdiArrowLeft from '~icons/mdi/arrow-left';

	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { sleep } from '$lib';

	import { t } from 'svelte-i18n';

	const { pb } = getPocketBaseInstance();

	let alertType = $state('');
	let alertMessage = $state('');
	let email = $state('');
	let dialogRef: HTMLDialogElement | undefined = $state();

	const handleConfirmDeleteAccountClick = async () => {
		if (pb.authStore.record) {
			if (email !== pb.authStore.record.email) {
				alertType = 'error';
				alertMessage = 'Please confirm your email address and try again';
				dialogRef?.close?.();
				return;
			}

			alertType = 'success';
			alertMessage = `So long, ${pb.authStore.record.username}!`;
			dialogRef?.close?.();

			await sleep(2500);

			try {
				await pb.collection('users').delete(pb.authStore.record.id);
			} catch (e) {
				alertType = 'error';
				alertMessage = 'Something went wrong while deleting your account.';
			}
		}
	};
</script>

{#snippet modalActions()}
	<button class="btn" onclick={() => dialogRef?.close?.()}>{$t('settings.cancel')}</button>
	<button class="btn btn-error" onclick={handleConfirmDeleteAccountClick}
		>{$t('settings.confirm')}</button
	>
{/snippet}

<Modal
	bind:dialogRef
	id="delete-account-modal"
	title={$t('nav.delete_account')}
	description={$t('settings.delete_account.are_you_sure')}
	dismissable={true}
	actionSnippet={modalActions}
></Modal>

<div class="flex items-center justify-center flex-grow">
	<div class="container p-4 mx-auto">
		<div class="max-w-md p-6 mx-auto shadow-xl card bg-base-100 lg:rounded-lg">
			<a href="/settings" class="text-xl text-left btn btn-circle btn-ghost"
				><MdiArrowLeft></MdiArrowLeft></a
			>
			<h2 class="mb-4 text-2xl font-bold text-center">{$t('nav.delete_account')}</h2>
			<p class="mb-4 text-center">
				{$t('settings.delete_account.message')}
			</p>
			{#if alertType && alertMessage}
				<div class="mb-4">
					<Alert type={alertType} message={alertMessage}></Alert>
				</div>
			{/if}
			<div class="relative mb-4 form-control">
				<input
					type="email"
					id="email"
					class="input input-bordered"
					placeholder={$t('settings.delete_account.current_email')}
					bind:value={email}
				/>
			</div>
			<div class="text-center">
				<button
					class="min-w-full btn btn-primary"
					onclick={() => dialogRef?.showModal?.()}
					disabled={email !== pb?.authStore?.record?.email}
					>{$t('settings.delete_account.delete_forever')}</button
				>
			</div>
		</div>
	</div>
</div>
