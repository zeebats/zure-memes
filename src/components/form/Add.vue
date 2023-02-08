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
import { onMounted, ref } from 'vue';

import { $supabase } from '@/api/supabase';
import Button from '@/components/Button.vue';
import InputTags from '@/components/input/Tags.vue';
import InputTitle from '@/components/input/Title.vue';
import InputUrl from '@/components/input/Url.vue';
import { imagesByID, upsert as upsertImage } from '@/store/images';
import { upsert as upsertMemes } from '@/store/memes';
import { tagsByImageID, upsert as upsertTags } from '@/store/tags';
import { Image } from '@/utilities/images';
import { setTimestamp } from '@/utilities/timestamp';

const properties = withDefaults(defineProps<{
    edit?: Image['id'];
}>(), { edit: undefined /* eslint-disable-line no-undefined */ });

const emit = defineEmits<{
    (e: 'added'): void; /* eslint-disable-line unicorn/prevent-abbreviations, no-unused-vars */
}>();

const loading = ref<boolean>(false);

const url = ref<string>('');
const title = ref<string>('');
const tags = ref<string>('');

const v$ = useVuelidate({}, {}, { $rewardEarly: true });

onMounted((): void => {
	if (!properties.edit) {
		return;
	}

	url.value = imagesByID.get()[properties.edit].url;
	title.value = imagesByID.get()[properties.edit].title;
	tags.value = (tagsByImageID.get()[properties.edit] || []).map(tag => tag.name).join(',');
});

// eslint-disable-next-line max-statements
const handleSubmit = async () => {
	try {
		const valid = await v$.value.$validate();

		if (!valid) {
			v$.value.$commit();

			return;
		}

		loading.value = true;

		const imageID = await upsertImage({
			id: properties.edit,
			title: title.value,
			url: url.value,
		});

		const updatedTags = await upsertTags(tags.value);

		await upsertMemes({
			imageID,
			updatedTags,
		});

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
