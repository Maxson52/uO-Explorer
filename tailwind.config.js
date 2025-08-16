/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'garnet-400': '#9c1c30',
				'garnet-500': '#8f001a'
			}
		}
	},
	plugins: [daisyui],
	daisyui: {
		themes: ['light']
	}
};
