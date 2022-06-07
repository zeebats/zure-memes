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
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                            <span class="text-xs grid gap-y-2">
                                <p
                                    v-for="{ $message, $uid } of $v.newUrl.$errors"
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
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                            <span class="text-xs grid gap-y-2">
                                <p
                                    v-for="{ $message, $uid } of $v.newTitle.$errors"
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
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                            <span class="text-xs">Optional, should be comma seperated: <pre class="inline-block">`tag,tag,tag`</pre></span>
                        </span>
                    </label>
                    <button type="submit" class="flex-grow focus:outline-none text-white !bg-green-700 hover:!bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:!bg-green-600 dark:hover:!bg-green-700 dark:focus:ring-green-800">Submit</button>
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
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                </label>
            </div>

            <hr>

            <div class="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 items-center">
                <figure v-for="{url, title} in images" :key="url">
                    <img :src="url" :alt="title" class="block w-full">
                </figure>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, url } from '@vuelidate/validators';

import { Image, getImages } from '@/utilities/images';
import { Meme, getMemes } from '@/utilities/memes';
import { Tag, getTags } from '@/utilities/tags';
import { setTimestamp } from '@/utilities/timestamp';

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

let controller = null;

let loading = ref(false);

const query = ref('');
const newUrl = ref('');
const newTitle = ref('');
const newTags = ref('');

const { data: tags } = await useAsyncData('tags', async () => getTags({
    $supabase,
    query: query.value,
    controller,
    loading,
}), {watch: [query]});

const { data: memes } = await useAsyncData('memes', () => getMemes({
    $supabase,
    tagIds: tags.value,
    controller,
    loading,
}), {watch: [tags]});

const { data: images } = await useAsyncData('images', () => getImages({
    $supabase,
    imageIds: memes.value,
    controller,
    loading,
}), {watch: [memes]});

const $v = useVuelidate(rules, {
    newTitle,
    newUrl,
});

const handleSubmit = async () => {
    if (!await $v.value.$validate()) return;

    loading.value = true;

    const { data: dataImages } = await $supabase.from<Image>('images').insert({
        url: newUrl.value,
        title: newTitle.value,
    });

    newUrl.value = '';
    newTitle.value = '';

    const image = dataImages.at(0);

    const { id: image_id } = image;

    images.value = [
        image,
        ...images.value,
    ];

    const { data: dataTags } = await $supabase.from<Tag>('tags').insert(newTags.value.split(',').map(tag => ({
        name: tag
    })));

    newTags.value = '';

    $v.value.$reset();

    const { data: dataMemes } = await $supabase.from<Meme>('memes').insert(dataTags.map(({id}) => ({
        image_id,
        tag_id: id,
    })));

    setTimestamp({ $supabase });
}
</script>
