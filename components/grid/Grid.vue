<template>
    <MasonryInfiniteGrid
        ref="masonry"
        :column="0"
        :gap="0"
        :observe-children="true"
        :percentage="true"
        :use-resize-observer="true"
        :use-transform="true"
        align="start"
        @request-append="handleRequestAppend"
    >
        <GridItem
            v-for="{id, key, groupKey, url: imageUrl, title} in items"
            :id="id"
            :key="key"
            :data-grid-groupkey="groupKey"
            :title="title"
            :url="imageUrl"
        />
    </MasonryInfiniteGrid>
</template>

<script setup lang="ts">
import { OnRequestAppend } from '@egjs/infinitegrid';
import { MasonryInfiniteGrid } from '@egjs/vue3-infinitegrid';

import { useImageStore } from '@/store/images';
import { useTagsStore } from '@/store/tags';
import { Image } from '@/utilities/images';

const imageStore = useImageStore();
const tagStore = useTagsStore();

interface TemplateImage extends Image {
    key: number;
    groupKey: number;
}

const numberOfItems = 7;

const masonry = ref<MasonryInfiniteGrid>();

const handleGetItems = (groupKey: number, amountOfImages: number): TemplateImage[] => {
    const imageGroup = groupKey * amountOfImages;

    return Array.from({ length: amountOfImages })
        .map((_, index): TemplateImage => {
            const key = imageGroup + index;

            const item = imageStore.imagesLoop[key];

            return {
                key,
                groupKey,
                ...item,
            };
        })
        .filter((item: TemplateImage): boolean => !Object.keys(item).every(key => [
            'key',
            'groupKey',
        ].includes(key)));
};

const items = ref<TemplateImage[]>(handleGetItems(0, numberOfItems));

const handleRequestAppend = (event: OnRequestAppend): void => {
    const nextGroupKey = (Number(event.groupKey!) || 0) + 1;

    const remainingImages = imageStore.imagesLoop.length - (numberOfItems * nextGroupKey);

    if (remainingImages <= 0) {
        return;
    }

    items.value = [
        ...items.value,
        ...handleGetItems(nextGroupKey, numberOfItems),
    ];
};

const handleChange = (): void => {
    items.value = handleGetItems(0, numberOfItems);

    if (!masonry.value) {
        return;
    }

    masonry.value.renderItems({ useResize: true });
};

watch((): (string | number)[] => [
    tagStore.query,
    imageStore.largestImageID,
], handleChange);
</script>
