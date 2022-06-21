<template>
    <div class="w-100% p-2 md:w-1/2 lg:w1/3 2xl:w1/4 3xl:w1/5 4xl:w1/6 5xl:w1/7">
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
        <div
            ref="item"
            class="grid focus-within:ring-4 ring-blue-300 dark:ring-blue-800 overflow-hidden"
            @click="handleClick"
            @pointerenter="handlePointerEnter"
            @pointerleave="handlePointerLeave"
        >
            <button
                class="aspect-ratio-[355/200] outline-none col-[1/-1] row-[1/-1] relative -z-1 appearance-none"
                @focus="handleFocus"
            />
            <figure class="col-[1/-1] row-[1/-1] self-center">
                <img
                    :src="url"
                    :alt="title"
                    class="block w-full"
                    loading="lazy"
                    decoding="async"
                >
            </figure>
            <Transition
                enter-from-class="transform opacity-0"
                enter-active-class="duration-200 ease-out"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-active-class="duration-100 ease-in"
                leave-to-class="transform opacity-0"
            >
                <div
                    v-show="hover"
                    class="h-100% grid gap-y-2 col-[1/-1] row-[1/-1] relative z-0 will-change-transform"
                >
                    <div
                        class="absolute top-0 left-0 w-100% h-35% -z-1 op-75"
                        :class="[$style['gradient--top']]"
                    />
                    <div class="self-start flex justify-between gap-x-2 p-4">
                        <Button
                            type="button"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            @click="handleCopy"
                        >
                            <span class="w-4 h-4 relative -bottom-[0.3ex] mr-2 -ml-1">
                                <svg
                                    class="block w-full h-full"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    aria-hidden="true"
                                    role="img"
                                    width="32"
                                    height="32"
                                    preserveAspectRatio="xMidYMid meet"
                                    viewBox="0 0 32 32"
                                ><path
                                    fill="currentColor"
                                    d="M11.947 19a4.948 4.948 0 0 1-3.499-8.447l5.106-5.104a4.948 4.948 0 0 1 6.998 6.998l-.553.552l-1.415-1.413l.557-.557a2.95 2.95 0 0 0-.004-4.166a3.02 3.02 0 0 0-4.17 0l-5.104 5.104a2.947 2.947 0 0 0 0 4.17a3.02 3.02 0 0 0 4.17 0l1.414 1.414a4.918 4.918 0 0 1-3.5 1.449Z"
                                /><path
                                    fill="currentColor"
                                    d="M19.947 17a4.948 4.948 0 0 1-3.499-8.447l.553-.552l1.414 1.415l-.552.552a2.948 2.948 0 0 0 0 4.169a3.02 3.02 0 0 0 4.17 0l5.105-5.105a2.951 2.951 0 0 0 0-4.168a3.02 3.02 0 0 0-4.17 0l-1.414-1.415a4.948 4.948 0 0 1 6.998 6.998l-5.104 5.103a4.92 4.92 0 0 1-3.5 1.45Z"
                                /><path
                                    fill="currentColor"
                                    d="M24 30H4a2.002 2.002 0 0 1-2-2V8a2.002 2.002 0 0 1 2-2h4v2H4v20h20V18h2v10a2.002 2.002 0 0 1-2 2Z"
                                /></svg>
                            </span>
                            Copy
                        </Button>
                        <Button
                            type="submit"
                            class="text-white bg-orange-700 hover:bg-orange-800 focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                            @click="handleEdit"
                        >
                            <span class="w-4 h-4 relative -bottom-[0.4ex] mr-2 -ml-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    aria-hidden="true"
                                    role="img"
                                    class="block w-full h-full"
                                    width="32"
                                    height="32"
                                    preserveAspectRatio="xMidYMid meet"
                                    viewBox="0 0 32 32"
                                ><path
                                    fill="currentColor"
                                    d="M2 26h28v2H2zM25.4 9c.8-.8.8-2 0-2.8l-3.6-3.6c-.8-.8-2-.8-2.8 0l-15 15V24h6.4l15-15zm-5-5L24 7.6l-3 3L17.4 7l3-3zM6 22v-3.6l10-10l3.6 3.6l-10 10H6z"
                                /></svg>
                            </span>
                            Edit
                        </Button>
                    </div>
                    <div class="grid gap-y-2 self-end relative z-0 p-4">
                        <div
                            class="absolute bottom-0 left-0 w-100% h-135% -z-1"
                            :class="[$style['gradient--bottom']]"
                        />
                        <span
                            class="text-white text-shadow-sm font-semibold text-lg"
                            style="--un-text-shadow-color: black"
                        >{{ title }}</span>
                        <ul
                            v-if="tags"
                            class="flex flex-wrap gap-x-2 gap-y-1"
                        >
                            <li
                                v-for="{ id: tagId, name, color } in tags"
                                :key="tagId"
                                :style="{
                                    'color': color.foreground,
                                    'backgroundColor': color.background,
                                }"
                                class="text-xs py-1 px-1.5 leading-tight rounded"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </Transition>
            <Transition
                enter-from-class="transform opacity-0 translate-y-2"
                enter-active-class="duration-200 ease-out"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-active-class="duration-100 ease-in"
                leave-to-class="transform opacity-0 translate-y-2"
            >
                <div
                    v-if="copied"
                    class="col-[1/-1] row-[1/-1] grid place-items-center relative z-1 pointer-events-none"
                >
                    <button
                        type="button"
                        class="px-3 py-1.5 rounded text-white shadow-sm"
                        :class="
                            [
                                copyStatus === 'success' && 'bg-green-600 shadow-green-900',
                                copyStatus === 'error' && 'bg-red-600 shadow-red-900'
                            ]
                        "
                        @click="handleCopyReset"
                    >
                        {{ copyContent }}
                    </button>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDialogStore } from '@/store/dialog';
