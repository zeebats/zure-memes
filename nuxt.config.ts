import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
    css: ['@unocss/reset/tailwind.css'],
    modules: [
        '@nuxtjs/supabase',
        '@pinia/nuxt',
        '@unocss/nuxt',
    ],
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
