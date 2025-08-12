import { pageTitles } from '$lib/constants.js';

export const ssr = false;
export const prerender = false;

// I18N
import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';

export const load = async ({ url }) => {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();

	return {
		title: pageTitles?.[url?.pathname] || ''
	};
};
