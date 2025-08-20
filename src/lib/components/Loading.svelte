<script>
	import { t } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
</script>

<section
	class="fixed left-0 top-0 z-50 grid h-screen w-full place-items-center"
	transition:fade={{ duration: 200 }}
>
	<div class="rounded-xl bg-white p-6 shadow-lg">
		<svg
			version="1.2"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 240 240"
			width="240"
			height="240"
			class="logo mx-auto h-16 w-auto"
		>
			<style>
				.a {
					fill: #8f001a;
				}
			</style>
			<path
				class="a"
				d="m193.4 46.4v-12.7h-24.1c-10.4-16.5-27.7-25.7-49.8-25.7-22 0-39.6 9.2-49.7 25.7h-24.2v12.7h-23.6v185.7h195.2v-185.7h-23.6zm-161.1 175.2v-164.8h23.6v-12.7h19.7l1.6-2.7c10.3-19.2 28.9-23.1 42.3-23.1 13.5 0 32 4.1 42.3 23.1l1.6 2.7h19.7v12.7h23.6v164.8h-174.6z"
			/><path fill-rule="evenodd" class="a" d="m193.2 188.4v5.7h-147.6v-5.7z" /><path
				fill-rule="evenodd"
				class="a"
				d="m196.4 199.9v5.7h-153.7v-5.7z"
			/><path
				class="a"
				d="m185.4 172.4l-1.5-56.9c0.6 0.4 1 0.6 1.7 0.6 1.8 0 3.4-1.4 3.4-3.4 0-1.9-0.4-1.7-1-2.3h2.5v-5.7h-141.8v5.7h2.6c-0.6 0.6-1 1.4-1 2.3 0 1.8 1.3 3.4 3.3 3.4 1.9 0 1.2-0.2 1.8-0.6l-1.6 56.9h-5.1v10.4h141.6v-10.4h-5.1zm-29.4-56.5c1.8 0 3.3-1.4 3.3-3.4 0-1.9-0.4-1.7-1-2.3h11.5c-0.5 0.6-0.9 1.4-0.9 2.3 0 1.8 1.3 3.4 3.3 3.4 1.9 0 1.2-0.2 1.7-0.6l-1.5 56.9h-16.6l-1.6-56.9c0.6 0.4 1 0.6 1.8 0.6zm-29.6 0c1.7 0 3.3-1.4 3.3-3.4 0-1.9-0.4-1.7-1-2.3h11.5c-0.6 0.6-1 1.4-1 2.3 0 1.8 1.4 3.4 3.3 3.4 2 0 1.2-0.2 1.8-0.6l-1.6 56.9h-16.5l-1.6-56.9c0.6 0.4 1 0.6 1.8 0.6zm-29.7 0c1.8 0 3.3-1.4 3.3-3.4 0-1.9-0.4-1.7-1-2.3h11.7c-0.5 0.6-0.9 1.4-0.9 2.3 0 1.8 1.3 3.4 3.3 3.4 1.9 0 1.2-0.2 1.7-0.6l-1.5 56.9h-16.6l-1.6-56.9c0.6 0.4 1 0.6 1.8 0.6zm-31.4-0.6c0.6 0.4 1 0.6 1.8 0.6 1.7 0 3.3-1.4 3.3-3.4 0-1.9-0.4-1.7-1-2.3h11.5c-0.6 0.6-1 1.4-1 2.3 0 1.8 1.4 3.4 3.3 3.4 2 0 1.2-0.2 1.8-0.6l-1.6 56.9h-16.5z"
			/><path
				fill-rule="evenodd"
				class="a"
				d="m134.7 68.5l-15.2-5.7-15 5.7-61.8 22.6 3.7 9.7 73.1-26.9 73.4 26.9 3.5-9.7-61.7-22.6z"
			/>
		</svg>

		<h1 class="mt-4 text-center text-3xl font-bold">
			{$t('loading')}...
		</h1>
	</div>
</section>

<style lang="postcss">
	.logo {
		transform-origin: center;
		animation: spin-bounce 2s infinite;
	}

	@keyframes spin-bounce {
		0% {
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
		25% {
			transform: translateY(-25%);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		50% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
		60% {
			transform: translateY(-10%);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		70% {
			transform: translateY(0);
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
