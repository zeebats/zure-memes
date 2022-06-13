<template>
    <NuxtLayout name="default">
        <div class="grid gap-4 p-4">
            <div>
                <div class="font-bold mb-2">Add a meme:</div>
                <form class="flex gap-4 items-start flex-wrap" @submit.prevent="handleSubmit">
                    <label for="url" class="flex flex-grow gap-x-4 items-baseline mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        URL:
                        <span class="grid gap-y-2 flex-grow">
                            <input
                                id="url"
                                type="text"
                                v-model.trim="newUrl"
                                :disabled="loading"
                                autocapitalize="none"
                                autocorrect="off"
                                spellcheck="false"
                                class="text-[16px] appearance-none border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
                                :class="[
                                    loading && 'bg-gray-200',
                                    !loading && 'bg-gray-50',
                                ]"
                                @blur="urlValidation.$commit"
                            >
                            <span class="text-xs grid gap-y-2">
                                <p
                                    v-for="{ $message, $uid } of urlValidation.$errors"
                                    :key="$uid"
                                    class="text-red-600"
                                >
                                    {{ $message }}
                                </p>
                            </span>
                        </span>
                    </label>
                    <label for="title" class="flex flex-grow gap-x-4 items-baseline mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Title:
                        <span class="grid gap-y-2 flex-grow">
                            <input
                                id="title"
                                type="text"
                                v-model.trim="newTitle"
                                :disabled="loading"
                                autocapitalize="none"
                                autocorrect="off"
                                spellcheck="false"
                                class="text-[16px] appearance-none border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
                                :class="[
                                    loading && 'bg-gray-200',
                                    !loading && 'bg-gray-50',
                                ]"
                                @blur="titleValidation.$commit"
                            >
                            <span class="text-xs grid gap-y-2">
                                <p
                                    v-for="{ $message, $uid } of titleValidation.$errors"
                                    :key="$uid"
                                    class="text-red-600"
                                >
                                    {{ $message }}
                                </p>
                            </span>
                        </span>
                    </label>
                    <label for="tags" class="flex flex-grow gap-x-4 items-baseline mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Tags:
                        <span class="grid gap-y-2 flex-grow">
                            <input
                                id="tags"
                                type="text"
                                v-model.trim="newTags"
                                :disabled="loading"
                                autocapitalize="none"
                                autocorrect="off"
                                spellcheck="false"
                                class="text-[16px] appearance-none border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
                                :class="[
                                    loading && 'bg-gray-200',
                                    !loading && 'bg-gray-50',
                                ]"
                            >
                            <span class="text-xs">Optional, should be comma seperated: <pre class="inline-block">`tag,tag,tag`</pre></span>
                        </span>
                    </label>
                    <Button type="submit" class="flex-grow text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-opacity" :class="[loading && 'op-50']">Submit</Button>
                </form>
            </div>

            <hr>

            <div>
                <div class="font-bold mb-2">Search for meme's:</div>
                <label for="search" class="flex gap-x-4 items-baseline mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Query
                    <input
                        id="search"
                        type="search"
                        v-model.trim="query"
                        autocapitalize="none"
                        autocorrect="off"
                        spellcheck="false"
                        class="text-[16px] appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
                    >
                </label>
            </div>

            <hr>

            <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                <Item v-for="{url, title, tags} in imageStore.imagesLoop" :key="url" :url="url" :title="title" :tags="tags" />
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useVuelidate, Validation } from '@vuelidate/core';
import { helpers, required, url } from '@vuelidate/validators';

import { Image } from '@/utilities/images';
import { Meme } from '@/utilities/memes';
import { Tag } from '@/utilities/tags';
import { setTimestamp } from '@/utilities/timestamp';

import { useTagsStore } from '@/store/tags';
import { useMemesStore } from '@/store/memes';
import { useImageStore } from '@/store/images';

definePageMeta({
    middleware: 'auth'
})

const imageExtension = helpers.regex(/\.(gif|jpe?g|png|webp)$/i)

const rules = computed(() => ({
    newTitle: {
        $autoDirty: true,
        $lazy: true,
        required: helpers.withMessage('This can\'t be empty, please enter something', required),
    },
    newUrl: {
        $autoDirty: true,
        $lazy: true,
        required: helpers.withMessage('This can\'t be empty, please enter something', required),
        url: helpers.withMessage('This has to be a link, for example: `https://media.discordapp.net/<something>`', url),
        imageExtension: helpers.withMessage('This has to be a link to an image', imageExtension),
    },
}));

const $supabase = useSupabaseClient();

const loading = ref<boolean>(false);

const query = ref<string>('');
const newUrl = ref<string>('');
const newTitle = ref<string>('');
const newTags = ref<string>('');

const tagStore = useTagsStore();
const memeStore = useMemesStore();
const imageStore = useImageStore();

await tagStore.getTags($supabase);
await memeStore.getMemes($supabase);
await imageStore.getImages($supabase);

watch(query, (): void => tagStore.modifyQuery(query.value))

const v$ = useVuelidate(rules, {
    newTitle,
    newUrl,
}, {
    $rewardEarly: true
});

const urlValidation = computed(() => v$.value.newUrl as Validation)
const titleValidation = computed(() => v$.value.newTitle as Validation)

const handleSubmit = async (): Promise<void> => {
    if (!await v$.value.$validate()) return;

    loading.value = true;

    const { data: dataImages } = await $supabase.from<Image>('images').insert({
        url: newUrl.value,
        title: newTitle.value,
    });

    const image = dataImages.at(0);

    const { id: image_id } = image;

    const { data: dataTags } = await $supabase.from<Tag>('tags').insert(newTags.value.split(',').map(tag => ({
        name: tag
    })));

    await $supabase.from<Meme>('memes').insert(dataTags.map(({id}): { image_id: number; tag_id: number; } => ({
        image_id,
        tag_id: id,
    })));

    await tagStore.getTags($supabase);
    await memeStore.getMemes($supabase);
    await imageStore.getImages($supabase);

    await setTimestamp({ $supabase });

    newUrl.value = '';
    newTitle.value = '';
    newTags.value = '';

    v$.value.$reset();

    loading.value = false;
}
</script>
