import netlify from '@astrojs/netlify';
import vue from '@astrojs/vue';
import unoAstro from '@unocss/astro';
import pwa from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
	adapter: netlify(),
	integrations: [
		pwa({
			base: '/',
			devOptions: {
				enabled: true,
				navigateFallbackAllowlist: [/^\/404$/],
			},
			/* eslint-disable camelcase, @typescript-eslint/naming-convention */
			manifest: {
				background_color: '#ffffff',
				description: 'Zure Memes fo\' dat ass',
				display: 'standalone',
				icons: [
					{
						sizes: '48x48',
						src: '/icon-48.png',
						type: 'image/png',
					},
					{
						sizes: '72x72',
						src: '/icon-72.png',
						type: 'image/png',
					},
					{
						sizes: '96x96',
						src: '/icon-96.png',
						type: 'image/png',
					},
					{
						sizes: '128x128',
						src: '/icon-128.png',
						type: 'image/png',
					},
					{
						sizes: '144x144',
						src: '/icon-144.png',
						type: 'image/png',
					},
					{
						sizes: '152x152',
						src: '/icon-152.png',
						type: 'image/png',
					},
					{
						sizes: '180x180',
						src: '/icon-180.png',
						type: 'image/png',
					},
					{
						sizes: '192x192',
						src: '/icon-192.png',
						type: 'image/png',
					},
					{
						sizes: '384x384',
						src: '/icon-384.png',
						type: 'image/png',
					},
					{
						sizes: '512x512',
						src: '/icon-512.png',
						type: 'image/png',
					},
				],
				id: 'zure-memes',
				lang: 'en-US',
				name: 'Zure Memes',
				orientation: 'portrait-primary',
				short_name: 'Zure Memes',
				start_url: '/?pwa=true',
				theme_color: '#FFE100',
			},
			/* eslint-enable camelcase, @typescript-eslint/naming-convention */
			mode: 'development',
			registerType: 'autoUpdate',
			scope: '/',
			workbox: {
				globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
				navigateFallback: '/404',
			},
		}),
		vue(),
		unoAstro({ injectReset: true }),
	],
	output: 'server',
	vite: { ssr: { noExternal: ['@vuelidate/core'] } },
});
