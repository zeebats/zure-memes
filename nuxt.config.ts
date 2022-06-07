import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
    css: ['@unocss/reset/tailwind.css'],
    modules: [
        '@nuxtjs/supabase',
        '@unocss/nuxt',
    ],
    unocss: { uno: true },
});