import { useTagsStore } from '@/store/tags';

const properties = withDefaults(defineProps<{
    id: number;
    url: string;
    title: string;
}>(), {
    id: null,
    url: null,
    title: null,
});

const dialogStore = useDialogStore();
const tagStore = useTagsStore();

const item = ref(null);

const copied = ref<Boolean>(false);
const copyContent = ref<String>('');
const copyStatus = ref<'success'|'error'|''>('');

let copyTimer: ReturnType<typeof setTimeout> | null = null;

const hover = ref<Boolean>(false);

const tags = computed(() => tagStore.tagsByImageId[properties.id]);

const handleCopyReset = (): void => {
    copied.value = false;
    copyStatus.value = '';
    copyContent.value = '';

    clearTimeout(copyTimer);
};

const handleCopy = async (): Promise<void> => {
    try {
        await navigator.clipboard.writeText(properties.url);
        copyStatus.value = 'success';
        copyContent.value = 'Copied to clipboard!';
    } catch (error) {
        copyStatus.value = 'error';
        copyContent.value = error;
    } finally {
        copied.value = true;

        copyTimer = setTimeout(handleCopyReset, copyStatus.value === 'success' ? 2500 : 5000);
    }
};

const handleEdit = () => {
    dialogStore.create({ image: properties.id });
};

const handleClick = (): void => {
    if (!window.matchMedia('(pointer:coarse)').matches) {
        return;
    }

    hover.value = !hover.value;
};

const handlePointerEnter = (): void => {
    if (!window.matchMedia('(pointer:fine)').matches) {
        return;
    }

    hover.value = true;
};

const handlePointerLeave = (): void => {
    if (!window.matchMedia('(pointer:fine)').matches) {
        return;
    }

    hover.value = false;
};

const handleFocus = (): void => {
    hover.value = true;

    document.addEventListener('focus', function focusChecker(): void {
        if (item.value.contains(document.activeElement)) {
            return;
        }

        hover.value = false;

        document.removeEventListener('focus', focusChecker);
    }, true);
};

onMounted((): void => {
    document.addEventListener('click', event => {
        if (!event.composedPath().includes(item.value) && hover.value) {
            hover.value = false;
        }
    });
});
</script>

<style lang="postcss" module>
.gradient--top {
    background-image: linear-gradient(
        to top,
        hsla(0, 0%, 0%, 0) 0%,
        hsla(0, 0%, 0%, 0.013) 4.9%,
        hsla(0, 0%, 0%, 0.049) 9.5%,
        hsla(0, 0%, 0%, 0.104) 14%,
        hsla(0, 0%, 0%, 0.175) 18.6%,
        hsla(0, 0%, 0%, 0.259) 23.3%,
        hsla(0, 0%, 0%, 0.352) 28.1%,
        hsla(0, 0%, 0%, 0.45) 33.4%,
        hsla(0, 0%, 0%, 0.55) 39%,
        hsla(0, 0%, 0%, 0.648) 45.2%,
        hsla(0, 0%, 0%, 0.741) 52.1%,
        hsla(0, 0%, 0%, 0.825) 59.7%,
        hsla(0, 0%, 0%, 0.896) 68.2%,
        hsla(0, 0%, 0%, 0.951) 77.7%,
        hsla(0, 0%, 0%, 0.987) 88.2%,
        hsl(0, 0%, 0%) 100%
    );
}
.gradient--bottom {
    background-image: linear-gradient(
        to bottom,
        hsla(0, 0%, 0%, 0) 0%,
        hsla(0, 0%, 0%, 0.013) 4.9%,
        hsla(0, 0%, 0%, 0.049) 9.5%,
        hsla(0, 0%, 0%, 0.104) 14%,
        hsla(0, 0%, 0%, 0.175) 18.6%,
        hsla(0, 0%, 0%, 0.259) 23.3%,
        hsla(0, 0%, 0%, 0.352) 28.1%,
        hsla(0, 0%, 0%, 0.45) 33.4%,
        hsla(0, 0%, 0%, 0.55) 39%,
        hsla(0, 0%, 0%, 0.648) 45.2%,
        hsla(0, 0%, 0%, 0.741) 52.1%,
        hsla(0, 0%, 0%, 0.825) 59.7%,
        hsla(0, 0%, 0%, 0.896) 68.2%,
        hsla(0, 0%, 0%, 0.951) 77.7%,
        hsla(0, 0%, 0%, 0.987) 88.2%,
        hsl(0, 0%, 0%) 100%
    );
}
</style>
