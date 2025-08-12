<script lang="ts">
	import MdiArrowLeft from '~icons/mdi/arrow-left';

	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import { EmailSchema } from '$lib/schemas/auth';
	import { ZodError } from 'zod';

	import Alert from '$lib/components/Alert.svelte';
	import ChangeLanguage from '$lib/components/ChangeLanguage.svelte';

	import { t } from 'svelte-i18n';

	const { pb } = getPocketBaseInstance();

	let formErrors: Record<string, string[] | undefined> = $state({});

	let alertType = $state('');
	let alertMessage = $state('');

	let email = $state('');

	const handleResetPasswordClick = async () => {
		try {
			formErrors = {};
			EmailSchema.parse({ email });
			await pb.collection('users').requestPasswordReset(email);
			alertType = 'success';
			alertMessage = 'Please check your inbox.';
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
			<a href="/login" class="text-xl text-left btn btn-circle btn-ghost"
				><MdiArrowLeft></MdiArrowLeft></a
			>
			<h2 class="mb-4 text-2xl font-bold text-center">{$t('auth.forgot_password.title')}</h2>
			<p class="mb-4 text-center">
				{$t('auth.forgot_password.subtitle')}
			</p>
			<div class="relative mb-4 form-control">
				<label class="label" for="email">
					<span class="label-text">{$t('auth.email')}</span>
				</label>
				<input type="email" id="email" class="input input-bordered" bind:value={email} />
				{#if formErrors?.email}
					<label class="label" for="email">
						<span class="label-text text-error">{formErrors?.email}</span>
					</label>
				{/if}
			</div>

			{#if alertType && alertMessage}
				<div class="mb-4">
					<Alert type={alertType} message={alertMessage}></Alert>
				</div>
			{/if}
			<div class="mb-3 text-center">
				<button class="min-w-full btn btn-primary" onclick={handleResetPasswordClick}
					>{$t('auth.forgot_password.button')}</button
				>
			</div>

			<ChangeLanguage />
		</div>
	</div>
</div>
