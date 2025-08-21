<script lang="ts">
	import MdiEye from '~icons/mdi/eye';
	import MdiEyeOff from '~icons/mdi/eye-off';
	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte.js';
	import { signUpSchema, loginSchema } from '$lib/schemas/auth';
	import { ZodError } from 'zod';
	import Alert from './Alert.svelte';
	import { goto } from '$app/navigation';

	import { t } from 'svelte-i18n';
	import ChangeLanguage from './ChangeLanguage.svelte';

	const { pb } = getPocketBaseInstance();

	type Props = {
		signUp: boolean;
	};
	let { signUp }: Props = $props();

	let email: string = $state('');
	let name: string = $state('');
	let password: string = $state('');
	let confirmPassword: string = $state('');
	let showPassword: boolean = $state(false);
	let showConfirmPassword: boolean = $state(false);
	let formErrors: Record<string, string[] | undefined> = $state({});
	let alertType: string = $state('');
	let alertMessage: string = $state('');

	let authing = $state(false);

	const handleSignUpClick = async () => {
		authing = true;
		try {
			formErrors = {};
			signUpSchema.parse({ email, name, password, confirmPassword });
			const data = {
				name,
				email,
				emailVisibility: true,
				password,
				passwordConfirm: confirmPassword
			};
			await pb.collection('users').create(data);
			await pb.collection('users').requestVerification(email);
			await pb.collection('users').authWithPassword(email, password);
			await goto('/home');
		} catch (e) {
			if (e instanceof ZodError) {
				const { fieldErrors: errors } = e.flatten();
				formErrors = errors;
			} else {
				console.error('Unexpected error:', e);
				alertType = 'error';
				alertMessage = (e as Error)?.message;
			}
		} finally {
			authing = false;
		}
	};

	const handleLoginClick = async () => {
		authing = true;
		try {
			formErrors = {};
			loginSchema.parse({ email, password });
			await pb.collection('users').authWithPassword(email, password);
			await goto('/home');
		} catch (e) {
			if (e instanceof ZodError) {
				const { fieldErrors: errors } = e.flatten();
				formErrors = errors;
			} else {
				console.error('Unexpected error:', e);
				alertType = 'error';
				// alertMessage = (e as Error)?.message;
				alertMessage = $t('auth.wrong_info');
			}
		} finally {
			authing = false;
		}
	};
</script>

<div class="flex flex-grow items-center justify-center">
	<div class="card mx-4 max-w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="">
				<h1 class="card-title text-2xl">{$t('site_name')}</h1>
				<p class="text-gray-700">
					{$t('auth.login_to_continue')}
				</p>
			</div>

			<hr />

			<h2 class="card-title mb-2 text-center">
				{signUp ? $t('auth.sign_up.title') : $t('auth.login.title')}
			</h2>
			{#if signUp}
				<div class="form-control relative">
					<input
						type="text"
						id="name"
						class="input input-bordered"
						class:border-error={formErrors?.name}
						placeholder={$t('auth.name')}
						required
						bind:value={name}
					/>
					{#if formErrors?.username}
						<label class="label" for="name">
							<span class="label-text text-error">{formErrors?.name}</span>
						</label>
					{/if}
				</div>
			{/if}
			<div class="form-control relative">
				<input
					type="email"
					id="email"
					class="input input-bordered"
					class:border-error={formErrors?.email}
					placeholder={$t('auth.email')}
					required
					bind:value={email}
				/>
				{#if formErrors?.email}
					<label class="label" for="email">
						<span class="label-text text-error">{formErrors?.email}</span>
					</label>
				{/if}
			</div>
			<div class="form-control relative">
				<input
					type={showPassword ? 'text' : 'password'}
					id="password"
					class="input input-bordered"
					class:border-error={formErrors?.password}
					placeholder={$t('auth.password')}
					required
					bind:value={password}
				/>
				{#if showPassword}
					<button
						class="absolute right-0 top-0.5 mr-3 mt-3 cursor-pointer"
						onclick={() => (showPassword = !showPassword)}
					>
						<MdiEyeOff></MdiEyeOff>
					</button>
				{:else}
					<button
						class="absolute right-0 top-0.5 mr-3 mt-3 cursor-pointer"
						onclick={() => (showPassword = !showPassword)}
					>
						<MdiEye></MdiEye>
					</button>
				{/if}
				{#if formErrors?.password}
					<label class="label" for="password">
						<span class="label-text text-error">{formErrors?.password}</span>
					</label>
				{/if}
			</div>
			{#if signUp}
				<div class="form-control relative">
					<input
						type={showConfirmPassword ? 'text' : 'password'}
						id="confirm-password"
						class="input input-bordered"
						class:border-error={formErrors?.confirmPassword}
						placeholder={$t('auth.confirm_password')}
						required
						bind:value={confirmPassword}
					/>
					{#if showConfirmPassword}
						<button
							class="absolute right-0 top-0 mr-3 mt-3 cursor-pointer"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
						>
							<MdiEyeOff></MdiEyeOff>
						</button>
					{:else}
						<button
							class="absolute right-0 top-0 mr-3 mt-3 cursor-pointer"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
						>
							<MdiEye></MdiEye>
						</button>
					{/if}
					{#if formErrors?.confirmPassword}
						<label class="label" for="confirm-password">
							<span class="label-text text-error">{formErrors?.confirmPassword}</span>
						</label>
					{/if}
				</div>
			{/if}
			{#if alertType && alertMessage}
				<Alert type={alertType} message={alertMessage}></Alert>
			{/if}
			<div class="form-control mb-1">
				<button
					type="button"
					class="btn w-full bg-garnet-500 text-white"
					onclick={signUp ? handleSignUpClick : handleLoginClick}
					disabled={authing}>{signUp ? $t('auth.sign_up.button') : $t('auth.login.button')}</button
				>
			</div>
			{#if !signUp}
				<p class="text-center text-sm">
					<a href="/forgot-password" class="text-garnet-500"
						>{$t('auth.login.forgot_password_link')}</a
					>
				</p>
			{/if}
			<div class="text-center">
				<p class="text-sm">
					{#if signUp}
						{$t('auth.sign_up.have_account')}
						<a href="/login" class="text-garnet-500">{$t('auth.login.title')}</a>
					{:else}
						{$t('auth.login.no_account')}
						<a href="/signup" class="text-garnet-500">{$t('auth.sign_up.title')}</a>
					{/if}
				</p>
			</div>

			<ChangeLanguage />
		</div>
	</div>
</div>
