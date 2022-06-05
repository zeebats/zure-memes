<template>
    <NuxtLayout name="default">
        <div class="grid gap-4 p-4">
            <div>
                <div class="font-bold mb-2">Add a meme:</div>
                <form class="flex gap-4 items-start flex-wrap" @submit.prevent="handleSubmit">
                    <label for="url" class="flex flex-grow gap-x-4 items-baseline mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        URL:
                        <input
                            id="url"
                            type="text"
                            v-model.trim="url"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                    </label>
                    <label for="title" class="flex flex-grow gap-x-4 items-baseline mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Title:
                        <input
                            id="title"
                            type="text"
                            v-model.trim="title"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
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
                            <span class="text-xs">Should be comma seperated: <pre class="inline-block">`tag,tag,tag`</pre></span>
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

            <div class="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                <figure v-for="{url, title} in images" :key="url">
                    <img :src="url" :alt="title" class="block max-w-full">
                </figure>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { Image, getImages } from '@/utilities/images';
import { Meme, getMemes } from '@/utilities/memes';
import { Tag, getTags } from '@/utilities/tags';
import { setTimestamp } from '@/utilities/timestamp';

const $supabase = useSupabaseClient();

const query = ref('');
const url = ref('');
const title = ref('');
const newTags = ref('');

const { data: tags } = await useAsyncData('tags', async () => getTags({
    $supabase,
    query: query.value,
}), {watch: [query]});

const { data: memes } = await useAsyncData('memes', () => getMemes({
    $supabase,
    tagIds: tags.value,
}), {watch: [tags]});

const { data: images } = await useAsyncData('images', () => getImages({
    $supabase,
    imageIds: memes.value,
}), {watch: [memes]});

const handleSubmit = async () => {
    const { data: dataImages } = await $supabase.from<Image>('images').insert({
        url: url.value,
        title: title.value,
    })

    url.value = '';
    title.value = '';

    const image = dataImages.at(0);

    const { id: image_id } = image;

    images.value.push(image);

    const { data: dataTags } = await $supabase.from<Tag>('tags').insert(newTags.value.split(',').map(tag => ({
        name: tag
    })));

    newTags.value = '';

    const { data: dataMemes } = await $supabase.from<Meme>('memes').insert(dataTags.map(({id}) => ({
        image_id,
        tag_id: id,
    })));

    setTimestamp({ $supabase });
}
</script>
