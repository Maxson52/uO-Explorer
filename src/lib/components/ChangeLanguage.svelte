<script lang="ts">
	import { locale } from 'svelte-i18n';

	let { class: classes = '' } = $props();

	function changeLanguage() {
		if ($locale == 'en') {
			locale.set('fr');
			localStorage.setItem('locale', 'fr');
		} else {
			locale.set('en');
			localStorage.removeItem('locale');
		}
	}
</script>

<div class="text-center">
	<button class={'min-w-full text-sm text-garnet-500 ' + classes} onclick={changeLanguage}>
		{$locale == 'en' ? 'Français' : 'English'}
	</button>
</div>
