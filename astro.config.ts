import netlify from '@astrojs/netlify/functions';
import vue from '@astrojs/vue';
import unocss from '@unocss/astro';
import presetUno from '@unocss/preset-uno';
import transformerDirective from '@unocss/transformer-directives';
import { defineConfig } from 'astro/config';

export default defineConfig({
	adapter: netlify(),
	integrations: [
		vue(),
		unocss({
			presets: [presetUno()],
			theme: {
				breakpoints: {
					'3xl': '1980px',
					'4xl': '2560px',
					'5xl': '3200px',
				},
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
	],
	output: 'server',
});
