<script lang="ts">
	import MdiCogOutline from '~icons/mdi/cog-outline';
	import MdiLogout from '~icons/mdi/logout';

	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import Drawer from './Drawer.svelte';
	import ChangeLanguage from './ChangeLanguage.svelte';
	import { accountSettings } from '$lib/constants';

	import { t } from 'svelte-i18n';

	const { pb } = getPocketBaseInstance();

	let isDrawerOpen: boolean = $state(false);
</script>

<div class="navbar sticky top-0 z-20 bg-base-100">
	<div class="navbar-start">
		<a class="flex text-xl" href="/home">
			<img src="/favicon.png" alt="Favicon" class="btn btn-ghost" />
		</a>
		<a class="btn btn-ghost hidden text-xl lg:flex" href="/home">{$t('nav.home')}</a>
		<a class="btn btn-ghost hidden text-xl lg:flex" href="/map">{$t('nav.map')}</a>
		<ChangeLanguage class="btn btn-ghost hidden text-xl lg:flex" />
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
	<li class="block lg:hidden">
		<a class="" href="/home" onclick={() => (isDrawerOpen = !isDrawerOpen)}>{$t('nav.home')}</a>
	</li>
	<li class="block lg:hidden">
		<a class="" href="/map" onclick={() => (isDrawerOpen = !isDrawerOpen)}>{$t('nav.map')}</a>
	</li>
	<li class="block lg:hidden">
		<ChangeLanguage />
	</li>
	<hr class="my-2 block lg:hidden" />
	<li>
		<a href="/settings" onclick={() => (isDrawerOpen = !isDrawerOpen)}
			><MdiCogOutline></MdiCogOutline>{$t('nav.settings')}</a
		>
		<ul>
			{#each accountSettings as setting}
				{@const IconComponent = setting?.icon}
				<li>
					<a href={setting?.pathName} onclick={() => (isDrawerOpen = !isDrawerOpen)}
						><IconComponent></IconComponent>{$t(`nav.${setting?.name}`)}</a
					>
				</li>
			{/each}
		</ul>
	</li>
	<li>
		<button
			onclick={() => {
				pb.authStore.clear();
			}}><MdiLogout></MdiLogout>{$t('nav.log_out')}</button
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
