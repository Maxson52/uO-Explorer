<script lang="ts">
	import MdiCogOutline from '~icons/mdi/cog-outline';
	import MdiLogout from '~icons/mdi/logout';
	import MdiArrowRight from '~icons/mdi/arrow-right';
	import MdiCalendar from '~icons/mdi/calendar';
	import MdiMap from '~icons/mdi/map';
	import MdiMenu from '~icons/mdi/menu';

	import { getPocketBaseInstance } from '$lib/states/pocketbase.svelte';
	import { page } from '$app/state';
	import Drawer from './Drawer.svelte';
	import ChangeLanguage from './ChangeLanguage.svelte';
	import { accountSettings } from '$lib/constants';

	import { t } from 'svelte-i18n';

	const { pb } = getPocketBaseInstance();

	let isDrawerOpen: boolean = $state(false);

	function isActiveRoute(route: string): boolean {
		return page.url.pathname === route;
	}
</script>

<div class="btm-nav z-20 border-t border-base-300 bg-base-100">
	<a
		href="/home"
		class="flex flex-col items-center {isActiveRoute('/home')
			? 'active text-garnet-500'
			: 'text-base-content/70'}"
	>
		<MdiCalendar class="h-5 w-5" />
		<span class="btm-nav-label text-xs">{$t('home.schedule')}</span>
	</a>

	<a
		href="/map"
		class="flex flex-col items-center {isActiveRoute('/map')
			? 'active text-garnet-500'
			: 'text-base-content/70'}"
	>
		<MdiMap class="h-5 w-5" />
		<span class="btm-nav-label text-xs">{$t('nav.map')}</span>
	</a>

	<button
		class="flex flex-col items-center {isDrawerOpen
			? 'active text-garnet-500'
			: 'text-base-content/70'}"
		onclick={() => (isDrawerOpen = !isDrawerOpen)}
	>
		<MdiMenu class="h-5 w-5" />
		<span class="btm-nav-label text-xs">{$t('nav.more')}</span>
	</button>
</div>

{#snippet optionSnippet()}
	<!-- User Profile Section -->
	<li class="mb-4">
		<div class="flex items-center gap-3 rounded-lg bg-base-200 px-4 py-3">
			<div class="avatar placeholder">
				<div class="w-12 rounded-full bg-garnet-500 text-white">
					<span class="text-lg font-semibold">
						{pb?.authStore?.record?.name?.substring?.(0, 2).toUpperCase?.()}
					</span>
				</div>
			</div>
			<div class="flex-1">
				<div class="font-semibold">{pb?.authStore?.record?.name || 'User'}</div>
				<div class="text-sm text-base-content/70">{pb?.authStore?.record?.email || ''}</div>
			</div>
			<button class="btn btn-ghost btn-sm" onclick={() => (isDrawerOpen = !isDrawerOpen)}>
				<MdiArrowRight />
			</button>
		</div>
	</li>

	<!-- Main options -->
	<li>
		<ChangeLanguage class="text-left" />
	</li>

	<li>
		<a href="/help">Help</a>
	</li>

	<li>
		<a href="https://give.uottawa.ca/page/161844/donate/1" target="_blank" rel="noreferrer"
			>Donate</a
		>
	</li>

	<li>
		<a href="tel:613-562-5411">Emergency</a>
	</li>

	<hr class="my-4" />

	<!-- Settings Section -->
	<li>
		<a href="/settings" onclick={() => (isDrawerOpen = !isDrawerOpen)}
			><MdiCogOutline class="h-5 w-5"></MdiCogOutline>{$t('nav.settings')}</a
		>
		<ul class="ml-6">
			{#each accountSettings as setting}
				{@const IconComponent = setting?.icon}
				<li>
					<a href={setting?.pathName} onclick={() => (isDrawerOpen = !isDrawerOpen)}
						><IconComponent class="h-4 w-4"></IconComponent>{$t(`nav.${setting?.name}`)}</a
					>
				</li>
			{/each}
		</ul>
	</li>

	<hr class="my-4" />

	<!-- Logout -->
	<li>
		<button
			class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-error hover:bg-error/10"
			onclick={() => {
				pb.authStore.clear();
				isDrawerOpen = false;
			}}
		>
			<MdiLogout class="h-5 w-5"></MdiLogout>
			<span>{$t('nav.log_out')}</span>
		</button>
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

<style>
	.btm-nav {
		height: 4rem;
		padding-bottom: env(safe-area-inset-bottom, 0);
	}

	.btm-nav > * {
		padding: 0.5rem;
		min-height: auto;
	}

	.btm-nav-label {
		margin-top: 0.25rem;
	}

	.btm-nav .active {
		background-color: transparent;
	}
</style>
