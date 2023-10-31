import netlify from '@astrojs/netlify';
import vue from '@astrojs/vue';
import unoAstro from '@unocss/astro';
// import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
	adapter: netlify(),
	integrations: [
		vue(),
		unoAstro({ injectReset: true }),
		// AstroPWA({ // eslint-disable-line new-cap
		// https://github.com/vite-pwa/astro/blob/main/examples/pwa-simple
		// }),
	],
	output: 'server',
	vite: { ssr: { noExternal: ['@vuelidate/core'] } },
});
