<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import '@sjmc11/tourguidejs/src/scss/tour.scss';
	import { TourGuideClient } from '@sjmc11/tourguidejs/src/Tour';
	import type { TourGuideStep } from '@sjmc11/tourguidejs/src/types/TourGuideStep';
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';

	const steps: TourGuideStep[] = [
		{
			title: $t('tour.steps.1.title'),
			content: $t('tour.steps.1.body'),
			target: '.tour-step-1'
		},
		{
			title: $t('tour.steps.2.title'),
			content: $t('tour.steps.2.body'),
			target: '.tour-step-2',
			fixed: true,
			beforeEnter: () => tg.setOptions({ hideNext: true })
		},
		{
			title: $t('tour.steps.3.title'),
			content: $t('tour.steps.3.body'),
			fixed: true,
			beforeEnter: () => tg.setOptions({ hidePrev: true, hideNext: false })
		},
		{
			title: $t('tour.steps.4.title'),
			content: $t('tour.steps.4.body'),
			target: '.tour-step-3',
			fixed: true,
			beforeEnter: () => tg.setOptions({ hidePrev: false, exitOnClickOutside: true })
		}
	];

	const tg = new TourGuideClient({
		steps: steps,
		targetPadding: 0,
		nextLabel: $t('tour.next'),
		prevLabel: $t('tour.previous'),
		finishLabel: $t('tour.finish'),
		exitOnClickOutside: false,
		exitOnEscape: false,
		showStepDots: false,
		backdropClass: 'tour-backdrop'
	});

	onMount(() => {
		if (!localStorage.getItem('tour-completed') && page.url.pathname == '/home') tg.start();
	});

	tg.onAfterExit(() => {
		localStorage.setItem('tour-completed', 'true');
	});

	afterNavigate((nav) => {
		if (nav?.to?.route.id == '/(app)/map' && tg.activeStep == 1) tg.nextStep();
	});
</script>
