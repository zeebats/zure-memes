import netlify from '@astrojs/netlify';
import vue from '@astrojs/vue';
import uno from '@unocss/astro';
import presetUno from '@unocss/preset-uno';
import transformerDirective from '@unocss/transformer-directives';
// import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
	adapter: netlify(),
	integrations: [
		vue(),
		uno({ // eslint-disable-line new-cap
			presets: [presetUno()],
			theme: {
				/* eslint-disable sort-keys */
				breakpoints: {
					'sm': '640px',
					'md': '768px',
					'lg': '1024px',
					'xl': '1280px',
					'2xl': '1536px',
					'3xl': '1980px',
					'4xl': '2560px',
					'5xl': '3200px',
				},
				/* eslint-enable sort-keys */
				colors: {
					primary: {
						100: '#FFFCE3',
						200: '#FFF5AA',
						300: '#FFEF71',
						400: '#FFE839',
						500: '#FFE100',
						600: '#C6AF00',
						700: '#8E7D00',
						800: '#554B00',
						900: '#1C1900',
					},
				},
			},
			transformers: [transformerDirective()],
		}),
		// AstroPWA({ // eslint-disable-line new-cap
		// https://github.com/vite-pwa/astro/blob/main/examples/pwa-simple
		// }),
	],
	output: 'server',
	vite: { ssr: { noExternal: ['@vuelidate/core'] } },
});
