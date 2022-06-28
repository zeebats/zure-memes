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
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon.png',
        },
        {
            rel: 'icon',
            href: '/favicon.svg',
            type: 'image/svg+xml',
        },
    ],
});

const deviceStore = useDeviceStore();

const touchObserver = ref<MediaQueryList>();
const viewportObserver = ref<boolean>(false);

const handleTouchObserver = ({ matches }: MediaQueryListEvent | { matches: boolean }): void => {
    deviceStore.change('touch', matches);
};

const handleViewportObserver = ({ target }: Event): void => {
    if (viewportObserver.value) {
        return;
    }

    viewportObserver.value = true;

    requestAnimationFrame(() => {
        viewportObserver.value = false;

        const { height: visualHeight } = target as VisualViewport;
        const { innerHeight: windowHeight } = window;

        deviceStore.change('keyboard', visualHeight !== windowHeight);
    });

};

onMounted((): void => {
    touchObserver.value = window.matchMedia('(hover: none)');
    touchObserver.value.addEventListener('change', handleTouchObserver);

    const { matches } = touchObserver.value;

    handleTouchObserver({ matches });

    window.visualViewport.addEventListener('resize', handleViewportObserver);
});
</script>

<style lang="postcss">
:root {
    --saib: env(safe-area-inset-bottom, 0);
}
</style>
