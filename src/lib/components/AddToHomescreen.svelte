<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import ChangeLanguage from './ChangeLanguage.svelte';

	interface BeforeInstallPromptEvent extends Event {
		prompt(): Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	interface InstallInstructions {
		icon: string;
		steps: string[];
	}

	let showPrompt = $state<boolean>(false);
	let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
	let isIOS = $state<boolean>(false);
	let isStandalone = $state<boolean>(false);
	let browserName = $state<string>('');

	onMount(() => {
		isStandalone =
			window.matchMedia('(display-mode: standalone)').matches ||
			(window.navigator as any).standalone === true;

		isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

		const userAgent = navigator.userAgent.toLowerCase();
		if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
			browserName = 'Chrome';
		} else if (userAgent.includes('firefox')) {
			browserName = 'Firefox';
		} else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
			browserName = 'Safari';
		} else if (userAgent.includes('edg')) {
			browserName = 'Edge';
		}

		if (isStandalone) return;

		window.addEventListener('beforeinstallprompt', (e: Event) => {
			e.preventDefault();
			deferredPrompt = e as BeforeInstallPromptEvent;
			showPrompt = true;
		});

		if (isIOS && browserName === 'Safari') {
			setTimeout(() => {
				showPrompt = true;
			}, 2000);
		}

		const dismissed = localStorage.getItem('pwa-install-dismissed');
		if (dismissed) {
			const dismissedDate = new Date(dismissed);
			const now = new Date();
			const daysDiff = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

			if (daysDiff < 7) {
				showPrompt = false;
			}
		}
	});

	async function handleInstall(): Promise<void> {
		if (deferredPrompt) {
			await deferredPrompt.prompt();
			const result = await deferredPrompt.userChoice;

			if (result.outcome === 'accepted') {
				showPrompt = false;
			}
			deferredPrompt = null;
		}
	}

	function handleDismiss(): void {
		showPrompt = false;
		localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
	}

	function getInstallInstructions(): InstallInstructions {
		if (isIOS && browserName === 'Safari') {
			return {
				icon: '⬆️',
				steps: [
					$t('install.instructions.ios.step1'),
					$t('install.instructions.ios.step2'),
					$t('install.instructions.ios.step3')
				]
			};
		} else if (browserName === 'Chrome') {
			return {
				icon: '⋮',
				steps: [
					$t('install.instructions.chrome.step1'),
					$t('install.instructions.chrome.step2'),
					$t('install.instructions.chrome.step3')
				]
			};
		} else if (browserName === 'Firefox') {
			return {
				icon: '⋮',
				steps: [
					$t('install.instructions.firefox.step1'),
					$t('install.instructions.firefox.step2'),
					$t('install.instructions.firefox.step3')
				]
			};
		} else if (browserName === 'Edge') {
			return {
				icon: '⋯',
				steps: [
					$t('install.instructions.edge.step1'),
					$t('install.instructions.edge.step2'),
					$t('install.instructions.edge.step3')
				]
			};
		}

		return {
			icon: '📱',
			steps: [$t('install.instructions.generic.step1'), $t('install.instructions.generic.step2')]
		};
	}
</script>

{#if showPrompt && !isStandalone}
	<div
		class="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm duration-300"
	>
		<div
			class="animate-in slide-in-from-bottom-8 relative w-full max-w-sm rounded-2xl bg-white shadow-2xl duration-300"
		>
			<button
				class="absolute right-4 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-1 text-2xl text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
				onclick={handleDismiss}
				aria-label={$t('install.close')}
			>
				×
			</button>

			<div class="p-8 pt-10 text-center">
				<div class="mb-4 text-5xl">📱</div>
				<h3 class="mb-2 text-2xl font-semibold text-gray-900">
					{$t('install.title')}
				</h3>
				<p class="mb-6 leading-relaxed text-gray-600">
					{$t('install.description')}
				</p>

				{#if deferredPrompt}
					<!-- Native install prompt available -->
					<button
						class="mb-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-gradient-to-r from-garnet-400 to-garnet-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-garnet-500/25 active:translate-y-0"
						onclick={handleInstall}
					>
						<span class="text-lg">📥</span>
						{$t('install.button.install')}
					</button>
				{:else}
					<!-- Manual instructions -->
					{@const instructions = getInstallInstructions()}
					<div class="mb-5 rounded-xl bg-gray-50 p-5 text-left">
						<div class="mb-3 text-center text-2xl">{instructions.icon}</div>
						<ol class="list-inside list-decimal space-y-2">
							{#each instructions.steps as step}
								<li class="text-sm leading-relaxed text-gray-700">{step}</li>
							{/each}
						</ol>
					</div>
				{/if}

				<button
					class="cursor-pointer rounded-lg border-0 bg-transparent px-4 py-2 text-sm text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
					onclick={handleDismiss}
				>
					{$t('install.button.later')}
				</button>

				<ChangeLanguage />
			</div>
		</div>
	</div>
{/if}
