<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { setPocketBaseInstance, getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import { locale, t } from 'svelte-i18n';
	import AddToHomescreen from '$lib/components/AddToHomescreen.svelte';

	setPocketBaseInstance();
	const { pb } = getPocketBaseInstance();
	pb.authStore.onChange(async (token, record) => {
		if (token) await goto('/home');
	});
	onMount(async () => {
		try {
			// validate server-side the auth state
			pb.authStore.isValid && (await pb.collection('users').authRefresh());
		} catch (error) {
			pb.authStore.clear();
		}

		if (pb.authStore.isValid) {
			await goto('/home');
		}
	});
	let {
		children,
		data
	}: {
		children: Snippet;
		data: any[];
	} = $props();
</script>

{#if !pb.authStore.isValid}
	<AddToHomescreen />

	<div class="flex min-h-[100dvh] flex-col">
		<div class="flex flex-grow items-center justify-center bg-base-200">
			{@render children()}
		</div>
	</div>

	<div class="relative h-full">
		<footer class="fixed bottom-6 flex w-full items-center justify-center gap-2">
			<span class="text-lg font-semibold">{$t('auth.powered_by')}</span>
			<a
				href="https://www.uottawa.ca/faculty-engineering/centre-entrepreneurship-engineering-design"
				target="_blank"
				rel="noreferrer"
			>
				<img
					src={$locale == 'fr' ? '/CGEC_black.svg' : '/CEED_black.svg'}
					alt="CEED Logo"
					class="h-5"
				/>
			</a>
			&
			<a href="https://www.uottawa.ca/alumni/alumni-association" target="_blank" rel="noreferrer">
				<img src="/alumni_logo.png" alt="Alumni Logo" class="h-7" />
			</a>
		</footer>
	</div>
{/if}
