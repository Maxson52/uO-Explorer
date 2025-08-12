<script lang="ts">
	import MdiCogOutline from '~icons/mdi/cog-outline';
	import MdiLogout from '~icons/mdi/logout';

	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import Drawer from './Drawer.svelte';
	import { accountSettings } from '$lib/constants';

	const { pb } = getPocketBaseInstance();

	let isDrawerOpen: boolean = $state(false);
</script>

<div class="sticky top-0 z-10 mt-1 navbar bg-base-100">
	<div class="navbar-start">
		<a class="hidden text-xl btn btn-ghost lg:flex" href="/home">Home</a>
	</div>
	<div class="navbar-end">
		<button
			class="avatar placeholder btn btn-circle btn-primary"
			onclick={() => (isDrawerOpen = !isDrawerOpen)}
		>
			<div class="w-12 rounded-full bg-neutral text-neutral-content">
				<span>{pb?.authStore?.record?.name?.substring?.(0, 2).toUpperCase?.()}</span>
			</div>
		</button>
	</div>
</div>

{#snippet optionSnippet()}
	<li>
		<a href="/settings" onclick={() => (isDrawerOpen = !isDrawerOpen)}
			><MdiCogOutline></MdiCogOutline>Settings</a
		>
		<ul>
			{#each accountSettings as setting}
				{@const IconComponent = setting?.icon}
				<li>
					<a href={setting?.pathName} onclick={() => (isDrawerOpen = !isDrawerOpen)}
						><IconComponent></IconComponent>{setting?.name}</a
					>
				</li>
			{/each}
		</ul>
	</li>
	<li>
		<button
			onclick={() => {
				pb.authStore.clear();
			}}><MdiLogout></MdiLogout>Log Out</button
		>
	</li>
{/snippet}
{#snippet overlaySnippet()}
	<button
		aria-label="close sidebar"
		class="drawer-overlay"
		onclick={() => (isDrawerOpen = !isDrawerOpen)}
	></button>
{/snippet}

<Drawer id="profile-drawer" {isDrawerOpen} {optionSnippet} {overlaySnippet}></Drawer>
