<template>
    <div>
        <div class="grid gap-4 p-4">
            <div>
                <div class="font-bold mb-2">Add a meme:</div>
                <FormAdd />
            </div>
            <hr>
            <div>
                <div class="font-bold mb-2">Search for meme's:</div>
                <label
                    for="search"
                    class="flex gap-x-4 items-baseline mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    Query
                    <input
                        id="search"
                        v-model.trim="query"
                        type="search"
                        autocapitalize="none"
                        autocorrect="off"
                        spellcheck="false"
                        class="text-[16px] appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
                    >
                </label>
            </div>
            <hr>
            <Grid class="-m-2" />
        </div>
        <Dialog
            v-for="{id, ...properties} in dialogStore.dialogsById"
            :id="id"
            :key="id"
            :properties="properties"
        />
    </div>
</template>

<script setup lang="ts">
import { useDialogStore } from '@/store/dialog';
import { useImageStore } from '@/store/images';
import { useMemesStore } from '@/store/memes';
import { useTagsStore } from '@/store/tags';

definePageMeta({ middleware: 'auth' });

const $supabase = useSupabaseClient();

const query = ref<string>('');

const route = useRoute();
const router = useRouter();

const tagStore = useTagsStore();
const memeStore = useMemesStore();
const imageStore = useImageStore();
const dialogStore = useDialogStore();

await tagStore.getTags($supabase);
await memeStore.getMemes($supabase);
await imageStore.getImages($supabase);

watch(query, (): void => {
    tagStore.modifyQuery(query.value);

    router.push({ query: query.value ? { query: query.value } : {} });
});

onMounted((): void => {
    const { query: browserQuery = '' } = route.query;

    if (!query) {
        return;
    }

    query.value = `${browserQuery}`;
});
</script>
