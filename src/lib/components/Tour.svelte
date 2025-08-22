<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
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
			beforeLeave: () => goto('map')
		},
		{
			title: $t('tour.steps.3.title'),
			content: $t('tour.steps.3.body'),
			fixed: true,
			beforeEnter: () => tg.setOptions({ hidePrev: true })
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
		if (!localStorage.getItem('tour-completed') && page.url.pathname == '/home')
			setTimeout(() => tg.start(), 150);

		document.querySelector('.tour-step-2')?.addEventListener('click', () => {
			if (!tg.isFinished() && !localStorage.getItem('tour-completed')) tg.nextStep();
		});
		document.querySelector('.tour-step-3')?.addEventListener('click', () => {
			if (!tg.isFinished() && !localStorage.getItem('tour-completed')) tg.finishTour();
		});
	});

	tg.onAfterExit(() => {
		localStorage.setItem('tour-completed', 'true');
	});
</script>
