/* eslint-disable @typescript-eslint/naming-convention, sort-keys, perfectionist/sort-objects */

import transformerDirectives from '@unocss/transformer-directives';
import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
	presets: [presetUno()],
	theme: {
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
	transformers: [transformerDirectives()],
});

