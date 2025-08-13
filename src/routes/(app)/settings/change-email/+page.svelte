<script lang="ts">
	import MdiArrowLeft from '~icons/mdi/arrow-left';

	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';

	import { EmailSchema } from '$lib/schemas/auth';
	import { ZodError } from 'zod';

	import Alert from '$lib/components/Alert.svelte';

	import { t } from 'svelte-i18n';

	const { pb } = getPocketBaseInstance();

	let formErrors: Record<string, string[] | undefined> = $state({});

	let alertType = $state('');
	let alertMessage = $state('');

	let email = $state(pb.authStore.record?.email ?? '');

	const handleChangeEmailClick = async () => {
		try {
			formErrors = {};
			EmailSchema.parse({ email });
			await pb.collection('users').requestEmailChange(email);
			alertType = 'success';
			alertMessage = $t('settings.check_inbox');
		} catch (e) {
			if (e instanceof ZodError) {
				const { fieldErrors: errors } = e.flatten();
				formErrors = errors;
			} else {
				console.error('Unexpected error:', e);
				alertType = 'error';
				alertMessage = (e as Error)?.message;
			}
		}
	};
</script>

<div class="flex items-center justify-center flex-grow">
	<div class="container p-4 mx-auto">
		<div class="max-w-md p-6 mx-auto shadow-xl card bg-base-100 lg:rounded-lg">
			<a href="/settings" class="text-xl text-left btn btn-circle btn-ghost"
				><MdiArrowLeft></MdiArrowLeft></a
			>
			<h2 class="mb-4 text-2xl font-bold text-center">{$t('nav.change_email')}</h2>
			<div class="relative mb-4 form-control">
				<label class="label" for="email">
					<span class="label-text">{$t('settings.change_email.current_email')}</span>
				</label>
				<input type="email" id="email" class="input input-bordered" bind:value={email} />
				{#if formErrors?.email}
					<label class="label" for="email">
						<span class="label-text text-error">{formErrors?.email}</span>
					</label>
				{/if}
			</div>
			<p class="mb-4 text-center">
				{$t('settings.change_email.message')}
			</p>
			{#if alertType && alertMessage}
				<div class="mb-4">
					<Alert type={alertType} message={alertMessage}></Alert>
				</div>
			{/if}
			<div class="text-center">
				<button class="min-w-full btn btn-primary" onclick={handleChangeEmailClick}
					>{$t('settings.send_email')}</button
				>
			</div>
		</div>
	</div>
</div>
