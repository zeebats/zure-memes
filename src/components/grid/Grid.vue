<template>
	<MasonryInfiniteGrid
		ref="masonry"
		:column="0"
		:gap="0"
		:observe-children="true"
		:percentage="true"
		:threshold="50"
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
import { useStore } from '@nanostores/vue';
import { ref, watch } from 'vue';

import GridItem from '@/components/grid/Item.vue';
import { $search as $storeSearch, imagesLoop, largestImageID } from '@/store/images';
import { Image } from '@/utilities/images';

interface TemplateImage extends Image {
    groupKey: number;
    key: number;
}

const $imagesLoop = useStore(imagesLoop);
const $largestImageID = useStore(largestImageID);
const $search = useStore($storeSearch);

const numberOfItems = 7;

const masonry = ref<MasonryInfiniteGrid>();

const handleGetItems = (groupKey: number, amountOfImages: number) => {
	const imageGroup = groupKey * amountOfImages;

	return Array.from({ length: amountOfImages })
		.map((_, index) => {
			const key = imageGroup + index;

			const item = $imagesLoop.value[key];

			return {
				groupKey,
				key,
				...item,
			};
		})
		.filter((item: TemplateImage) => !Object.keys(item).every(key => [
			'groupKey',
			'key',
		].includes(key)));
};

const items = ref<TemplateImage[]>(handleGetItems(0, numberOfItems));

const handleRequestAppend = (event: OnRequestAppend) => {
	const nextGroupKey = (Number(event.groupKey!) || 0) + 1;

	const remainingImages = $imagesLoop.value.length - (numberOfItems * nextGroupKey);

	if (remainingImages <= 0) {
		return;
	}

	items.value = [
		...items.value,
		...handleGetItems(nextGroupKey, numberOfItems),
	];
};

const handleChange = () => {
	items.value = handleGetItems(0, numberOfItems);

	if (!masonry.value) {
		return;
	}

	masonry.value.renderItems({ useResize: true });
};

watch(() => [
	$search.value,
	$largestImageID.value,
], handleChange);
</script>
