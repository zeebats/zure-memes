import {
	action,
	atom,
	computed,
	onMount,
	task,
} from 'nanostores';

import { $supabase } from '@/api/supabase';
import { memes } from '@/store/memes';
import { getColor } from '@/utilities/color';
import { getAllTags, Tag } from '@/utilities/tags';

export interface StoreTag extends Tag {
    color: {
        foreground: string;
        background: string;
    },
}

export const tags = atom<StoreTag[]>([]);

export const largestTagID = computed([tags], tags => Math.max(...tags.map(tag => tag.id)));
export const tagsByID = computed([tags], tags => Object.fromEntries(tags.map(tag => [
	tag.id,
	tag,
])));
export const tagsByName = computed([tags], tags => Object.fromEntries(tags.map(tag => [
	tag.name,
	tag,
])));
export const tagsByImageID = computed([
	tagsByID,
	memes,
], (tagsByID, memes) => Object.fromEntries(memes.map(meme => [
	meme.image_id,
	memes.filter(item => item.image_id === meme.image_id).map(item => tagsByID[item.tag_id] || {}),
])));

// eslint-disable-next-line max-statements
export const upsert = action(tags, 'upsert', async (store, newTags: string) => {
	let newLargestTagID = largestTagID.get();

	const tagsToUpdate = newTags.split(',').map((tag: string) => ({
		id: tagsByName.get()[tag]?.id || (newLargestTagID += 1),
		name: tag,
	}));

	const { error } = await $supabase
		.from<Tag>('tags')
		.upsert(tagsToUpdate);

	if (error) {
		throw error;
	}

	for (const tag of tagsToUpdate) {
		const arrayIndex = store.get().findIndex(storeTag => storeTag.id === tag.id);

		const tagWithColor = Object.freeze({
			...tag,
			color: getColor(tag.name),
		});

		if (arrayIndex === -1) {
			store.set([
				...store.get(),
				tagWithColor,
			]);
		} else {
			store.set([
				...store.get().slice(0, arrayIndex),
				tagWithColor,
				...store.get().slice(arrayIndex + 1),
			]);
		}
	}

	return tagsToUpdate;
});

onMount(tags, () => {
	task(async () => {
		const response = await getAllTags({ $supabase });

		tags.set(response.map(tag => (Object.freeze({
			...tag,
			color: getColor(tag.name),
		}))));
	});
});
