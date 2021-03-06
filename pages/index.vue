<template>
	<div>
		<div
			class="grid min-h-[100dvh]"
			:class="[$style['layout']]"
		>
			<div
				class="flex items-baseline gap-x-4 sticky pt-4 px-4 bg-white relative z-1"
				:class="[
					$style['layout__form'],
					keyboard && $style['is-keyboard'],
				]"
			>
				<label
					for="search"
					class="flex flex-grow gap-x-4 items-baseline text-sm font-medium text-gray-900 dark:text-gray-300"
				>
					<span class="sr-only">Your search query</span>
					<input
						id="search"
						v-model.trim="search"
						type="search"
						autocapitalize="none"
						autocorrect="off"
						spellcheck="false"
						class="text-base appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
						placeholder="Search for meme's"
					>
				</label>
				<Button
					class="text-black bg-primary-500 hover:bg-primary-600 focus:ring-primary-700 dark:bg-primary-800 dark:hover:bg-primary-700 dark:focus:ring-primary-600"
					@click="handleAdd"
				>
					Add
				</Button>
			</div>
			<div
				class="px-4"
				:class="[$style['layout__grid']]"
			>
				<Grid class="-m-2" />
			</div>
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
import { storeToRefs } from 'pinia';

import { useDeviceStore } from '@/store/device';
import { useDialogStore } from '@/store/dialog';
import { useImageStore } from '@/store/images';
import { useMemesStore } from '@/store/memes';
import { useTagsStore } from '@/store/tags';

definePageMeta({
	middleware: 'index',
	pageTransition: false,
});

const $supabase = useSupabaseClient();

const search = ref<string>('');

const route = useRoute();
const router = useRouter();

const deviceStore = useDeviceStore();
const dialogStore = useDialogStore();
const imageStore = useImageStore();
const memeStore = useMemesStore();
const tagStore = useTagsStore();

await tagStore.init($supabase);
await memeStore.init($supabase);
await imageStore.init($supabase);

const handleAdd = (): void => {
	dialogStore.create({});
};

const { keyboard } = storeToRefs(deviceStore);

watch(search, (): void => {
	imageStore.modifySearch(search.value);

	router.push({ query: search.value ? { search: encodeURIComponent(search.value) } : {} });
});

onMounted((): void => {
	const { search: searchParameter = '' } = route.query;

	if (!search) {
		return;
	}

	search.value = decodeURIComponent(`${searchParameter}`);
});
</script>

<style module lang="postcss">
.layout {
    grid-template-columns: [grid-start form-start] 1fr [form-end grid-end];
    grid-template-rows: [form-start] max-content [form-end grid-start] 1fr [grid-end];

    &__form {
        grid-area: form;

        @apply top-0 pb-4;
    }

    &__grid {
        grid-area: grid;

        @apply pb-4;
    }

    @media (hover: none) {
        grid-template-rows: [grid-start] 1fr [grid-end form-start] max-content [form-end];

        &__form {
            padding-bottom: calc(1rem + var(--saib));

            @apply top-auto bottom-0;

            &.is-keyboard {
                transform: translateY(var(--saib));
            }
        }

        &__grid {
            @apply pt-4 pb-0;
        }
    }
}
</style>
