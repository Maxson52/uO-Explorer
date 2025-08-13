export const ssr = false;
export const prerender = false;

// I18N
import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';

export const load = async () => {
	if (browser) {
		locale.set(localStorage.getItem('locale') || window.navigator.language);
	}
	await waitLocale();
};
