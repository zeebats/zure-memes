import { defineNuxtConfig } from 'nuxt';

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
            background_color: '#C39E29', // eslint-disable-line camelcase
            description: 'Internet\'s Zuurste Memes',
            name: 'Zure Memes',
            short_name: 'Zure Memes', // eslint-disable-line camelcase
            theme_color: '#C39E29', // eslint-disable-line camelcase
        },
        meta: {
            author: '@zeebats',
            description: 'Internet\'s Zuurste Memes',
            favicon: false,
            mobileAppIOS: true,
            name: '',
            theme_color: '#C39E29', // eslint-disable-line camelcase
        },
    },
    unocss: {
        theme: {
            breakpoints: {
                '3xl': '1980px',
                '4xl': '2560px',
                '5xl': '3200px',
            },
        },
        uno: true,
    },
    vite: { build: { sourcemap: true } },
});
