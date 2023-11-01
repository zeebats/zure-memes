import type { Image } from '@/utilities/images';
import type { Tag } from '@/utilities/tags';

import {
	action,
	atom,
	computed,
	onMount,
	task,
} from 'nanostores';

import { $supabase } from '@/api/supabase';
import { tagsByImageID } from '@/store/tags';
import { type Meme, getAllMemes } from '@/utilities/memes';

export const $memes = atom<Meme[]>([]);

export const largestMemeID = computed([$memes], memes => Math.max(...memes.map(({ id }) => id)));

// eslint-disable-next-line max-statements
export const upsert = action($memes, 'upsert', async (store, {
	imageID,
	updatedTags,
} : {
	imageID: Image['id'];
	updatedTags: Tag[]
}) => {
	let newTagsForImage: Tag[] = [];

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
	const existingTagsForUpdatedImage = tagsByImageID.get()[imageID] || [];

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
	if (existingTagsForUpdatedImage) {
		newTagsForImage = updatedTags.filter((potentialNew: Tag) => !existingTagsForUpdatedImage.some(existing => existing.name === potentialNew.name));
	}

	let newLargestMemeID = largestMemeID.get();

	const memesToUpdate = newTagsForImage.map((tag: Tag) => ({
		id: (newLargestMemeID += 1),
		image_id: imageID, /* eslint-disable-line camelcase, @typescript-eslint/naming-convention */
		tag_id: tag.id, /* eslint-disable-line camelcase, @typescript-eslint/naming-convention */
	}));

	const { error } = await $supabase
		.from('memes')
		.upsert(memesToUpdate);

	if (error !== null) {
		throw new Error(JSON.stringify(error));
	}

	for (const meme of memesToUpdate) {
		const arrayIndex = store.get().findIndex(storeMeme => storeMeme.id === meme.id);

		if (arrayIndex === -1) {
			store.set([
				...store.get(),
				Object.freeze(meme),
			]);
		} else {
			store.set([
				...store.get().slice(0, arrayIndex),
				Object.freeze(meme),
				...store.get().slice(arrayIndex + 1),
			]);
		}
	}

	return memesToUpdate;
});

onMount($memes, () => {
	// eslint-disable-next-line no-void
	void task(async () => {
		const response = await getAllMemes({ $supabase });

		$memes.set(response);
	});
});
