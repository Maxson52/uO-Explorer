import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';
const locale = browser ? window.navigator.language.split('-')[0] : defaultLocale;

register('en', () => import('./locales/en.json'));
register('fr', () => import('./locales/fr.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: locale
});
