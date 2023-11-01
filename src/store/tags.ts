import {
	action,
	atom,
	computed,
	onMount,
	task,
} from 'nanostores';

import { $supabase } from '@/api/supabase';
import { $memes } from '@/store/memes';
import { getColor } from '@/utilities/color';
import { type Tag, getAllTags } from '@/utilities/tags';

/* eslint-disable @typescript-eslint/no-type-alias */
export type StoreTag = {
    color: {
        background: string;
        foreground: string;
    },
} & Tag
/* eslint-enable @typescript-eslint/no-type-alias */

export const $tags = atom<StoreTag[]>([]);

export const largestTagID = computed([$tags], tags => Math.max(...tags.map(({ id }) => id)));
export const tagsByID = computed([$tags], tags => Object.fromEntries(tags.map(tag => [
	tag.id,
	tag,
])));
export const tagsByName = computed([$tags], tags => Object.fromEntries(tags.map(tag => [
	tag.name,
	tag,
])));
export const tagsByImageID = computed([
	tagsByID,
	$memes,
], (computedTagsByID, memes) => Object.fromEntries(memes.map(meme => [
	meme.image_id,
	memes.filter(item => item.image_id === meme.image_id).map(item => computedTagsByID[item.tag_id]),
])));

// eslint-disable-next-line max-statements
export const upsert = action($tags, 'upsert', async (store, newTags: string) => {
	let newLargestTagID = largestTagID.get();

	const tagsToUpdate = newTags.split(',').map((tag: string) => ({
		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
		id: tagsByName.get()[tag]?.id ?? (newLargestTagID += 1),
		name: tag,
	}));

	const { error } = await $supabase
		.from('tags')
		.upsert(tagsToUpdate);

	if (error !== null) {
		throw new Error(JSON.stringify(error));
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

onMount($tags, () => {
	// eslint-disable-next-line no-void
	void task(async () => {
		const response = await getAllTags({ $supabase });

		$tags.set(response.map(tag => (Object.freeze({
			...tag,
			color: getColor(tag.name),
		}))));
	});
});
