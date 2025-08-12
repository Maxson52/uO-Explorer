<script lang="ts">
	import MdiEye from '~icons/mdi/eye';
	import MdiEyeOff from '~icons/mdi/eye-off';
	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte.js';
	import { signUpSchema, loginSchema } from '$lib/schemas/auth';
	import { ZodError } from 'zod';
	import Alert from './Alert.svelte';
	import { goto } from '$app/navigation';

	import { t } from 'svelte-i18n';

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

	const handleSignUpClick = async () => {
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
		}
	};

	const handleLoginClick = async () => {
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
				alertMessage = (e as Error)?.message;
			}
		}
	};
</script>

<div class="flex items-center justify-center flex-grow">
	<div class="shadow-xl card w-96 bg-base-100">
		<div class="card-body">
			<h2 class="text-center card-title">{signUp ? 'Sign Up' : 'Log In'}</h2>
			{#if signUp}
				<div class="relative mb-4 form-control">
					<input
						type="text"
						id="name"
						class="input input-bordered"
						class:border-error={formErrors?.name}
						placeholder="Name"
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
			<div class="relative mb-4 form-control">
				<input
					type="email"
					id="email"
					class="input input-bordered"
					class:border-error={formErrors?.email}
					placeholder="Email Address"
					required
					bind:value={email}
				/>
				{#if formErrors?.email}
					<label class="label" for="email">
						<span class="label-text text-error">{formErrors?.email}</span>
					</label>
				{/if}
			</div>
			<div class="relative mb-4 form-control">
				<input
					type={showPassword ? 'text' : 'password'}
					id="password"
					class="input input-bordered"
					class:border-error={formErrors?.password}
					placeholder="Password"
					required
					bind:value={password}
				/>
				{#if showPassword}
					<button
						class="absolute top-0 right-0 mt-3 mr-3 cursor-pointer"
						onclick={() => (showPassword = !showPassword)}
					>
						<MdiEyeOff></MdiEyeOff>
					</button>
				{:else}
					<button
						class="absolute top-0 right-0 mt-3 mr-3 cursor-pointer"
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
				<div class="relative mb-4 form-control">
					<input
						type={showConfirmPassword ? 'text' : 'password'}
						id="confirm-password"
						class="input input-bordered"
						class:border-error={formErrors?.confirmPassword}
						placeholder="Confirm Password"
						required
						bind:value={confirmPassword}
					/>
					{#if showConfirmPassword}
						<button
							class="absolute top-0 right-0 mt-3 mr-3 cursor-pointer"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
						>
							<MdiEyeOff></MdiEyeOff>
						</button>
					{:else}
						<button
							class="absolute top-0 right-0 mt-3 mr-3 cursor-pointer"
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
			<div class="form-control">
				<button
					type="button"
					class="w-full btn btn-primary"
					onclick={signUp ? handleSignUpClick : handleLoginClick}
					>{signUp ? 'Sign Up' : 'Log In'}</button
				>
			</div>
			{#if !signUp}
				<p class="text-sm text-center">
					<a href="/forgot-password" class="text-primary">Forgot your password?</a>
				</p>
			{/if}
			<div class="mt-4 text-center">
				<p class="text-sm">
					{#if signUp}
						Already have an account? <a href="/login" class="text-primary">Log In</a>
					{:else}
						Don't have an account? <a href="/signup" class="text-primary">Sign Up</a>
					{/if}
				</p>
			</div>
		</div>
	</div>
</div>
