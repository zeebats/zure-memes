import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
    modules: [
        '@nuxtjs/supabase',
        '@unocss/nuxt',
    ],
    unocss: { uno: true },
});
