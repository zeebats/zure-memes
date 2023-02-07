<template>
	<form
		class="grid gap-4"
		@submit.prevent="handleSubmit"
	>
		<InputUrl
			v-model="url"
			:disabled="loading"
		/>
		<InputTitle
			v-model="title"
			:disabled="loading"
		/>
		<InputTags
			v-model="tags"
			:disabled="loading"
		/>
		<Button
			type="submit"
			class="flex-grow text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-opacity"
			:disabled="loading"
			:class="[loading && 'op-50']"
		>
			{{ properties.edit ? 'Update meme' : 'Add meme' }}
		</Button>
	</form>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';

import { $supabase } from '@/api/supabase';
import { DialogProperties } from '@/store/dialogs';
import { imagesById, upsert as upsertImage } from '@/store/images';
import { useMemesStore } from '@/store/memes';
import { useTagsStore } from '@/store/tags';
import { Meme } from '@/utilities/memes';
import { Tag } from '@/utilities/tags';
import { setTimestamp } from '@/utilities/timestamp';

const properties = withDefaults(defineProps<{
    edit?: DialogProperties['image'];
}>(), { edit: undefined /* eslint-disable-line no-undefined */ });

const emit = defineEmits<{
    (e: 'added'): void; /* eslint-disable-line unicorn/prevent-abbreviations, no-unused-vars */
}>();

const loading = ref<boolean>(false);

const url = ref<string>('');
const title = ref<string>('');
const tags = ref<string>('');

const tagStore = useTagsStore();
const memeStore = useMemesStore();

const v$ = useVuelidate({}, {}, { $rewardEarly: true });

onMounted((): void => {
	if (!properties.edit) {
		return;
	}

	url.value = imagesById.get()[properties.edit].url;
	title.value = imagesById.get()[properties.edit].title;
	tags.value = (tagStore.tagsByImageId[properties.edit] || []).map(tag => tag.name).join(',');
});

// eslint-disable-next-line max-statements, max-lines-per-function
const handleSubmit = async (): Promise<void> => {
	try {
		const valid = await v$.value.$validate();

		if (!valid) {
			v$.value.$commit();

			return;
		}

		loading.value = true;

		// const { updatedImageID } = upsertImage({
		// 	id: properties.edit,
		// 	title: title.value,
		// 	url: url.value,
		// });

		// let { largestTagID } = tagStore;

		// tagStore.upsert(tagsUpdated);

		// let newTagsForImage: Tag[] = [];

		// const existingTagsForUpdatedImage = tagStore.tagsByImageId[updatedImageID] || []; /* eslint-disable-line unicorn/consistent-destructuring */

		// if (existingTagsForUpdatedImage) {
		// 	newTagsForImage = tagsUpdated.filter((potentialNew: Tag): boolean => !existingTagsForUpdatedImage.some(existing => existing.name === potentialNew.name));
		// }

		// let { largestMemeID } = memeStore;

		// const memesToUpdate = newTagsForImage.map((tag: Tag): Meme => ({
		// 	id: (largestMemeID += 1),
		// 	tag_id: tag.id, /* eslint-disable-line camelcase */
		// 	image_id: updatedImageID, /* eslint-disable-line camelcase */
		// }));

		// const {
		// 	data: memesUpdated,
		// 	error: memesError,
		// } = await $supabase
		// 	.from<Meme>('memes')
		// 	.upsert(memesToUpdate);

		// if (memesError) {
		// 	throw memesError;
		// }

		// memeStore.upsert(memesUpdated);

		await setTimestamp({ $supabase });

		url.value = '';
		title.value = '';
		tags.value = '';

		v$.value.$reset();

		loading.value = false;

		emit('added');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
	}
};
</script>
