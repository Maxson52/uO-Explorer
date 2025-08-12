<script lang="ts">
	import { locale } from 'svelte-i18n';
</script>

<div class="text-center">
	<button
		class="min-w-full text-sm text-primary"
		onclick={() => ($locale == 'en' ? locale.set('fr') : locale.set('en'))}
	>
		{$locale == 'en' ? 'Français' : 'English'}
	</button>
</div>
