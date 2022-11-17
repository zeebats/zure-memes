import transformerDirective from '@unocss/transformer-directives';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	css: ['@unocss/reset/tailwind.css'],
	modules: [
		'@nuxtjs/supabase',
		'@pinia/nuxt',
		'@kevinmarrec/nuxt-pwa',
		'@unocss/nuxt',
	],
	postcss: {
		plugins: {
			'postcss-nested': {},
			'postcss-nested-ancestors': {},
		},
	},
	pwa: {
		icon: {
			sizes: [
				192,
				512,
			],
			source: 'public/icon.png',
		},
		manifest: {
			background_color: '#FFE100', // eslint-disable-line camelcase
			description: 'Internet\'s Zuurste Memes',
			name: 'Zure Memes',
			short_name: 'Zure Memes', // eslint-disable-line camelcase
			theme_color: '#FFE100', // eslint-disable-line camelcase
		},
		meta: {
			author: '@zeebats',
			description: 'Internet\'s Zuurste Memes',
			favicon: false,
			mobileAppIOS: true,
			name: '',
			theme_color: '#FFE100', // eslint-disable-line camelcase
		},
	},
	supabase: {
		redirect: {
			callback: '/loading',
			login: '/login',
		},
	},
	unocss: {
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
		uno: true,
	},
	vite: { build: { sourcemap: true } },
});
