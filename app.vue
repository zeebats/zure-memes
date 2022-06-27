<template>
    <NuxtPage />
</template>

<script setup lang="ts">
import { useDeviceStore } from '@/store/device';

useHead({
    title: 'Zure Memes',
    meta: [
        {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
    ],
    link: [
        {
            rel: 'icon',
            href: '/favicon.svg',
            type: 'image/svg+xml',
        },
    ],
});

const deviceStore = useDeviceStore();

const touchObserver = ref<MediaQueryList>();

const handleTouchObserver = ({ matches }: MediaQueryListEvent | { matches: boolean }): void => {
    deviceStore.change({
        property: 'touch',
        payload: matches,
    });
};

onMounted((): void => {
    touchObserver.value = window.matchMedia('(hover: none)');
    touchObserver.value.addEventListener('change', handleTouchObserver);

    const { matches } = touchObserver.value;

    handleTouchObserver({ matches });
});
</script>
