<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { setPocketBaseInstance, getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Tour from '$lib/components/Tour.svelte';

	function getRedirect() {
		const path = sessionStorage.getItem('redirect');
		sessionStorage.removeItem('redirect');
		return path;
	}
	function setRedirect(path: string) {
		sessionStorage.setItem('redirect', path);
	}

	setPocketBaseInstance();
	const { pb } = getPocketBaseInstance();

	pb.authStore.onChange(async (token, record) => {
		if (!token) await goto('/');
		else {
			const path = getRedirect();
			if (path) await goto(path);
		}
	});
	onMount(async () => {
		try {
			// validate server-side the auth state
			pb.authStore.isValid && (await pb.collection('users').authRefresh());
		} catch (error) {
			pb.authStore.clear();
		}

		if (!pb.authStore.isValid) {
			setRedirect(window.location.pathname);
			await goto('/');
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

{#if pb.authStore.isValid}
	<div class="flex min-h-[100dvh] flex-col bg-base-200 pb-16">
		<Navbar></Navbar>
		{@render children()}

		<Tour />
	</div>
{/if}
