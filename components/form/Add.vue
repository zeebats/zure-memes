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

import { DialogProperties } from '@/store/dialog';
import { useImageStore } from '@/store/images';
import { useMemesStore } from '@/store/memes';
import { useTagsStore } from '@/store/tags';
import { Image } from '@/utilities/images';
import { Meme } from '@/utilities/memes';
import { Tag } from '@/utilities/tags';
import { setTimestamp } from '@/utilities/timestamp';

const properties = withDefaults(defineProps<{
    edit?: DialogProperties['image'];
}>(), { edit: null });

/* eslint-disable unicorn/prevent-abbreviations, no-unused-vars */
const emit = defineEmits<{
    (e: 'added'): void;
}>();
/* eslint-enable unicorn/prevent-abbreviations, no-unused-vars */

const $supabase = useSupabaseClient();

const loading = ref<boolean>(false);

const url = ref<string>('');
const title = ref<string>('');
const tags = ref<string>('');

const tagStore = useTagsStore();
const memeStore = useMemesStore();
const imageStore = useImageStore();

const v$ = useVuelidate();

onMounted((): void => {
    if (!properties.edit) {
        return;
    }

    url.value = imageStore.imagesById[properties.edit].url;
    title.value = imageStore.imagesById[properties.edit].title;
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

        let { largestImageID } = imageStore;

        const {
            data: imageUpdated,
            error: imageError,
        } = await $supabase
            .from<Image>('images')
            .upsert({
                id: properties.edit || (largestImageID += 1),
                url: url.value,
                title: title.value,
            })
            .single();

        if (imageError) {
            throw imageError;
        }

        imageStore.upsert(imageUpdated);

        let { largestTagID } = tagStore;

        const tagsToUpdate = tags.value.split(',').map((tag: string) => ({
            // eslint-disable-next-line unicorn/consistent-destructuring
            id: tagStore.tagsByName[tag]?.id || (largestTagID += 1),
            name: tag,
        }));

        const {
            data: tagsUpdated,
            error: tagsError,
        } = await $supabase
            .from<Tag>('tags')
            .upsert(tagsToUpdate);

        if (tagsError) {
            throw tagsError;
        }

        tagStore.upsert(tagsUpdated);

        let newTagsForImage = [];

        // eslint-disable-next-line unicorn/consistent-destructuring
        const existingTagsForUpdatedImage = tagStore.tagsByImageId[imageUpdated.id] || [];

        if (existingTagsForUpdatedImage) {
            newTagsForImage = tagsUpdated.filter((potentialNew: Tag) => !existingTagsForUpdatedImage.some(existing => existing.name === potentialNew.name));
        }

        let { largestMemeID } = memeStore;

        const memesToUpdate = newTagsForImage.map((tag: Tag) => ({
            // eslint-disable-next-line unicorn/consistent-destructuring
            id: (largestMemeID += 1),
            /* eslint-disable camelcase */
            tag_id: tag.id,
            image_id: imageUpdated.id,
            /* eslint-enable camelcase */
        }));

        const {
            data: memesUpdated,
            error: memesError,
        } = await $supabase
            .from<Meme>('memes')
            .upsert(memesToUpdate);

        if (memesError) {
            throw memesError;
        }

        memeStore.upsert(memesUpdated);

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
