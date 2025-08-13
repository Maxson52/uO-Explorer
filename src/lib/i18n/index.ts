import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';
const storedLocale = browser ? localStorage.getItem('locale') : null;
const locale =
	storedLocale === 'fr' ? 'fr' : browser ? window.navigator.language.split('-')[0] : defaultLocale;

register('en', () => import('./locales/en.json'));
register('fr', () => import('./locales/fr.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: locale
});
